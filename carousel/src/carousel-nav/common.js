// External dependencies.
import clsx from 'clsx';

// WordPress dependencies.
import { Path, SVG } from '@wordpress/primitives';
import { __ } from '@wordpress/i18n';

/**
 * Returns attributes for the carousel nav buttons container.
 *
 * @return {Object} The HTML attributes.
 */
export function getAttributes() {
	return {
		'aria-label': __( 'Previous/next slide controls', 'carousel' ),
		role: 'group',
	};
}

/**
 * Renders navigation buttons for a carousel.
 *
 * @param {Object} attributes The block attributes.
 *
 * @return {Object} The rendered navigation buttons.
 */
export function navigationButtons( attributes ) {
	const { buttonColors, style = {} } = attributes;
	const { background, icon } = buttonColors || {};
	const { border = {} } = style;
	const { radius, width } = border;

	const buttonClass = 'wp-block-wpcomsp-carousel-nav--button';

	const previousButtonClasses = clsx(
		buttonClass,
		'wp-block-wpcomsp-carousel-nav--button_prev'
	);

	const nextButtonClasses = clsx(
		buttonClass,
		'wp-block-wpcomsp-carousel-nav--button_next'
	);

	const styles = Object.fromEntries(
		Object.entries( {
			'--color-background': background,
			'--color-icon': icon,
			'--border-radius': radius,
			'--border-width': width,
		} ).filter( ( [ , value ] ) => value !== undefined )
	);

	return (
		<>
			<button className={ previousButtonClasses } style={ styles }>
				<SVG
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="48"
					height="48"
					aria-hidden="true"
					focusable="false"
				>
					<Path d="M14.6 7l-1.2-1L8 12l5.4 6 1.2-1-4.6-5z" />
				</SVG>
				<span className="screen-reader-text">
					{ __( 'Previous slide', 'carousel' ) }
				</span>
			</button>
			<button className={ nextButtonClasses } style={ styles }>
				<SVG
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="48"
					height="48"
					aria-hidden="true"
					focusable="false"
				>
					<Path d="M10.6 6L9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z" />
				</SVG>
				<span className="screen-reader-text">
					{ __( 'Next slide', 'carousel' ) }
				</span>
			</button>
		</>
	);
}
