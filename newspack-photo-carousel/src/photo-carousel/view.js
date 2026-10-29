/**
 * Front-end entry: one engine per carousel.
 */
import PhotoCarousel from './carousel-engine';

const ROOT_SELECTOR = '.wp-block-newspack-photo-carousel';

function start() {
	document
		.querySelectorAll( ROOT_SELECTOR )
		.forEach( ( root ) => new PhotoCarousel( root ) );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', start );
} else {
	start();
}
