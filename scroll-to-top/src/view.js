document.addEventListener( 'DOMContentLoaded', function () {
	const scrollToTopContainer = document.querySelector(
		'.scroll-to-top-container'
	);

	if ( scrollToTopContainer ) {
		const scrollToTopButton = scrollToTopContainer.querySelector(
			'.scroll-to-top-button'
		);

		if ( scrollToTopButton.dataset.position === 'fixed' ) {
			window.addEventListener( 'scroll', function () {
				if ( window.scrollY > 200 ) {
					// To appear the scroll button after scrolling 200px
					scrollToTopContainer.classList.add( 'show' );
				} else {
					scrollToTopContainer.classList.remove( 'show' );
				}
			} );
		} else {
			scrollToTopContainer.classList.add( 'show' );
		}

		scrollToTopButton.addEventListener( 'click', function () {
			window.scrollTo( { top: 0, behavior: 'smooth' } );
		} );
	}
} );
