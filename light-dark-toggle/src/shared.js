import { __, sprintf } from '@wordpress/i18n';

let startingColorScheme = 'light';

/**
 * Sets the initial color scheme
 *
 * @param {string} color The color scheme
 */
export function setInitialColorScheme( color ) {
	const allowed = [ 'light', 'dark' ];

	// if color is not allowed, set as light.
	if ( ! allowed.includes( color ) ) {
		color = 'light';
	}

	startingColorScheme = color;
}

/**
 * Adds the event listener to listen for changes in the light mode
 * @param {window} window The window object
 * @return {Function} A function that removes the event listener
 */
export function addToggleModeListener( window ) {
	const handler = () => updateToggleClass( window );

	window.addEventListener( 'storage', handler );

	return () => {
		window.removeEventListener( 'storage', handler );
	};
}

/**
 * Toggles the mode between light and dark
 * @param {window} window The window object
 */
export function toggleColorMode( window ) {
	const oldValue = getColorScheme( window );
	const newValue = oldValue === 'light' ? 'dark' : 'light';

	window.localStorage.wpcomsp_light_dark_mode = newValue;

	const storageData = { key: 'wpcomsp_light_dark_mode', oldValue, newValue };

	// eslint-disable-next-line no-undef
	const event = new StorageEvent( 'storage', storageData );
	window.dispatchEvent( event );
}

/**
 * Gets the current color scheme
 * @param {window} window The window object
 * @return {string} The color scheme
 */
export function getColorScheme( window ) {
	if ( window.localStorage.wpcomsp_light_dark_mode ) {
		return window.localStorage.wpcomsp_light_dark_mode === 'light'
			? 'light'
			: 'dark';
	}

	return startingColorScheme;
}

/**
 * Updates the class on the body based on the color scheme
 * @param {window} window The window object
 */
export function updateToggleClass( window ) {
	const colorScheme = getColorScheme( window );

	window.document.documentElement.classList.toggle(
		'wpcomsp-light-dark-active',
		colorScheme === 'light'
	);
}

/**
 * Updates the aria label for the toggle button
 * @param {window} window The window object
 */
export function updateToggleAriaLabel( window ) {
	const toggle = window.document.querySelector( '.wp-block-wpcomsp-light-dark-toggle' );

	if ( ! toggle ) {
		return;
	}

	const colorScheme = getColorScheme( window );
	const label = sprintf(
		/* translators: %s: color mode */
		__( 'Switch to %s mode', 'light-dark-toggle' ),
		colorScheme
	);

	toggle.setAttribute( 'aria-label', label );
}
