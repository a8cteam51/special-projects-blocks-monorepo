{
	const carousels = document.querySelectorAll( '.wp-block-wpcomsp-carousel' );

	carousels?.forEach( ( carousel ) => {
		initCarousel( carousel );
	} );

	function initCarousel( carousel ) {
		const track = carousel.querySelector(
			'.wp-block-query, .wp-block-gallery, .wc-block-product-template'
		);

		if ( ! track ) {
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

		if (
			track.classList.contains( 'wp-block-gallery' ) &&
			! track.classList.contains( 'is-cropped' )
		) {
			addBaseHeight( carousel, track );

			const resizeObserver = new ResizeObserver( () => {
				addBaseHeight( carousel, track );
			} );

			resizeObserver.observe( carousel );
		}

		const updateCarousel = () => {
			console.log( 'updateCarousel' ); // eslint-disable-line no-console
		};

		prevButton.addEventListener( 'click', () => {
			updateCarousel();
		} );

		nextButton.addEventListener( 'click', () => {
			updateCarousel();
		} );

		paginationButtons.forEach( ( button ) => {
			button.addEventListener( 'click', () => {
				updateCarousel();
			} );
		} );
	}

	function addBaseHeight( carousel, track ) {
		const images = track.querySelectorAll( 'img' );
		const containerWidth = carousel.offsetWidth;
		const itemGap = parseFloat(
			getComputedStyle( track ).getPropertyValue( 'column-gap' )
		);
		const targetWidth = containerWidth / 3 - itemGap;

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
