import './style.scss';

document.addEventListener( 'click', ( event ) => {
	const button = event.target.closest( '.wpcomsp-featured-video__play' );
	if ( ! button ) {
		return;
	}

	const figure = button.closest( '.wpcomsp-has-play-icon' );
	const video = figure?.querySelector( 'video' );
	if ( ! video ) {
		return;
	}

	if ( ! video.hasAttribute( 'controls' ) ) {
		video.setAttribute( 'controls', '' );
	}

	figure.classList.add( 'is-playing' );

	const playPromise = video.play();
	if ( playPromise && typeof playPromise.catch === 'function' ) {
		playPromise.catch( () => {
			figure.classList.remove( 'is-playing' );
		} );
	}
} );
