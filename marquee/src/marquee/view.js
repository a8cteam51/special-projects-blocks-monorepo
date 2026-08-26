/**
 * Front-end behavior for the Marquee block.
 *
 * Enqueued via the `viewScript` property in `block.json`.
 *
 * Responsibilities:
 * - Measure one copy of the marquee content and duplicate it enough times to
 *   fill (and overflow) the visible track, so the CSS animation loops seamlessly.
 * - Publish `--marquee-translate` and `--duration` for the `marquee` keyframes.
 * - Support any number of instances per page, including instances that are
 *   hidden at load time (modals, tabs, accordions) or injected later.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

const MARQUEE_SELECTOR = '.wp-block-a8csp-marquee';
const ITEMS_SELECTOR = '.marquee-items';

/**
 * Hard ceiling on the number of copies of the original content.
 *
 * This is defense in depth only: the measurement guard in `update()` is what
 * actually prevents a runaway loop. If we ever hit this cap something is wrong
 * with the measurement, so it warns rather than failing silently.
 *
 * @type {number}
 */
const MAX_COPIES = 60;

/** @type {WeakMap<Element, Object>} Per-instance state, keyed by the block root. */
const instances = new WeakMap();

/** @type {WeakMap<Element, Element>} Observed child -> owning block root. */
const marqueeOf = new WeakMap();

/** @type {Set<Element>} Instances awaiting a measure pass on the next frame. */
const pending = new Set();

let frameRequest = 0;

/**
 * Logs a namespaced warning.
 *
 * @param {string}  message The message to log.
 * @param {Element} element The element the message relates to.
 */
function warn( message, element ) {
	// eslint-disable-next-line no-console
	console.warn( `[a8csp/marquee] ${ message }`, element );
}

/**
 * A width is only usable if it is a real, positive number. Anything else means
 * the element is not laid out yet (display:none, zero-width parent, empty
 * content) and must be treated as "measure again later", never as a loop bound.
 *
 * @param {number} value The measured value.
 *
 * @return {boolean} True when the value can be used for layout math.
 */
function isUsableSize( value ) {
	return Number.isFinite( value ) && value > 0;
}

/**
 * Queues an instance for measurement on the next animation frame. Multiple
 * signals (resize, image load, injection) collapse into a single pass.
 *
 * @param {Element} marquee The block root.
 */
function scheduleUpdate( marquee ) {
	pending.add( marquee );

	if ( frameRequest ) {
		return;
	}

	frameRequest = window.requestAnimationFrame( () => {
		frameRequest = 0;
		const batch = Array.from( pending );
		pending.clear();
		batch.forEach( update );
	} );
}

/**
 * Applies the play state derived from visibility and hover.
 *
 * @param {Object} state The instance state.
 */
function updatePlayState( state ) {
	state.itemsContainer.style.setProperty(
		'--play-state',
		state.visible && ! state.hovered ? 'running' : 'paused'
	);
}

/**
 * Grows or shrinks the track to the requested number of copies of the original
 * content. The original nodes are never re-parsed: copies are cloned from a
 * template captured at init, so images stay cached and item identity is kept.
 *
 * @param {Object} state  The instance state.
 * @param {number} copies Total number of copies the track should contain.
 */
function applyCopies( state, copies ) {
	const { itemsContainer, template, originalCount } = state;

	if ( copies > state.copies ) {
		const fragment = document.createDocumentFragment();
		for ( let i = state.copies; i < copies; i++ ) {
			fragment.appendChild( template.cloneNode( true ) );
		}
		itemsContainer.appendChild( fragment );
	} else if ( copies < state.copies ) {
		const keep = copies * originalCount;
		while ( itemsContainer.children.length > keep ) {
			itemsContainer.removeChild( itemsContainer.lastElementChild );
		}
	}

	state.copies = copies;
}

/**
 * Measures one copy of the content, decides how many copies are needed, and
 * publishes the animation custom properties. Safe to call any number of times.
 *
 * @param {Element} marquee The block root.
 */
function update( marquee ) {
	const state = instances.get( marquee );

	if ( ! state || ! marquee.isConnected ) {
		return;
	}

	const { itemsContainer, originalCount } = state;

	// Measure only the pristine first copy; appending copies must not feed back
	// into the measurement.
	const items = Array.prototype.slice.call(
		itemsContainer.children,
		0,
		originalCount
	);

	const gap =
		parseFloat(
			window.getComputedStyle( itemsContainer ).getPropertyValue( 'gap' )
		) || 0;

	const itemsWidth = items.reduce(
		( sum, item ) => sum + item.offsetWidth,
		0
	);
	const totalWidth = itemsWidth + gap * items.length;
	const containerWidth = marquee.offsetWidth;

	// The guard. Zero/NaN/Infinity widths are a reason to stop, not to loop:
	// `containerWidth * 2 / 0` is `Infinity`, and `i < Infinity` never ends.
	// The ResizeObserver calls us back as soon as the element has a real size.
	if ( ! isUsableSize( totalWidth ) || ! isUsableSize( containerWidth ) ) {
		if ( isUsableSize( containerWidth ) && ! state.warnedZeroWidth ) {
			state.warnedZeroWidth = true;
			warn(
				'Marquee content measured 0px wide while the block is visible; animation is on hold until the items report a size.',
				marquee
			);
		}
		return;
	}

	state.warnedZeroWidth = false;

	const minTotal = containerWidth * 2;
	let copies = Math.max( 2, Math.ceil( minTotal / totalWidth ) );

	if ( copies > MAX_COPIES ) {
		warn(
			`Marquee needed ${ copies } copies to fill the track (content ${ totalWidth }px, track ${ containerWidth }px); capping at ${ MAX_COPIES }. The loop may visibly restart.`,
			marquee
		);
		copies = MAX_COPIES;
	}

	// Nothing measurable changed, so leave the running animation alone.
	const signature = `${ totalWidth }:${ copies }`;
	if ( state.signature === signature ) {
		return;
	}
	state.signature = signature;

	applyCopies( state, copies );

	itemsContainer.style.setProperty(
		'--marquee-translate',
		`${ totalWidth }px`
	);

	const duration = ( itemsContainer.scrollWidth / state.speed ) * 0.5;
	itemsContainer.style.setProperty( '--duration', `${ duration }s` );
}

