{
	document.addEventListener( 'DOMContentLoaded', () => {
		const carousels = document.querySelectorAll(
			'.wp-block-wpcomsp-carousel'
		);
		carousels?.forEach( ( carousel ) => {
			initCarousel( carousel );
		} );
	} );

	function initCarousel( carousel ) {
		const track = carousel.querySelector(
			'.wp-block-gallery, .wp-block-query, .wc-block-product-template'
		);

		if ( ! track ) {
			return;
		}

		const slides = Array.from(
			track.querySelectorAll(
				'.wp-block-image, .wp-block-post, .wc-block-product'
			)
		);

		if ( slides.length === 0 ) {
			return;
		}

		const prevButton = carousel.querySelector(
			'.wp-block-wpcomsp-carousel__prev-next-button.prev'
		);
		const nextButton = carousel.querySelector(
			'.wp-block-wpcomsp-carousel__prev-next-button.next'
		);
		const paginationButtons = carousel.querySelectorAll(
			'.wp-block-wpcomsp-carousel__pagination-button'
		);

		const uncroppedGallery =
			track.classList.contains( 'wp-block-gallery' ) &&
			! track.classList.contains( 'is-cropped' );

		if ( uncroppedGallery ) {
			setBaseHeight( carousel, track );
		}

		setupResizeObserver( carousel, track, slides, uncroppedGallery );
		setupSlideObserver( carousel, slides, prevButton, nextButton );
		setupNavigation(
			carousel,
			track,
			slides,
			prevButton,
			nextButton,
			paginationButtons
		);
		setupKeyboardNavigation( carousel, prevButton, nextButton );
	}

	function setupResizeObserver( carousel, track, slides, uncroppedGallery ) {
		const resizeObserver = new ResizeObserver( () => {
			if ( uncroppedGallery ) {
				setBaseHeight( carousel, track );
			}

			recalculateSlidePositions( carousel, track, slides );
		} );

		resizeObserver.observe( carousel );
	}

	function setupSlideObserver( carousel, slides, prevButton, nextButton ) {
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

					updateButtonStates( slides, prevButton, nextButton );
				} );
			},
			{
				root: carousel,
				threshold: 0.95,
				margin: '5px',
			}
		);

		slides.forEach( ( slide ) => {
			slideObserver.observe( slide );
		} );
	}

	function setupNavigation(
		carousel,
		track,
		slides,
		prevButton,
		nextButton,
		paginationButtons
	) {
		prevButton?.addEventListener( 'click', () => {
			previousSlide( carousel, track, slides, prevButton );
		} );

		nextButton?.addEventListener( 'click', () => {
			nextSlide( carousel, slides, nextButton );
		} );

		paginationButtons?.forEach( ( button, index ) => {
			button.addEventListener( 'click', () => {
				updateCarousel(
					carousel,
					slides,
					slides[ index ].offsetLeft * -1
				);
			} );
		} );
	}

	function setupKeyboardNavigation( carousel, prevButton, nextButton ) {
		carousel.addEventListener( 'keydown', ( e ) => {
			if (
				e.key === 'ArrowLeft' &&
				prevButton.getAttribute( 'aria-disabled' ) !== 'true'
			) {
				previousSlide( carousel, slides, prevButton );
			} else if (
				e.key === 'ArrowRight' &&
				nextButton.getAttribute( 'aria-disabled' ) !== 'true'
			) {
				nextSlide( carousel, slides, nextButton );
			}
		} );
	}

	function previousSlide( carousel, track, slides, prevButton ) {
		if ( prevButton.getAttribute( 'aria-disabled' ) === 'true' ) {
			return;
		}

		let offsetter = slides.find(
			( slide ) => ! slide.getAttribute( 'aria-hidden' )
		);

		let prevSlide = offsetter?.previousElementSibling;

		if ( carousel.classList.contains( 'animate-visible' ) ) {
			const carouselWidth = carousel.offsetWidth;
			const gap = parseFloat(
				getComputedStyle( track ).getPropertyValue( 'gap' )
			);

			let currentSlide = prevSlide;
			let totalWidth = 0;
			let targetSlide = null;

			while ( currentSlide ) {
				const slideWidth = currentSlide.offsetWidth;

				if ( totalWidth === 0 ) {
					totalWidth = slideWidth;
				} else {
					totalWidth += slideWidth + gap;
				}

				if ( totalWidth > carouselWidth ) {
					break;
				}

				targetSlide = currentSlide;
				currentSlide = currentSlide.previousElementSibling;
			}

			if ( targetSlide ) {
				prevSlide = targetSlide;
			}
		}

		if ( prevSlide ) {
			updateCarousel( carousel, slides, prevSlide.offsetLeft * -1 );
		}
	}

	function nextSlide( carousel, slides, nextButton ) {
		if ( nextButton.getAttribute( 'aria-disabled' ) === 'true' ) {
			return;
		}

		const offsetter = carousel.classList.contains( 'animate-visible' )
			? slides.findLast(
					( slide ) => ! slide.getAttribute( 'aria-hidden' )
			  )
			: slides.find( ( slide ) => ! slide.getAttribute( 'aria-hidden' ) );
		const nextSlide = offsetter?.nextElementSibling;

		if ( nextSlide ) {
			updateCarousel( carousel, slides, nextSlide.offsetLeft * -1 );
		}
	}

	function updateCarousel( carousel, slides, offset, resize = false ) {
		if ( ! resize ) {
			carousel.classList.add( 'is-animating' );
		}

		slides.forEach( ( slide ) => {
			slide.style.transform = `translate3d(${ offset }px, 0, 0)`;
		} );

		slides[ 0 ].addEventListener( 'transitionend', () => {
			carousel.classList.remove( 'is-animating' );
		} );
	}

	function updateButtonStates( slides, prevButton, nextButton ) {
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

	function recalculateSlidePositions( carousel, track, slides ) {
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

			updateCarousel(
				carousel,
				slides,
				Math.round( totalOffset * -1 ),
				true
			);
		}
	}

	// Add base height for uncropped galleries.
	function setBaseHeight( carousel, track ) {
		const images = track.querySelectorAll( 'img' );
		const itemGap = parseFloat(
			getComputedStyle( track ).getPropertyValue( 'column-gap' )
		);
		const targetWidth = carousel.offsetWidth / 3 - itemGap;

		let widestImage = track.querySelector( '.is-widest' );
		let maxWidth = 0;

		if ( ! widestImage ) {
			// Find the proportionally widest image.
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
}
