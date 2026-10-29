/**
 * Single-visible-slide carousel engine. Slides, rail items and captions are
 * parallel arrays kept in sync by index. The arrows are the accessible
 * control; the rail and touch swipes are pointer shortcuts.
 */

import { __, sprintf } from '@wordpress/i18n';

import { getSlideWindow } from './slide-window';

const BLOCK = 'wp-block-newspack-photo-carousel';
const SLIDES_SELECTOR = `.${ BLOCK }__slides`;
const SLIDE_IMAGE_SELECTOR = `.${ BLOCK }__slide-image`;
const RAIL_SELECTOR = `.${ BLOCK }__rail`;
const GOTO_SELECTOR = `.${ BLOCK }__goto`;
const PREV_SELECTOR = `.${ BLOCK }__prev`;
const NEXT_SELECTOR = `.${ BLOCK }__next`;
const CAPTION_SELECTOR = `.${ BLOCK }__caption`;
const CAPTION_STATUS_SELECTOR = `.${ BLOCK }__caption-status`;

// Hover dwell before a rail item starts its slide's download: a sweep across
// the rail shouldn't fetch every photo it crosses.
const WARM_DELAY = 150;

// Horizontal travel, in px, that turns a touch drag on the stage into a step.
const SWIPE_DISTANCE = 40;

const prefersReducedMotion = () =>
	window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

// Puts `is-active` on the element at `active` only.
function markActive( elements, active ) {
	elements.forEach( ( element, index ) =>
		element.classList.toggle( 'is-active', index === active )
	);
}

export default class PhotoCarousel {
	constructor( root ) {
		this.root = root;
		this.stage = root.querySelector( SLIDES_SELECTOR );

		// Bails before step()'s modulo divides by zero.
		this.slides = this.stage ? Array.from( this.stage.children ) : [];
		if ( ! this.slides.length ) {
			return;
		}

		this.rail = root.querySelector( RAIL_SELECTOR );
		this.gotos = Array.from( root.querySelectorAll( GOTO_SELECTOR ) );
		this.railItems = this.gotos.map(
			( goto ) => goto.closest( 'li' ) || goto
		);
		this.prevButtons = Array.from( root.querySelectorAll( PREV_SELECTOR ) );
		this.nextButtons = Array.from( root.querySelectorAll( NEXT_SELECTOR ) );
		this.captions = Array.from( root.querySelectorAll( CAPTION_SELECTOR ) );
		this.captionStatus = root.querySelector( CAPTION_STATUS_SELECTOR );
		this.images = this.slides.map( ( slide ) =>
			slide.querySelector( SLIDE_IMAGE_SELECTOR )
		);
		this.active = 0;
		this.previous = 0;
		this.warmTimer = null;

		this.autoplay = root.dataset.autoplay === '1';
		this.delay = Math.max(
			1000,
			parseInt( root.dataset.autoplayDelay, 10 ) || 5000
		);
		this.timer = null;

		this.bind();

		// Nothing has changed yet, so don't announce into the live region.
		this.render( { announce: false } );

		this.start();
	}

	// WCAG 2.2.2: never runs while the user is engaged, or under reduced motion.
	start() {
		if ( this.timer || ! this.autoplay || this.slides.length < 2 ) {
			return;
		}

		if ( prefersReducedMotion() || document.hidden ) {
			return;
		}

		// goTo()/step() also restart, with focus still on the control just used.
		if (
			this.root.matches( ':hover' ) ||
			this.root.contains( this.root.ownerDocument.activeElement )
		) {
			return;
		}

		this.timer = setInterval(
			() => this.step( 1, { announce: false } ),
			this.delay
		);
	}

	stop() {
		if ( this.timer ) {
			clearInterval( this.timer );
			this.timer = null;
		}
	}

	destroy() {
		this.stop();
		clearTimeout( this.warmTimer );
		document.removeEventListener(
			'visibilitychange',
			this.onVisibilityChange
		);
	}

