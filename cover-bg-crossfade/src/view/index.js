const covers = [];
let requestedUpdate = false;

import './style.scss';

if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
	initCrossfadeCovers();
}

function initCrossfadeCovers() {
	document
		.querySelectorAll( '.wp-block-cover.is-style-a8csp-cover-bg-crossfade' )
		.forEach( ( cover ) => initCrossfadeCover( cover ) );

	if ( covers.length === 0 ) {
		return;
	}

	updateCovers();

	window.addEventListener( 'scroll', () => requestUpdateCovers(), {
		passive: true,
	} );
	window.addEventListener( 'resize', () => requestUpdateCovers() );
}

function initCrossfadeCover( cover ) {
	covers.push( cover );
}

function requestUpdateCovers() {
	if ( requestedUpdate ) {
		return;
	}
	requestedUpdate = true;

	window.requestAnimationFrame( () => {
		requestedUpdate = false;
		updateCovers();
	} );
}

function updateCovers() {
	let activeIdx = -1;
	let bestDist = Infinity;

	covers.forEach( ( el, idx ) => {
		const itemBcr = el.getBoundingClientRect();
		const dist = Math.abs( itemBcr.top );
		if ( dist < bestDist && dist < window.innerHeight ) {
			bestDist = dist;
			activeIdx = idx;
		}
	} );

	setActiveCover( activeIdx );
}

function setActiveCover( activeIdx ) {
	covers.forEach( ( cover, idx ) => {
		cover.classList.toggle( 'show-video', activeIdx === idx );
	} );
}
