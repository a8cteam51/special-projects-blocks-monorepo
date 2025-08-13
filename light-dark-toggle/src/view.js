import domReady from '@wordpress/dom-ready';
import {
	addToggleModeListener,
	getColorScheme,
	toggleColorMode,
	updateToggleClass,
	updateToggleAriaLabel,
} from './shared';

domReady( wpcomDarkLightMode );

/**
 * Handles the light/dark mode toggle functionality.
 */
function wpcomDarkLightMode() {
	/**
	 * Add the toggle mode listener to the window object
	 */
	addToggleModeListener( window );

	/**
	 * Update the class of the body element based on the current color scheme
	 */
	updateToggleClass( window );

	//add interactivity ( click, slide )
	const toggle = document.querySelector(
		'.wp-block-wpcomsp-light-dark-toggle'
	);

	let pointerActive = false;
	let pointerStartX = 0;
	let pointerEndX = 0;

	toggle?.addEventListener( 'click', ( ev ) => {
		pointerActive = false;

		//ignore touch and mouse clicks
		if ( ev.pointerType !== '' ) {
			return;
		}

		toggleColorMode( window );
		updateToggleAriaLabel( window );
	} );

	toggle?.addEventListener( 'pointermove', ( ev ) => {
		if ( ! pointerActive ) {
			return;
		}

		//store lates position - Blink doesn't reliably provide pageX when pointerout
		pointerEndX = ev.pageX;
	} );

	//prevent scrolling while touch moving over the toggle
	toggle?.addEventListener( 'touchmove', ( ev ) => {
		if ( ! pointerActive && ev.cancelable ) {
			ev.preventDefault();
		}
	} );

	toggle?.addEventListener( 'pointerdown', ( ev ) => {
		pointerActive = true;
		pointerStartX = ev.pageX;
		pointerEndX = ev.pageX;
	} );

	toggle?.addEventListener( 'pointerout', ( ev ) => {
		if ( ! pointerActive ) {
			return;
		}

		maybeUpdateMode( ev );
		pointerActive = false;
	} );

	toggle?.addEventListener( 'pointerup', ( ev ) => {
		if ( ! pointerActive ) {
			return;
		}
		maybeUpdateMode( ev );
		pointerActive = false;
	} );

	/**
	 * Will update the mode if the user has moved the pointer far enough
	 */
	function maybeUpdateMode() {
		const deltaX = pointerEndX - pointerStartX;
		const newScheme = deltaX < 0 ? 'light' : 'dark';

		// click
		if ( Math.abs( deltaX ) < 10 ) {
			toggleColorMode( window );
			updateToggleAriaLabel( window );
			// slide
		} else if ( newScheme !== getColorScheme( window ) ) {
			toggleColorMode( window );
			updateToggleAriaLabel( window );
		}
	}
}
