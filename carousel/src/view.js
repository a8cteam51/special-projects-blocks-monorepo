/* global getComputedStyle, IntersectionObserver, ResizeObserver */
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
				'.wp-block-gallery, .wp-block-post-template, .wp-block-group, .wc-block-product-template'
			),
			slides: [],
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
				'.wp-block-gallery > .wp-block-image, .wp-block-post-template > .wp-block-post, :scope > .wp-block-group > *, .wc-block-product-template .wc-block-product'
			)
		);

		if ( instance.slides.length === 0 ) {
			return;
		}

		instance.prevButton = carousel.querySelector(
			'.wp-block-wpcomsp-carousel__prev-next-button.prev'
		);
		instance.nextButton = carousel.querySelector(
			'.wp-block-wpcomsp-carousel__prev-next-button.next'
		);
		instance.paginationButtons = carousel.querySelectorAll(
			'.wp-block-wpcomsp-carousel__pagination-button'
		);

		instance.uncroppedGallery =
			instance.track.classList.contains( 'wp-block-gallery' ) &&
			! instance.track.classList.contains( 'is-cropped' );

		instance.animateEnd = instance.carousel.dataset.animateEnd;

		if ( instance.uncroppedGallery ) {
			setBaseHeight( instance );
		}

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
		const { carousel, uncroppedGallery } = instance;

		const resizeObserver = new ResizeObserver( () => {
			if ( uncroppedGallery ) {
				setBaseHeight( instance );
			}

			recalculateSlidePositions( instance );
		} );

		resizeObserver.observe( carousel );
	}

	/**
	 * Set up the observer for handling slide accessbility.
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function setupSlideObserver( instance ) {
		const { slides, track } = instance;

		const slideObserver = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					const slide = entry.target;

					if ( entry.isIntersecting ) {
						slide.removeAttribute( 'aria-hidden' );
						slide.removeAttribute( 'tabindex' );
					} else {
						slide.setAttribute( 'aria-hidden', 'true' );
						slide.setAttribute( 'tabindex', '-1' );
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

		paginationButtons?.forEach( ( button, index ) => {
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
				prevButton.getAttribute( 'aria-disabled' ) !== 'true'
			) {
				navigatePrevious( instance );
			} else if (
				e.key === 'ArrowRight' &&
				nextButton.getAttribute( 'aria-disabled' ) !== 'true'
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

			const gap = parseFloat(
				getComputedStyle( track ).getPropertyValue( 'gap' )
			);

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
		const { carousel, slides, prevButton, track, animateEnd } = instance;

		if ( prevButton.getAttribute( 'aria-disabled' ) === 'true' ) {
			return;
		}

		const offsetter = slides.find(
			( slide ) => ! slide.getAttribute( 'aria-hidden' )
		);

		let previous = offsetter?.previousElementSibling;

		// Move the last slide to the beginning of the carousel if there is no previous slide.
		// This is very rough and will need to be revisited.
		if ( 'infinite' === animateEnd && ! previous ) {
			const lastSlide = slides[ slides.length - 1 ];

			instance.slides.pop();
			instance.slides.unshift( lastSlide );

			track.prepend( lastSlide );

			const itemGap = parseFloat(
				getComputedStyle( track ).getPropertyValue( 'column-gap' )
			);
			const offset = lastSlide.offsetWidth + itemGap;

			updateCarousel( instance, -offset, true );

			previous = lastSlide;
		}

		if ( carousel.classList.contains( 'animate-visible' ) ) {
			const trackWidth = track.offsetWidth;
			const gap = parseFloat(
				getComputedStyle( track ).getPropertyValue( 'gap' )
			);

			let currentSlide = previous;
			let totalWidth = 0;
			let targetSlide = null;

			while ( currentSlide ) {
				const slideWidth = currentSlide.offsetWidth;

				if ( totalWidth === 0 ) {
					totalWidth = slideWidth;
				} else {
					totalWidth += slideWidth + gap;
				}

				if ( totalWidth > trackWidth ) {
					break;
				}

				targetSlide = currentSlide;
				currentSlide = currentSlide.previousElementSibling;
			}

			if ( targetSlide ) {
				previous = targetSlide;
			}
		}

		if ( previous ) {
			updateCarousel( instance, previous.offsetLeft * -1 );
		}
	}

	/**
	 * Navigate to the next slide(s).
	 *
	 * @param {Object} instance The carousel instance.
	 */
	function navigateNext( instance ) {
		const { carousel, track, slides, nextButton, animateEnd } = instance;

		if ( nextButton.getAttribute( 'aria-disabled' ) === 'true' ) {
			return;
		}

		const offsetter = carousel.classList.contains( 'animate-visible' )
			? slides.findLast(
					( slide ) => ! slide.getAttribute( 'aria-hidden' )
			  )
			: slides.find( ( slide ) => ! slide.getAttribute( 'aria-hidden' ) );

		const next = offsetter?.nextElementSibling;

		if ( next ) {
			updateCarousel( instance, next.offsetLeft * -1 );
		}

		// Move the first slide to the end of the carousel after animating.
		// This is also very rough and will need to be revisited.
		if ( 'infinite' === animateEnd ) {
			const firstSlide = slides[ 0 ];

			const onInfiniteNext = () => {
				firstSlide.removeEventListener(
					'transitionend',
					onInfiniteNext
				);

				instance.slides.shift();
				instance.slides.push( firstSlide );

				track.append( firstSlide );

				updateCarousel( instance, 0, true );
			};

			firstSlide.addEventListener( 'transitionend', onInfiniteNext );
		}
	}

	/**
	 * Update the carousel.
	 *
	 * @param {Object}  instance The carousel instance.
	 * @param {number}  offset   The offset to move the carousel to.
	 * @param {boolean} resizing Whether the carousel is being resized.
	 */
	function updateCarousel( instance, offset, resizing = false ) {
		const { carousel, slides } = instance;

		if ( ! resizing ) {
			carousel.classList.add( 'is-animating' );
		}

		slides.forEach( ( slide ) => {
			slide.style.transform = `translate3d(${ offset }px, 0, 0)`;
		} );

		const firstSlide = slides[ 0 ];

		const onTransitionEnd = () => {
			firstSlide.removeEventListener( 'transitionend', onTransitionEnd );

			carousel.classList.remove( 'is-animating' );
		};

		firstSlide.addEventListener( 'transitionend', onTransitionEnd );
	}

	/**
	 * Update the button states.
	 *
	 * @param {Object}  instance            The carousel instance.
	 * @param {Element} instance.slides     The slides.
	 * @param {Element} instance.prevButton The previous button.
	 * @param {Element} instance.nextButton The next button.
	 * @param {string}  instance.animateEnd The animation end.
	 */
	function updateButtonStates( {
		slides,
		prevButton,
		nextButton,
		animateEnd,
	} ) {
		if ( 'infinite' === animateEnd ) {
			return;
		}

		if ( prevButton ) {
			if ( ! slides[ 0 ].getAttribute( 'aria-hidden' ) ) {
				prevButton.setAttribute( 'aria-disabled', 'true' );
			} else {
				prevButton.removeAttribute( 'aria-disabled' );
			}
		}

		if ( nextButton ) {
			if ( ! slides[ slides.length - 1 ].getAttribute( 'aria-hidden' ) ) {
				nextButton.setAttribute( 'aria-disabled', 'true' );
			} else {
				nextButton.removeAttribute( 'aria-disabled' );
			}
		}
	}

	/**
	 * Set the base height for uncropped galleries.
	 *
	 * @param {Object}  instance          The carousel instance.
	 * @param {Element} instance.carousel The carousel element.
	 * @param {Element} instance.track    The track element.
	 */
	function setBaseHeight( { carousel, track } ) {
		const images = track.querySelectorAll( 'img' );
		const itemGap = parseFloat(
			getComputedStyle( track ).getPropertyValue( 'column-gap' )
		);
		const targetWidth = carousel.offsetWidth / 3 - itemGap;

		let widestImage = track.querySelector( '.is-widest' );
		let maxWidth = 0;

		// Find the proportionally widest image.
		if ( ! widestImage ) {
			images.forEach( ( img ) => {
				const width = Number( img.getAttribute( 'width' ) );
				const height = Number( img.getAttribute( 'height' ) );
				const aspectRatio = width / height;
				const scaledWidth = targetWidth * aspectRatio;

				if ( scaledWidth > maxWidth ) {
					maxWidth = scaledWidth;
					widestImage = img;
				}
			} );
		}

		if ( widestImage ) {
			widestImage.classList.add( 'is-widest' );

			const width = Math.min(
				targetWidth,
				Number( widestImage.getAttribute( 'width' ) )
			);
			const aspectRatio =
				Number( widestImage.getAttribute( 'width' ) ) /
				Number( widestImage.getAttribute( 'height' ) );
			const baseHeight = Math.round( width / aspectRatio );

			carousel.style.setProperty( '--base-height', `${ baseHeight }px` );
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
}
