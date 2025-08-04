/* global getComputedStyle, IntersectionObserver, ResizeObserver */

import './view.css';

{
	document.addEventListener( 'DOMContentLoaded', () => {
		const carousels = document.querySelectorAll(
			'.wp-block-wpcomsp-carousel'
		);
		carousels?.forEach( ( carousel ) => {
			initCarousel( carousel );
		} );
	} );

	/**
	 * Initialize the carousel.
	 *
	 * @param {Element} carousel The carousel element.
	 */
	function initCarousel( carousel ) {
		const instance = {
			carousel,
			track: carousel.querySelector(
				'.wp-block-gallery, .wp-block-post-template, .wp-block-wpcomsp-carousel-track, .wc-block-product-template'
			),
			slides: [],
			slideList: null,
			currentNode: null,
			prevButton: null,
			nextButton: null,
			paginationButtons: null,
			uncroppedGallery: false,
			animateEnd: null,
		};

		if ( ! instance.track ) {
			return;
		}

		instance.slides = Array.from(
			carousel.querySelectorAll(
				'.wp-block-gallery > .wp-block-image, .wp-block-post-template > .wp-block-post, .wp-block-wpcomsp-carousel-track > *, .wc-block-product-template .wc-block-product'
			)
		);

		if ( instance.slides.length === 0 ) {
			return;
		}

		// Create circular doubly linked list representing slides.
		instance.slideList = new CircularDoublyLinkedList( instance.slides );

		// Start with the first slide as current start node.
		instance.currentNode = instance.slideList.head;

		instance.prevButton = carousel.querySelector(
			'.wp-block-wpcomsp-carousel-nav--button_prev'
		);
		instance.nextButton = carousel.querySelector(
			'.wp-block-wpcomsp-carousel-nav--button_next'
		);
		instance.paginationButtons = carousel.querySelectorAll(
			'.wp-block-wpcomsp-carousel-pagination--button'
		);

		instance.animateEnd = instance.carousel.dataset.animateEnd;

		if ( 'infinite' === instance.animateEnd ) {
			setupInfiniteCarousel( instance );
		}

		setupResizeObserver( instance );
		setupSlideObserver( instance );
		setupNavigation( instance );
		setupKeyboardNavigation( instance );
		setupDragNavigation( instance );
	}

	/**
	 * Set up the observer for handling carousel resizing.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function setupResizeObserver( instance ) {
		const { carousel } = instance;

		const resizeObserver = new ResizeObserver( () => {
			recalculateSlidePositions( instance );
		} );

		resizeObserver.observe( carousel );
	}

	/**
	 * Set up the observer for handling slide accessibility.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function setupSlideObserver( instance ) {
		const { slides, track } = instance;

		const focusable = 'a, button, input, select, textarea';

		const slideObserver = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					const slide = entry.target;

					if ( entry.isIntersecting ) {
						slide.removeAttribute( 'inert' );

						// Inert should be good enough, but just in case.
						slide.removeAttribute( 'aria-hidden' );
						slide
							.querySelectorAll( focusable )
							.forEach( ( child ) => {
								child.removeAttribute( 'tabindex' );
							} );
					} else {
						slide.setAttribute( 'inert', '' );

						// Inert should be good enough, but just in case.
						slide.setAttribute( 'aria-hidden', 'true' );
						slide
							.querySelectorAll( focusable )
							.forEach( ( child ) => {
								child.setAttribute( 'tabindex', '-1' );
							} );
					}

					updateButtonStates( instance );
				} );
			},
			{
				root: track,
				threshold: 0.95, // Give slides some grace during resizing.
				margin: '5px', // Give slides some grace during resizing.
			}
		);

		slides.forEach( ( slide ) => {
			slideObserver.observe( slide );
		} );
	}

	/**
	 * Set up the navigation for the carousel.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function setupNavigation( instance ) {
		const { carousel, paginationButtons, prevButton, nextButton, slides } =
			instance;

		prevButton?.addEventListener( 'click', () => {
			if ( ! carousel.classList.contains( 'is-animating' ) ) {
				navigatePrevious( instance );
			}
		} );

		nextButton?.addEventListener( 'click', () => {
			if ( ! carousel.classList.contains( 'is-animating' ) ) {
				navigateNext( instance );
			}
		} );

		// Ensure that a pagination button exists for each slide.
		if ( paginationButtons && slides.length > paginationButtons.length ) {
			const paginationContainer = paginationButtons[ 0 ]?.parentElement;
			if ( paginationContainer ) {
				for (
					let i = paginationButtons.length;
					i < slides.length;
					i++
				) {
					const button = document.createElement( 'button' );
					button.className =
						'wp-block-wpcomsp-carousel-pagination--button';
					button.innerHTML = `<span class="screen-reader-text">Slide ${
						i + 1
					} of ${ slides.length }</span>`;

					paginationContainer.appendChild( button );
				}
				// Update the `paginationButtons` reference.
				instance.paginationButtons =
					paginationContainer.querySelectorAll(
						'.wp-block-wpcomsp-carousel-pagination--button'
					);
			}
		}

		instance.paginationButtons?.forEach( ( button, index ) => {
			button.addEventListener( 'click', () => {
				if ( ! carousel.classList.contains( 'is-animating' ) ) {
					updateCarousel( instance, slides[ index ].offsetLeft * -1 );
				}
			} );
		} );
	}

	/**
	 * Set up the keyboard navigation for the carousel.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function setupKeyboardNavigation( instance ) {
		const { carousel, prevButton, nextButton } = instance;

		carousel.addEventListener( 'keydown', ( e ) => {
			if ( carousel.classList.contains( 'is-animating' ) ) {
				return;
			}

			if (
				e.key === 'ArrowLeft' &&
				( ! prevButton ||
					prevButton.getAttribute( 'aria-disabled' ) !== 'true' )
			) {
				navigatePrevious( instance );
			} else if (
				e.key === 'ArrowRight' &&
				( ! nextButton ||
					nextButton.getAttribute( 'aria-disabled' ) !== 'true' )
			) {
				navigateNext( instance );
			}
		} );
	}

	/**
	 * Set up the drag/swipe navigation for the carousel.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function setupDragNavigation( instance ) {
		const { carousel } = instance;
		const minDistance = 5;

		let startX;
		let startY;
		let isHorizontal;
		let dragging = false;

		function onStart( x, y ) {
			startX = x;
			startY = y;
			isHorizontal = false;
			dragging = true;
		}

		function onMove( x, y, event ) {
			if ( ! dragging ) {
				return;
			}

			const xDiff = x - startX;
			const yDiff = y - startY;

			if ( Math.abs( xDiff ) < minDistance ) {
				return;
			}

			// Determine if direction is generally horizontal.
			// Not as applicable for mouse events,
			// but the math is lightweight enough.
			if ( ! isHorizontal ) {
				const angle = Math.atan2(
					Math.abs( yDiff ),
					Math.abs( xDiff )
				);

				// ~30 degree threshold.
				isHorizontal = angle < Math.PI / 6;
			}

			if ( isHorizontal ) {
				event.preventDefault();

				if ( xDiff > 0 ) {
					navigatePrevious( instance );
				} else {
					navigateNext( instance );
				}

				dragging = false;
			}
		}

		function onEnd() {
			dragging = false;
		}

		carousel.addEventListener( 'mousedown', ( e ) => {
			// Prevent text selection.
			e.preventDefault();

			onStart( e.clientX, e.clientY );
		} );

		carousel.addEventListener( 'mousemove', ( e ) => {
			onMove( e.clientX, e.clientY, e );
		} );

		carousel.addEventListener( 'touchstart', ( e ) => {
			onStart( e.touches[ 0 ].clientX, e.touches[ 0 ].clientY );
		} );

		carousel.addEventListener( 'touchmove', ( e ) => {
			onMove( e.touches[ 0 ].clientX, e.touches[ 0 ].clientY, e );
		} );

		[ 'touchend', 'mouseup', 'mouseleave' ].forEach( ( eventType ) => {
			carousel.addEventListener( eventType, onEnd );
		} );
	}

	/**
	 * Recalculate the slide positions during resize.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function recalculateSlidePositions( instance ) {
		const { slides, track } = instance;

		const firstVisible = slides.find(
			( slide ) => ! slide.getAttribute( 'aria-hidden' )
		);

		if ( firstVisible ) {
			const firstVisibleIndex = slides.indexOf( firstVisible );

			if ( firstVisibleIndex === 0 ) {
				return;
			}

			const gapValue =
				getComputedStyle( track ).getPropertyValue( 'gap' );
			const gap = parseFloat( gapValue ) || 0;

			let totalOffset = 0;

			for ( let i = 0; i < firstVisibleIndex; i++ ) {
				totalOffset += slides[ i ].offsetWidth + gap;
			}

			updateCarousel( instance, Math.round( totalOffset * -1 ), true );
		}
	}

	/**
	 * Navigate to the previous slide(s).
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function navigatePrevious( instance ) {
		navigate( instance, 'previous' );
	}

	/**
	 * Navigate to the next slide(s).
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function navigateNext( instance ) {
		navigate( instance, 'next' );
	}

	/**
	 * Navigate the carousel.
	 *
	 * @param {Object} instance  The carousel instance.
	 * @param {string} direction The direction to navigate.
	 */
	function navigate( instance, direction ) {
		const { prevButton, nextButton, animateEnd, slideList, currentNode } =
			instance;

		const button = direction === 'previous' ? prevButton : nextButton;
		if ( button?.getAttribute( 'aria-disabled' ) === 'true' ) {
			return;
		}

		if ( animateEnd === 'infinite' && slideList && currentNode ) {
			handleCircularNavigate( instance, direction );
		} else {
			handleStandardNavigate( instance, direction );
		}
	}

	/**
	 * Handle infinite mode navigation.
	 *
	 * @param {Object} instance  The carousel instance.
	 * @param {string} direction The direction to navigate.
	 */
	function handleCircularNavigate( instance, direction ) {
		const { slideList, currentNode, carousel, track } = instance;
		const isBatch = carousel.classList.contains( 'animate-visible' );
		const step = isBatch ? getVisibleSlidesCount( instance ) : 1;
		const isNext = direction === 'next';

		// Calculate new current start node based on direction and step count.
		const newCurrentNode = isNext
			? slideList.advance( currentNode, step )
			: slideList.retreat( currentNode, step );

		instance.currentNode = newCurrentNode;

		let offset = -newCurrentNode.slide.offsetLeft;

		if ( ! isNext ) {
			let node = newCurrentNode;
			let total = 0;

			while ( node !== currentNode ) {
				total += node.slide.offsetWidth + getItemGap( track );
				node = node.next;
			}
			offset = total;
		}

		const updateFocus = track.contains( track.ownerDocument.activeElement );
		updateCarousel( instance, offset, false );

		const onTransitionEnd = () => {
			let node = slideList.head;
			while ( node !== newCurrentNode ) {
				track.appendChild( node.slide );
				node = node.next;
			}
			slideList.head = newCurrentNode;

			updateCarousel( instance, 0, true, updateFocus );

			carousel.classList.remove( 'is-animating' );
		};

		carousel.addEventListener( 'transitionend', onTransitionEnd, {
			once: true,
		} );
		carousel.classList.add( 'is-animating' );
	}

	/**
	 * Handle standard navigation.
	 *
	 * @param {Object} instance  The carousel instance.
	 * @param {string} direction The direction to navigate.
	 */
	function handleStandardNavigate( instance, direction ) {
		const { carousel, track, slides } = instance;
		const isPrevious = direction === 'previous';
		const isBatch = carousel.classList.contains( 'animate-visible' );

		const searchOrder =
			! isPrevious && isBatch ? [ ...slides ].reverse() : slides;

		// Find the visible slide from which to offset.
		const visibleSlide = searchOrder.find(
			( slide ) => ! slide.getAttribute( 'aria-hidden' )
		);

		const targetSlide = isPrevious
			? getPreviousSlide( instance, visibleSlide )
			: getNextSlide( instance, visibleSlide );

		if ( ! targetSlide ) {
			return;
		}

		const updateFocus = track.contains( track.ownerDocument.activeElement );

		updateCarousel(
			instance,
			targetSlide.offsetLeft * -1,
			false,
			updateFocus
		);
	}

	/**
	 * Get the previous slide target.
	 *
	 * @param {Object}  instance The carousel instance.
	 * @param {Element} offset   The offset of the current slide.
	 */
	function getPreviousSlide( instance, offset ) {
		const { carousel, slides, track, animateEnd } = instance;
		let prev = offset?.previousElementSibling;

		if ( animateEnd === 'jump' && ! prev ) {
			prev = slides[ slides.length - 1 ];
		}

		if ( carousel.classList.contains( 'animate-visible' ) && prev ) {
			const trackWidth = track.offsetWidth;
			const gap = getItemGap( track );
			let currentSlide = prev;
			let totalWidth = 0;
			let target = null;

			while ( currentSlide ) {
				const slideWidth = currentSlide.offsetWidth;
				totalWidth =
					totalWidth === 0
						? slideWidth
						: totalWidth + slideWidth + gap;
				if ( totalWidth > trackWidth ) {
					break;
				}
				target = currentSlide;
				currentSlide = currentSlide.previousElementSibling;
			}

			prev = target || prev;
		}

		return prev;
	}

	/**
	 * Get the next slide target.
	 *
	 * @param {Object}  instance The carousel instance.
	 * @param {Element} offset   The offset of the current slide.
	 */
	function getNextSlide( instance, offset ) {
		const { slides, animateEnd } = instance;
		let next = offset?.nextElementSibling;

		if ( animateEnd === 'jump' && ! next ) {
			next = slides[ 0 ];
		}

		return next;
	}

	/**
	 * Get the number of visible slides.
	 *
	 * @param {Object} instance The carousel instance.
	 *
	 * @return {number} The number of visible slides.
	 */
	function getVisibleSlidesCount( instance ) {
		const { track, slideList } = instance;
		const trackWidth = track.offsetWidth;
		const gap =
			parseFloat( getComputedStyle( track ).getPropertyValue( 'gap' ) ) ||
			0;

		let count = 0;
		let totalWidth = 0;
		let node = slideList.head;

		do {
			const slideWidth = node.slide.offsetWidth;
			totalWidth =
				count === 0 ? slideWidth : totalWidth + slideWidth + gap;

			if ( totalWidth > trackWidth ) {
				break;
			}

			count++;
			node = node.next;
		} while ( node !== slideList.head );

		return count;
	}

	/**
	 * Update the carousel.
	 *
	 * @param {Object}  instance    The carousel instance.
	 * @param {number}  offset      The offset to move the carousel to.
	 * @param {boolean} resizing    Whether the carousel is being resized.
	 * @param {boolean} updateFocus Whether to update the focus.
	 */
	function updateCarousel(
		instance,
		offset,
		resizing = false,
		updateFocus = false
	) {
		const { carousel, track, slides } = instance;

		if ( ! resizing ) {
			carousel.classList.add( 'is-animating' );
		}

		slides.forEach( ( slide ) => {
			slide.style.transform = `translate3d(${ offset }px, 0, 0)`;
		} );

		const firstSlide = slides[ 0 ];

		const onTransitionEnd = () => {
			carousel.classList.remove( 'is-animating' );

			// If the flag is set and the track no longer contains the focused element,
			// we can assume the focus was lost during the transition.
			// In that case, set focus within the first slide.
			if (
				updateFocus &&
				! track.contains( track.ownerDocument.activeElement )
			) {
				// Delay slightly to account for DOM updates.
				setTimeout( () => {
					slides[ 0 ]
						.querySelector( 'a, button, input, select, textarea' )
						?.focus();
				}, 50 );
			}
		};

		firstSlide.addEventListener( 'transitionend', onTransitionEnd, {
			once: true,
		} );
	}

	/**
	 * Update the button states.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function updateButtonStates( instance ) {
		const {
			animateEnd,
			prevButton,
			nextButton,
			paginationButtons,
			slides,
		} = instance;

		const noInactiveNav = [ 'jump', 'infinite' ].includes( animateEnd );

		if ( noInactiveNav && ! paginationButtons ) {
			return;
		}

		if ( prevButton && ! noInactiveNav ) {
			if ( ! slides[ 0 ].getAttribute( 'aria-hidden' ) ) {
				prevButton.setAttribute( 'aria-disabled', 'true' );
			} else {
				prevButton.removeAttribute( 'aria-disabled' );
			}
		}

		if ( nextButton && ! noInactiveNav ) {
			if ( ! slides[ slides.length - 1 ].getAttribute( 'aria-hidden' ) ) {
				nextButton.setAttribute( 'aria-disabled', 'true' );
			} else {
				nextButton.removeAttribute( 'aria-disabled' );
			}
		}

		if ( paginationButtons ) {
			paginationButtons.forEach( ( button, index ) => {
				if ( slides[ index ].getAttribute( 'aria-hidden' ) ) {
					button.removeAttribute( 'aria-disabled' );
				} else {
					button.setAttribute( 'aria-disabled', 'true' );
				}
			} );
		}
	}

	/**
	 * Set up the infinite carousel.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function setupInfiniteCarousel( instance ) {
		const { carousel } = instance;

		if ( ! carousel.classList.contains( 'has-overflow-hidden' ) ) {
			// Placeholder for future infinite carousel setup.
		}
	}

	/**
	 * Get the item gap.
	 *
	 * It might make sense to make this a property of the instance.
	 * In that case, it would need to be recalculated on resize to
	 * accommodate themes that change gap via clamp or breakpoints.
	 *
	 * @param {Element} track The track element.
	 *
	 * @return {number} The item gap.
	 */
	function getItemGap( track ) {
		return (
			parseFloat(
				getComputedStyle( track ).getPropertyValue( 'column-gap' )
			) || 0
		);
	}
}

class SlideNode {
	constructor( slide ) {
		this.slide = slide;
		this.next = null;
		this.prev = null;
	}
}

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