/**
 * Re-measures whenever the block or its track changes size: window resizes,
 * images finishing loading, and — critically — a hidden instance (modal, tab)
 * gaining a real size for the first time.
 */
const resizeObserver = window.ResizeObserver
	? new window.ResizeObserver( ( entries ) => {
			entries.forEach( ( entry ) => {
				const marquee = instances.has( entry.target )
					? entry.target
					: marqueeOf.get( entry.target );

				if ( marquee ) {
					scheduleUpdate( marquee );
				}
			} );
	  } )
	: null;

/**
 * Pauses off-screen instances so a page full of marquees does not keep the
 * compositor busy animating things nobody can see.
 */
const visibilityObserver = window.IntersectionObserver
	? new window.IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					const state = instances.get( entry.target );
					if ( ! state ) {
						return;
					}
					state.visible = entry.isIntersecting;
					updatePlayState( state );
				} );
			},
			{ rootMargin: '200px' }
	  )
	: null;

/**
 * Sets up a single marquee instance.
 *
 * @param {Element} marquee The block root.
 */
function initMarquee( marquee ) {
	if ( instances.has( marquee ) ) {
		return;
	}

	const itemsContainer = marquee.querySelector( ITEMS_SELECTOR );
	if ( ! itemsContainer ) {
		warn( `Could not find ${ ITEMS_SELECTOR } container.`, marquee );
		return;
	}

	const originalItems = Array.from( itemsContainer.children );
	if ( ! originalItems.length ) {
		warn( 'Marquee has no items to scroll.', marquee );
		return;
	}

	// speed is set by a class like speed-50, meaning 50 is the value of the speed.
	let speed = 50;
	const speedClass = Array.from( marquee.classList ).find( ( cls ) =>
		cls.startsWith( 'speed-' )
	);
	if ( speedClass ) {
		speed = parseInt( speedClass.replace( 'speed-', '' ), 10 ) || 50;
	}
	if ( ! isUsableSize( speed ) ) {
		speed = 50;
	}

	const template = document.createDocumentFragment();
	originalItems.forEach( ( item ) => {
		template.appendChild( item.cloneNode( true ) );
	} );

	const state = {
		itemsContainer,
		template,
		originalCount: originalItems.length,
		copies: 1,
		speed,
		signature: '',
		visible: true,
		hovered: false,
		warnedZeroWidth: false,
	};

	instances.set( marquee, state );
	marqueeOf.set( itemsContainer, marquee );

	if ( marquee.classList.contains( 'has-pause-on-hover' ) ) {
		marquee.addEventListener( 'mouseenter', () => {
			state.hovered = true;
			updatePlayState( state );
		} );

		marquee.addEventListener( 'mouseleave', () => {
			state.hovered = false;
			updatePlayState( state );
		} );
	}

	if ( resizeObserver ) {
		// The block root tracks the available width; the items track tracks
		// content width (late-loading images, web fonts, injected items).
		resizeObserver.observe( marquee );
		resizeObserver.observe( itemsContainer );
	} else {
		window.addEventListener( 'resize', () => scheduleUpdate( marquee ) );
		window.addEventListener( 'load', () => scheduleUpdate( marquee ) );
	}

	if ( visibilityObserver ) {
		visibilityObserver.observe( marquee );
	}

	scheduleUpdate( marquee );
}

/**
 * Initializes every marquee inside a root node. Non-element nodes (text nodes
 * from a MutationObserver, for instance) are ignored.
 *
 * @param {Element|Document} root The node to search.
 */
function initWithin( root ) {
	if ( ! root || typeof root.querySelectorAll !== 'function' ) {
		return;
	}

	if ( typeof root.closest === 'function' ) {
		// Covers both the node itself and content injected into a marquee that
		// was empty (and therefore skipped) at init time.
		const owner = root.closest( MARQUEE_SELECTOR );
		if ( owner ) {
			initMarquee( owner );
		}
	}

	root.querySelectorAll( MARQUEE_SELECTOR ).forEach( initMarquee );
}

/**
 * Picks up marquees injected after load (modals, AJAX, block previews).
 */
function watchForNewMarquees() {
	if ( ! window.MutationObserver ) {
		return;
	}

	new window.MutationObserver( ( mutations ) => {
		mutations.forEach( ( mutation ) => {
			mutation.addedNodes.forEach( initWithin );
		} );
	} ).observe( document.body, { childList: true, subtree: true } );
}

let started = false;

function start() {
	if ( started ) {
		return;
	}
	started = true;

	initWithin( document.body );
	watchForNewMarquees();
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', start );
} else {
	start();
}
