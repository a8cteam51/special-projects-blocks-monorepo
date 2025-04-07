{
	const carousels = document.querySelectorAll( '.wp-block-wpcomsp-carousel' );

	carousels?.forEach( ( carousel ) => {
		initCarousel( carousel );
	} );

	function initCarousel( carousel ) {
		const prevButton = carousel.querySelector(
			'.wp-block-wpcomsp-carousel__prev-next-button.prev'
		);
		const nextButton = carousel.querySelector(
			'.wp-block-wpcomsp-carousel__prev-next-button.next'
		);
		const paginationButtons = carousel.querySelectorAll(
			'.wp-block-wpcomsp-carousel__pagination-button'
		);

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
}
