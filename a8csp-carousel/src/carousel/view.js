/* global getComputedStyle, IntersectionObserver, requestAnimationFrame, ResizeObserver */

import { __, sprintf } from '@wordpress/i18n';
import './view.css';

{
	const SELECTORS = {
		CAROUSEL: '.wp-block-a8csp-carousel',
		TRACK: '.wp-block-a8csp-carousel-track',
		SLIDES: '.wp-block-a8csp-carousel-track > *',
		PREV_BUTTON: '.wp-block-a8csp-carousel-nav--button_prev',
		NEXT_BUTTON: '.wp-block-a8csp-carousel-nav--button_next',
		PAGINATION: '.wp-block-a8csp-carousel-pagination',
		PAGINATION_BUTTONS: '.wp-block-a8csp-carousel-pagination--button',
		FOCUSABLE: 'a, button, input, select, textarea',
	};

	const CLASSES = {
		ANIMATING: 'is-animating',
		ANIMATE_VISIBLE: 'animate-visible',
	};

	// Animation modes control how the carousel behaves at boundaries.
	const ANIMATE_MODES = {
		INFINITE: 'infinite', // Continuous looping.
		JUMP: 'jump', // Jump to opposite end of the track.
	};

	const DEFAULTS = {
		MIN_DRAG_DISTANCE: 5, // Minimum distance required for drag navigation (in px).
		INTERSECTION_THRESHOLD: 0.95, // Threshold for intersection observer (0-1).
		INTERSECTION_MARGIN: '5px', // Margin for intersection observer.
		DRAG_ANGLE_THRESHOLD: Math.PI / 6, // ~30 degrees.
	};

	/**
	 * @typedef {Object} SlideNode
	 *
	 * @property {HTMLElement}    slide The DOM slide element.
	 * @property {SlideNode|null} next  Reference to the next slide in the list.
	 * @property {SlideNode|null} prev  Reference to the previous slide in the list.
	 */
	class SlideNode {
		constructor( slide ) {
			this.slide = slide;
			this.next = null;
			this.prev = null;
		}
	}

	/**
	 * @typedef {Object} CircularDoublyLinkedList
	 *
	 * @property {SlideNode|null} head    The first node in the list.
	 * @property {number}         length  The number of nodes in the list.
	 * @property {Function}       advance Advance the list by a given number of steps.
	 * @property {Function}       retreat Retreat the list by a given number of steps.
	 */
	class CircularDoublyLinkedList {
		constructor( slides ) {
			this.head = null;
			this.length = 0;
			this._buildList( slides );
		}

		_buildList( slides ) {
			if ( ! slides.length ) {
				return;
			}

			let prevNode = null;

			slides.forEach( ( slide, i ) => {
				const node = new SlideNode( slide );

				if ( i === 0 ) {
					this.head = node;
				} else {
					prevNode.next = node;
					node.prev = prevNode;
				}

				prevNode = node;
			} );

			prevNode.next = this.head;
			this.head.prev = prevNode;

			this.length = slides.length;
		}

		advance( node, steps = 1 ) {
			let current = node;
			for ( let i = 0; i < steps; i++ ) {
				current = current.next;
			}
			return current;
		}

		retreat( node, steps = 1 ) {
			let current = node;
			for ( let i = 0; i < steps; i++ ) {
				current = current.prev;
			}
			return current;
		}
	}

	class DragController {
		constructor( { el, minDragDistance, dragAngleThreshold, onNavigate } ) {
			this.el = el;
			this.minDragDistance = minDragDistance;
			this.dragAngleThreshold = dragAngleThreshold;
			this.onNavigate = onNavigate;

			this.resetState();
		}

		resetState() {
			this.startX = 0;
			this.startY = 0;
			this.isHorizontal = false;
			this.dragging = false;
		}

		onStart( x, y ) {
			this.startX = x;
			this.startY = y;
			this.isHorizontal = false;
			this.dragging = true;
		}

		onMove( x, y, event ) {
			if ( ! this.dragging ) {
				return;
			}

			const xDiff = x - this.startX;
			const yDiff = y - this.startY;

			if ( Math.abs( xDiff ) < this.minDragDistance ) {
				return;
			}

			if ( ! this.isHorizontal ) {
				const angle = Math.atan2(
					Math.abs( yDiff ),
					Math.abs( xDiff )
				);
				this.isHorizontal = angle < this.dragAngleThreshold;
			}

			if ( this.isHorizontal ) {
				event.preventDefault();
				this.el.style.userSelect = 'none';

				if ( xDiff > 0 ) {
					this.onNavigate( 'previous' );
				} else {
					this.onNavigate( 'next' );
				}

				this.dragging = false;
			}
		}

		onEnd() {
			this.dragging = false;
			this.el.style.userSelect = '';
		}
	}

	/**
	 * @typedef {Object} CarouselInstance
	 *
	 * @property {HTMLElement}               carousel          The main carousel container element.
	 * @property {HTMLElement}               track             The track element that contains slides.
	 * @property {NodeList}                  slides            Array of all slide DOM elements.
	 * @property {CircularDoublyLinkedList}  slideList         Circular linked list for slide management.
	 * @property {SlideNode}                 currentNode       Current position in the slide list.
	 * @property {HTMLElement|null}          prevButton        Previous navigation button element.
	 * @property {HTMLElement|null}          nextButton        Next navigation button element.
	 * @property {NodeList|null}             paginationButtons Array of pagination button elements.
	 * @property {string|null}               animateEnd        Animation mode setting from data attribute.
	 * @property {ResizeObserver|null}       resizeObserver    ResizeObserver for handling viewport changes.
	 * @property {IntersectionObserver|null} slideObserver     IntersectionObserver for tracking visible slides.
	 */
	class CarouselInstance {
		constructor( carousel ) {
			this.carousel = carousel;
			this.track = carousel.querySelector( SELECTORS.TRACK );
			this.slides = [];
			this.slideList = null;
			this.currentNode = null;
			this.prevButton = null;
			this.nextButton = null;
			this.paginationButtons = null;
			this.animateEnd = null;

			this.resizeObserver = null;
			this.slideObserver = null;
		}

		hasTrackAndSlides() {
			return this.track && this.slides.length > 0;
		}

		isAnimating() {
			return this.carousel.classList.contains( CLASSES.ANIMATING );
		}

		isInfinite() {
			return this.animateEnd === ANIMATE_MODES.INFINITE;
		}

		isBatchMode() {
			return this.carousel.classList.contains( CLASSES.ANIMATE_VISIBLE );
		}

		getTrackGap() {
			return (
				parseFloat(
					getComputedStyle( this.track ).getPropertyValue(
						'column-gap'
					)
				) || 0
			);
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initializeCarousels );
	} else {
		initializeCarousels();
	}

	/**
	 * Initialize all carousels.
	 */
	function initializeCarousels() {
		const carousels = document.querySelectorAll( SELECTORS.CAROUSEL );
		carousels.forEach( initCarousel );
	}

	/**
	 * Initialize the carousel.
	 *
	 * @param {HTMLElement} carousel The carousel element.
	 */
	function initCarousel( carousel ) {
		const instance = new CarouselInstance( carousel );

		if ( ! instance.track ) {
			return;
		}

		instance.slides = carousel.querySelectorAll( SELECTORS.SLIDES );

		if ( ! instance.hasTrackAndSlides() ) {
			return;
		}

		// Initialize components.
		ensureItemCount( instance );
		setupSlideList( instance );
		setupControlButtons( instance );
		setupAnimationMode( instance );

		// Setup observers and interactions.
		setupResizeObserver( instance );
		setupVisibilityObserver( instance );
		setupControlNavigationHandlers( instance );
		setupKeyboardNavigation( instance );
		setupDragNavigation( instance );
	}

	/**
	 * Ensure accuracy of the `--item-count` CSS variable.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function ensureItemCount( instance ) {
		const property = '--item-count';
		const actual = String( instance.slides.length );
		const current = instance.carousel.style
			.getPropertyValue( property )
			.trim();

		if ( actual !== current ) {
			instance.carousel.style.setProperty( property, actual );
		}
	}

	/**
	 * Set up the slide list for the carousel.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function setupSlideList( instance ) {
		instance.slideList = new CircularDoublyLinkedList( instance.slides );
		instance.currentNode = instance.slideList.head;
	}

	/**
	 * Set up the navigation buttons for the carousel.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function setupControlButtons( instance ) {
		const { carousel } = instance;

		instance.prevButton = carousel.querySelector( SELECTORS.PREV_BUTTON );
		instance.nextButton = carousel.querySelector( SELECTORS.NEXT_BUTTON );
		instance.paginationButtons = carousel.querySelectorAll(
			SELECTORS.PAGINATION_BUTTONS
		);
	}

	/**
	 * Set up the animation mode for the carousel.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function setupAnimationMode( instance ) {
		instance.animateEnd = instance.carousel.dataset.animateEnd;
	}

	/**
	 * Set up the observer for handling carousel resizing.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function setupResizeObserver( instance ) {
		instance.resizeObserver = new ResizeObserver( () => {
			realignToFirstVisibleSlide( instance );
		} );

		instance.resizeObserver.observe( instance.carousel );
	}

	/**
	 * Set up the observer for handling slide accessibility.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function setupVisibilityObserver( instance ) {
		const { slides, track } = instance;

		instance.slideObserver = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					const slide = entry.target;
					setSlideAccessibility( slide, entry.isIntersecting );
				} );
				updateControlButtonStates( instance );
			},
			{
				root: track,
				threshold: DEFAULTS.INTERSECTION_THRESHOLD,
				rootMargin: DEFAULTS.INTERSECTION_MARGIN,
			}
		);

		slides.forEach( ( slide ) => {
			instance.slideObserver.observe( slide );
		} );
	}

	/**
	 * Manages accessibility attributes for slides based on visibility.
	 *
	 * Slides outside of the track boundary are marked as `inert` and `aria-hidden`,
	 * preventing screen reader access and keyboard navigation.
	 * The attributes are removed from slides when they enter the track boundary.
	 *
	 * @param {Element} slide     The slide element to toggle accessibility for.
	 * @param {boolean} isVisible Whether the slide is in the track boundary.
	 */
	function setSlideAccessibility( slide, isVisible ) {
		if ( isVisible ) {
			slide.removeAttribute( 'inert' );
			slide.removeAttribute( 'aria-hidden' );
		} else {
			slide.setAttribute( 'inert', '' );
			slide.setAttribute( 'aria-hidden', 'true' );
		}

		slide.querySelectorAll( SELECTORS.FOCUSABLE ).forEach( ( el ) => {
			if ( isVisible ) {
				el.removeAttribute( 'tabindex' );
			} else {
				el.setAttribute( 'tabindex', '-1' );
			}
		} );
	}

	/**
	 * Manages updates to the navigation and pagination button states.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function updateControlButtonStates( instance ) {
		const {
			animateEnd,
			prevButton,
			nextButton,
			paginationButtons,
			slides,
		} = instance;

		const noInactiveNav = [
			ANIMATE_MODES.JUMP,
			ANIMATE_MODES.INFINITE,
		].includes( animateEnd );

		if ( noInactiveNav && ! paginationButtons?.length ) {
			return;
		}

		const setButtonState = ( button, disabled ) => {
			if ( disabled ) {
				button.setAttribute( 'aria-disabled', 'true' );
			} else {
				button.removeAttribute( 'aria-disabled' );
			}
		};

		if ( ! noInactiveNav ) {
			if ( prevButton ) {
				const firstSlideVisible =
					! slides[ 0 ].getAttribute( 'aria-hidden' );
				setButtonState( prevButton, firstSlideVisible );
			}

			if ( nextButton ) {
				const lastSlideVisible =
					! slides[ slides.length - 1 ].getAttribute( 'aria-hidden' );
				setButtonState( nextButton, lastSlideVisible );
			}
		}

		if ( paginationButtons?.length ) {
			paginationButtons.forEach( ( button, index ) => {
				const isActive =
					! slides[ index ].getAttribute( 'aria-hidden' );
				setButtonState( button, isActive );
			} );
		}
	}

	/**
	 * Set up the navigation and pagination for the carousel.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function setupControlNavigationHandlers( instance ) {
		const { prevButton, nextButton } = instance;

		prevButton?.addEventListener( 'click', () => {
			if ( ! instance.isAnimating() ) {
				navigatePrevious( instance );
			}
		} );

		nextButton?.addEventListener( 'click', () => {
			if ( ! instance.isAnimating() ) {
				navigateNext( instance );
			}
		} );

		ensurePaginationButtons( instance );

		instance.paginationButtons?.forEach( ( button, index ) => {
			button.addEventListener( 'click', () => {
				handlePagination( instance, button, index );
			} );
		} );
	}

	/**
	 * Ensures the number of pagination buttons matches the number of slides.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function ensurePaginationButtons( instance ) {
		const { carousel, paginationButtons, slides } = instance;

		const paginationContainer = carousel.querySelector(
			SELECTORS.PAGINATION
		);
		if ( ! paginationContainer ) {
			return;
		}

		const currentCount = paginationButtons?.length || 0;
		if ( slides.length <= currentCount ) {
			return;
		}

		// Create missing pagination buttons.
		for ( let i = currentCount; i < slides.length; i++ ) {
			const button = document.createElement( 'button' );
			button.className = 'wp-block-a8csp-carousel-pagination--button';
			button.innerHTML = `<span class="screen-reader-text">${ sprintf(
				/* translators: 1: current slide number, 2: total slides */
				__( 'Slide %1$d of %2$d', 'a8csp-carousel' ),
				i + 1,
				slides.length
			) }</span>`;
			paginationContainer.appendChild( button );
		}

		// Update the reference.
		instance.paginationButtons = paginationContainer.querySelectorAll(
			SELECTORS.PAGINATION_BUTTONS
		);
	}

	/**
	 * Handles pagination navigation.
	 *
	 * @param {CarouselInstance} instance    The carousel instance.
	 * @param {HTMLElement}      button      The pagination button.
	 * @param {number}           buttonIndex The index of the slide to navigate to.
	 */
	function handlePagination( instance, button, buttonIndex ) {
		const { slides } = instance;

		if ( instance.isAnimating() ) {
			return;
		}

		const targetSlide = slides[ buttonIndex ];
		const targetNode = getNodeForSlide( instance, targetSlide );
		if ( ! targetNode ) {
			return;
		}

		if (
			button.getAttribute( 'aria-disabled' ) === 'true' ||
			targetNode === instance.currentNode
		) {
			return;
		}

		// Animate to the target slide's current offset.
		if ( instance.isInfinite() ) {
			const onComplete = () =>
				commitInfiniteRotation( instance, targetNode, false );

			updateCarousel( instance, targetSlide.offsetLeft * -1, {
				onComplete,
			} );
		} else {
			updateCarousel( instance, targetSlide.offsetLeft * -1 );

			instance.currentNode = targetNode;
		}
	}

	/**
	 * Set up the keyboard navigation for the carousel.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function setupKeyboardNavigation( instance ) {
		const { carousel, prevButton, nextButton } = instance;

		carousel.addEventListener( 'keydown', ( e ) => {
			if ( instance.isAnimating() ) {
				return;
			}

			const canNavigatePrev =
				! prevButton ||
				prevButton.getAttribute( 'aria-disabled' ) !== 'true';
			const canNavigateNext =
				! nextButton ||
				nextButton.getAttribute( 'aria-disabled' ) !== 'true';

			if ( e.key === 'ArrowLeft' && canNavigatePrev ) {
				navigatePrevious( instance );
			} else if ( e.key === 'ArrowRight' && canNavigateNext ) {
				navigateNext( instance );
			} else if ( e.key === 'Home' ) {
				navigateToEdge( instance, 'first' );
			} else if ( e.key === 'End' ) {
				navigateToEdge( instance, 'last' );
			}
		} );
	}

	/**
	 * Set up the drag/swipe navigation for the carousel.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function setupDragNavigation( instance ) {
		const { carousel } = instance;

		// Create DragController instance with navigation callback.
		const dragController = new DragController( {
			el: carousel,
			minDragDistance: DEFAULTS.MIN_DRAG_DISTANCE,
			dragAngleThreshold: DEFAULTS.DRAG_ANGLE_THRESHOLD,
			onNavigate: ( direction ) => {
				if ( ! instance.isAnimating() ) {
					if ( direction === 'next' ) {
						navigateNext( instance );
					} else {
						navigatePrevious( instance );
					}
				}
			},
		} );

		carousel.addEventListener( 'mousedown', ( e ) => {
			dragController.onStart( e.clientX, e.clientY );
		} );

		carousel.addEventListener( 'mousemove', ( e ) => {
			dragController.onMove( e.clientX, e.clientY, e );
		} );

		carousel.addEventListener( 'touchstart', ( e ) => {
			dragController.onStart(
				e.touches[ 0 ].clientX,
				e.touches[ 0 ].clientY
			);
		} );

		carousel.addEventListener( 'touchmove', ( e ) => {
			dragController.onMove(
				e.touches[ 0 ].clientX,
				e.touches[ 0 ].clientY,
				e
			);
		} );

		[ 'touchend', 'mouseup', 'mouseleave' ].forEach( ( eventType ) => {
			carousel.addEventListener( eventType, () =>
				dragController.onEnd()
			);
		} );
	}

	/**
	 * Recalculate the slide positions during resize.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function realignToFirstVisibleSlide( instance ) {
		const { currentNode } = instance;

		if ( ! currentNode?.slide ) {
			return;
		}

		// Use the current logical leftmost slide's offset after resize.
		const newOffset = Math.round( currentNode.slide.offsetLeft * -1 );
		if ( newOffset === 0 ) {
			// Already aligned (e.g., infinite mode where head === currentNode).
			return;
		}

		updateCarousel( instance, newOffset, { animate: false } );
	}

	/**
	 * Navigates to the previous slide.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function navigatePrevious( instance ) {
		navigate( instance, 'previous' );
	}

	/**
	 * Navigates to the next slide.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 */
	function navigateNext( instance ) {
		navigate( instance, 'next' );
	}

	/**
	 * Navigates to the first or last slide.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 * @param {string}           edge     'first' or 'last'.
	 */
	function navigateToEdge( instance, edge ) {
		const { slideList, track } = instance;

		if ( ! slideList?.head ) {
			return;
		}

		const targetNode =
			edge === 'first' ? slideList.head : slideList.head.prev;

		if ( targetNode === instance.currentNode ) {
			return;
		}

		const updateFocus = track.contains( track.ownerDocument.activeElement );

		if ( instance.isInfinite() ) {
			const onComplete = () =>
				commitInfiniteRotation( instance, targetNode, updateFocus );

			updateCarousel( instance, targetNode.slide.offsetLeft * -1, {
				onComplete,
			} );
		} else {
			updateCarousel( instance, targetNode.slide.offsetLeft * -1, {
				updateFocus,
			} );

			instance.currentNode = targetNode;
		}
	}

	/**
	 * Handles navigation.
	 *
	 * Aborts early if the directional navigation button is disabled,
	 * otherwise delegates to the appropriate navigation handler.
	 *
	 * @param {CarouselInstance} instance  The carousel instance.
	 * @param {string}           direction The direction to navigate.
	 */
	function navigate( instance, direction ) {
		const { nextButton, prevButton } = instance;

		const button = direction === 'next' ? nextButton : prevButton;
		if ( button?.getAttribute( 'aria-disabled' ) === 'true' ) {
			return;
		}

		if ( instance.isInfinite() ) {
			navigateInfinite( instance, direction );
		} else {
			navigateWithinBounds( instance, direction );
		}
	}

	/**
	 * Handles standard navigation.
	 *
	 * @param {CarouselInstance} instance  The carousel instance.
	 * @param {string}           direction The direction to navigate.
	 */
	function navigateWithinBounds( instance, direction ) {
		const { track } = instance;

		const newCurrentNode = getTargetNode( instance, direction );
		if ( ! newCurrentNode ) {
			return;
		}

		const updateFocus = track.contains( track.ownerDocument.activeElement );

		updateCarousel( instance, newCurrentNode.slide.offsetLeft * -1, {
			updateFocus,
		} );

		instance.currentNode = newCurrentNode;
	}

	/**
	 * Handles infinite navigation.
	 *
	 * Animates slides out of the track,
	 * moves them to the opposite end after transition,
	 * and resets the current node to maintain visual continuity.
	 *
	 * @param {CarouselInstance} instance  The carousel instance.
	 * @param {string}           direction The direction to navigate.
	 */
	function navigateInfinite( instance, direction ) {
		const { currentNode, slideList, track } = instance;
		const { count, totalWidth } = getAnimationSpan( instance, direction );

		const isNext = direction === 'next';
		const offset = isNext ? -totalWidth : totalWidth;

		const newCurrentNode = isNext
			? slideList.advance( currentNode, count )
			: slideList.retreat( currentNode, count );

		// Update focus after transition if it is currently within the track.
		const updateFocus = track.contains( track.ownerDocument.activeElement );

		// Handle DOM manipulation to maintain visual continuity.
		const onComplete = () =>
			commitInfiniteRotation( instance, newCurrentNode, updateFocus );

		updateCarousel( instance, offset, { onComplete } );
	}

	/**
	 * Determines the slide to navigate to.
	 *
	 * @param {CarouselInstance} instance  The carousel instance.
	 * @param {string}           direction The direction to navigate.
	 */
	function getTargetNode( instance, direction ) {
		const { animateEnd, currentNode, slideList } = instance;
		const isNext = direction === 'next';
		const head = slideList.head;
		const firstVisible = ! head.slide.getAttribute( 'aria-hidden' );
		const lastVisible = ! head.prev.slide.getAttribute( 'aria-hidden' );

		// Wrap at boundaries for jump mode.
		if ( animateEnd === ANIMATE_MODES.JUMP ) {
			// Jump to end.
			if ( ! isNext && firstVisible ) {
				return head.prev;
			}

			// Jump to start.
			if ( isNext && lastVisible ) {
				return head;
			}
		}

		// Step one slide.
		let targetNode = isNext
			? slideList.advance( currentNode, 1 )
			: slideList.retreat( currentNode, 1 );

		// Attempt to fill track for batch mode.
		if ( instance.isBatchMode() ) {
			targetNode = getBatchTargetNode( instance, targetNode, direction );
		}

		// Return calculated target for jump mode within boundaries.
		if ( animateEnd === ANIMATE_MODES.JUMP ) {
			return targetNode;
		}

		// Prevent crossing ends.
		if ( ! isNext && targetNode === head.prev ) {
			return currentNode === head ? null : head;
		}

		if ( isNext && targetNode === head ) {
			return currentNode === head.prev ? null : head.prev;
		}

		return targetNode;
	}

	/**
	 * Determines the slide to navigate to for standard batch navigation.
	 *
	 * Iterates through slides in the given direction
	 * until enough are found to fill the track width.
	 *
	 * @param {CarouselInstance} instance  The carousel instance.
	 * @param {SlideNode}        startNode The starting node.
	 * @param {string}           direction The direction to navigate.
	 *
	 * @return {SlideNode} The node to navigate to.
	 */
	function getBatchTargetNode( instance, startNode, direction ) {
		const { track, slideList } = instance;
		const trackWidth = track.offsetWidth;
		const gap = instance.getTrackGap();

		let currentNode = startNode;
		let totalWidth = 0;
		let optimalNode = startNode;

		do {
			const slideWidth = currentNode.slide.offsetWidth;
			const testWidth =
				totalWidth === 0 ? slideWidth : totalWidth + slideWidth + gap;

			if ( testWidth > trackWidth ) {
				break;
			}

			totalWidth = testWidth;
			optimalNode = currentNode;

			// Prevent wrapping across boundaries for non-infinite navigation.
			if (
				( direction === 'next' &&
					currentNode === slideList.head.prev ) ||
				( direction !== 'next' && currentNode === slideList.head )
			) {
				break;
			}

			currentNode =
				direction === 'next'
					? slideList.advance( currentNode, 1 )
					: slideList.retreat( currentNode, 1 );
		} while ( currentNode !== startNode );

		return optimalNode;
	}

	/**
	 * Finds the SlideNode corresponding to a given slide element.
	 *
	 * @param {CarouselInstance} instance The carousel instance.
	 * @param {HTMLElement}      slide    The slide element to match.
	 *
	 * @return {SlideNode|null} The matching node, or null if not found.
	 */
	function getNodeForSlide( instance, slide ) {
		const { slideList } = instance;
		if ( ! slideList?.head ) {
			return null;
		}

		let node = slideList.head;
		do {
			if ( node.slide === slide ) {
				return node;
			}
			node = node.next;
		} while ( node !== slideList.head );

		return null;
	}

	/**
	 * Returns the total number of slides and width to animate.
	 *
	 * @param {CarouselInstance} instance  The carousel instance.
	 * @param {string}           direction The direction to navigate.
	 *
	 * @return {Object} The number of slides and width to animate.
	 */
	function getAnimationSpan( instance, direction = 'next' ) {
		const { slideList, currentNode, track } = instance;

		if ( ! slideList || ! currentNode || ! track ) {
			return { count: 0, totalWidth: 0 };
		}

		const isBatch = instance.isBatchMode();
		const gap = instance.getTrackGap();
		const trackWidth = isBatch ? track.offsetWidth : null;

		let count = 0;
		let node = currentNode;
		let totalWidth = 0;

		do {
			const slideWidth = node.slide.offsetWidth;

			if ( count > 0 ) {
				totalWidth += gap;
			}

			if ( ! isBatch && count >= 1 ) {
				break;
			}

			if (
				trackWidth !== null &&
				totalWidth + slideWidth > trackWidth &&
				count > 0
			) {
				break;
			}

			totalWidth += slideWidth;
			count++;

			node = direction === 'next' ? node.next : node.prev;
		} while ( node !== currentNode );

		return { count, totalWidth };
	}

	/**
	 * Moves the carousel by the given offset via CSS transform,
	 * optionally animating, restoring focus, or executing
	 * a callback after the transition completes.
	 *
	 * @param {CarouselInstance} instance            The carousel instance.
	 * @param {number}           offset              The distance to move the carousel.
	 * @param {Object}           options             Behavior flags.
	 * @param {boolean}          options.animate     Animate the transition (default: true).
	 * @param {boolean}          options.updateFocus After movement, move focus into the current slide (default: false).
	 * @param {Function|null}    options.onComplete  Callback to execute after transition completes (default: null).
	 */
	function updateCarousel(
		instance,
		offset,
		{ animate = true, updateFocus = false, onComplete = null } = {}
	) {
		const { carousel, slides } = instance;

		if ( animate ) {
			carousel.classList.add( CLASSES.ANIMATING );
		}

		slides.forEach( ( slide ) => {
			slide.style.transform = `translate3d(${ offset }px, 0, 0)`;
		} );

		const handleCompletion = () => {
			if ( onComplete ) {
				onComplete();
			}

			if ( updateFocus ) {
				// Ensure the target slide can receive focus even if its visibility
				// is not yet updated by the IntersectionObserver.
				setSlideAccessibility( instance.currentNode.slide, true );

				// Defer focus reset by one frame for good measure.
				requestAnimationFrame( () => {
					instance.currentNode.slide
						.querySelector( SELECTORS.FOCUSABLE )
						?.focus();
				} );
			}
		};

		const onTransitionEnd = () => {
			carousel.classList.remove( CLASSES.ANIMATING );
			handleCompletion();
		};

		if ( animate ) {
			slides[ 0 ].addEventListener( 'transitionend', onTransitionEnd, {
				once: true,
			} );
		} else {
			handleCompletion();
		}
	}

	/**
	 * Reorders DOM and updates list pointers after an infinite-mode animation
	 * so that `targetNode` becomes the new head/current node, then resets
	 * transforms to zero. Optionally restores focus into the track.
	 *
	 * @param {CarouselInstance} instance    The carousel instance.
	 * @param {SlideNode}        targetNode  The node that should become head/current.
	 * @param {boolean}          updateFocus Whether to refocus inside the track.
	 */
	function commitInfiniteRotation(
		instance,
		targetNode,
		updateFocus = false
	) {
		const { slideList, track } = instance;

		let node = slideList.head;
		while ( node !== targetNode ) {
			track.appendChild( node.slide );
			node = node.next;
		}

		slideList.head = targetNode;
		instance.currentNode = targetNode;

		// Reset position to zero without animation; optionally restore focus.
		updateCarousel( instance, 0, { animate: false, updateFocus } );
	}
}