	bind() {
		this.prevButtons.forEach( ( button ) =>
			button.addEventListener( 'click', () => this.step( -1 ) )
		);
		this.nextButtons.forEach( ( button ) =>
			button.addEventListener( 'click', () => this.step( 1 ) )
		);

		this.bindRail();
		this.bindSwipe();

		// Arrow keys page the carousel whenever focus is inside the region.
		this.root.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'ArrowLeft' ) {
				event.preventDefault();
				this.step( -1 );
			} else if ( event.key === 'ArrowRight' ) {
				event.preventDefault();
				this.step( 1 );
			}
		} );

		[ 'pointerenter', 'focusin' ].forEach( ( type ) =>
			this.root.addEventListener( type, () => this.stop() )
		);
		[ 'pointerleave', 'focusout' ].forEach( ( type ) =>
			this.root.addEventListener( type, () => this.start() )
		);

		// A background tab throttles timers unevenly; stop rather than drift.
		this.onVisibilityChange = () =>
			document.hidden ? this.stop() : this.start();
		document.addEventListener(
			'visibilitychange',
			this.onVisibilityChange
		);
	}

	bindRail() {
		this.gotos.forEach( ( goto, index ) => {
			// Click covers keyboard too: a native button fires it on Enter/Space.
			goto.addEventListener( 'click', () => this.goTo( index ) );

			// A far slide isn't loaded yet: start it on hover intent or press.
			goto.addEventListener( 'pointerenter', () => {
				clearTimeout( this.warmTimer );
				this.warmTimer = setTimeout(
					() => this.warm( index ),
					WARM_DELAY
				);
			} );
			goto.addEventListener( 'pointerleave', () =>
				clearTimeout( this.warmTimer )
			);
			[ 'pointerdown', 'focus' ].forEach( ( type ) =>
				goto.addEventListener( type, () => this.warm( index ) )
			);
		} );
	}

	/**
	 * Steps on a horizontal touch or pen swipe across the stage. The stage's
	 * `touch-action: pan-y` leaves vertical drags to the page, which cancels
	 * the pointer instead of ending it.
	 */
	bindSwipe() {
		let origin = null;

		this.stage.addEventListener( 'pointerdown', ( event ) => {
			origin =
				'mouse' === event.pointerType
					? null
					: { x: event.clientX, y: event.clientY };
		} );
		this.stage.addEventListener( 'pointercancel', () => {
			origin = null;
		} );
		this.stage.addEventListener( 'pointerup', ( event ) => {
			if ( ! origin ) {
				return;
			}

			const dx = event.clientX - origin.x;
			const dy = event.clientY - origin.y;
			origin = null;

			if (
				Math.abs( dx ) < SWIPE_DISTANCE ||
				Math.abs( dx ) <= Math.abs( dy )
			) {
				return;
			}

			// Swiping toward the reading start moves forward.
			const rtl =
				'rtl' === window.getComputedStyle( this.root ).direction;
			this.step( dx < 0 !== rtl ? 1 : -1 );
		} );
	}

	render( { announce = true } = {} ) {
		this.renderWindow();

		markActive( this.slides, this.active );
		markActive( this.gotos, this.active );
		markActive( this.captions, this.active );
		this.captions.forEach( ( caption, index ) =>
			caption.setAttribute(
				'aria-hidden',
				String( index !== this.active )
			)
		);

		if ( announce ) {
			this.announceActiveCaption();
		}

		this.revealActiveInRail();
	}

	/**
	 * Hides slides outside getSlideWindow(), so their lazy images wait; a
	 * stacked slide is always "in view", so `loading="lazy"` alone loads all.
	 */
	renderWindow() {
		const kept = getSlideWindow(
			this.active,
			this.slides.length,
			this.previous
		);
		const activeSlide = this.slides[ this.active ];
		const activeImage = this.images[ this.active ];
		const wasHidden = activeSlide.hidden;

		// The render marks later slides low; the one the user picked isn't.
		if (
			this.active !== this.previous &&
			activeImage &&
			! activeImage.complete
		) {
			activeImage.fetchPriority = 'high';
		}

		this.slides.forEach( ( slide, index ) => {
			slide.hidden = ! kept.has( index );
		} );

		// Lay it out before it turns active, or the fade-in is skipped.
		if ( wasHidden ) {
			activeSlide.getBoundingClientRect();
		}

		// Decode ahead so a step paints at once.
		kept.forEach( ( index ) => {
			if ( index !== this.active && this.images[ index ] ) {
				this.images[ index ].decode().catch( () => {} );
			}
		} );
	}

	/**
	 * Shows a slide outside the window, still invisible, so its lazy image
	 * starts. The next render() hides it again unless it joined the window.
	 *
	 * @param {number} index Slide index.
	 */
	warm( index ) {
		const slide = this.slides[ index ];
		if ( slide ) {
			slide.hidden = false;
		}
	}

	/**
	 * Writes "Slide N of M: {caption}" into the visually-hidden live-region
	 * status node: arrows never move focus into the stage, so this is what
	 * announces a slide change to screen readers.
	 */
	announceActiveCaption() {
		if ( ! this.captionStatus ) {
			return;
		}

		const activeCaption = this.captions[ this.active ];
		const captionText = activeCaption
			? activeCaption.textContent.trim()
			: '';
		const position = sprintf(
			/* translators: 1: slide number, 2: total number of slides. */
			__( 'Slide %1$d of %2$d', 'newspack-photo-carousel' ),
			this.active + 1,
			this.slides.length
		);

		this.captionStatus.textContent = captionText
			? sprintf(
					/* translators: 1: slide position, 2: slide caption. */
					__( '%1$s: %2$s', 'newspack-photo-carousel' ),
					position,
					captionText
				)
			: position;
	}

	/**
	 * Scrolls the rail only as far as needed to keep the active thumbnail
	 * and its immediate neighbors fully visible (not a pure re-center, which
	 * can leave a neighbor half-clipped). Scrolls the rail only:
	 * `scrollIntoView` would move the page too.
	 */
	revealActiveInRail() {
		const rail = this.rail;
		const activeItem = this.railItems[ this.active ];
		if ( ! rail || ! activeItem || rail.scrollWidth <= rail.clientWidth ) {
			return;
		}

		const prevItem = this.railItems[ this.active - 1 ];
		const nextItem = this.railItems[ this.active + 1 ];

		const windowStart = prevItem
			? prevItem.offsetLeft
			: activeItem.offsetLeft;
		const windowEnd = nextItem
			? nextItem.offsetLeft + nextItem.offsetWidth
			: activeItem.offsetLeft + activeItem.offsetWidth;

		let left = rail.scrollLeft;

		if ( windowEnd - windowStart > rail.clientWidth ) {
			// Window too wide for the rail: center the active item alone.
			left =
				activeItem.offsetLeft -
				( rail.clientWidth - activeItem.offsetWidth ) / 2;
		} else if ( windowStart < rail.scrollLeft ) {
			left = windowStart;
		} else if ( windowEnd > rail.scrollLeft + rail.clientWidth ) {
			left = windowEnd - rail.clientWidth;
		}

		rail.scrollTo( {
			left: Math.max( 0, left ),
			behavior: prefersReducedMotion() ? 'auto' : 'smooth',
		} );
	}

	step( delta, { announce = true } = {} ) {
		const count = this.slides.length;
		this.show( ( this.active + delta + count ) % count, { announce } );

		// Give the slide the user landed on a full dwell.
		if ( announce ) {
			this.restart();
		}
	}

	goTo( index ) {
		if ( index < 0 || index >= this.slides.length ) {
			return;
		}
		this.show( index );
		this.restart();
	}

	show( index, { announce = true } = {} ) {
		this.previous = this.active;
		this.active = index;
		this.render( { announce } );
	}

	restart() {
		this.stop();
		this.start();
	}
}
