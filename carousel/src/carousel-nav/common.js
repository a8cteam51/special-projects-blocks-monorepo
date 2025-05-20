// External dependencies.
import clsx from 'clsx';

// WordPress dependencies.
import { Path, SVG } from '@wordpress/primitives';
import { __ } from '@wordpress/i18n';

/**
 * Returns HTML attributes for the carousel nav buttons container.
 *
 * @param {Object} attributes The block attributes.
 *
 * @return {Object} The HTML attributes.
 */
export function getHTMLAttributes( attributes ) {
	const { borderColor, buttonColors, buttonSize, style = {} } = attributes;
	const { background, icon } = buttonColors || {};
	const { border = {} } = style;
	const { color, radius, width } = border;

	const bColor = borderColor
		? `var(--wp--preset--color--${ borderColor })`
		: color;

	const sizePx = buttonSize ? `${ buttonSize }px` : null;

	const styles = Object.fromEntries(
		Object.entries( {
			'--button-background': background,
			'--button-icon': icon,
			'--button-border-color': bColor || '',
			'--button-border-radius': radius,
			'--button-border-width': width,
			'--button-size': sizePx,
		} ).filter( ( [ , value ] ) => value )
	);

	const htmlAttributes = {
		'aria-label': __( 'Previous/next slide controls', 'carousel' ),
		role: 'group',
	};

	if ( Object.keys( styles ).length > 0 ) {
		htmlAttributes.style = styles;
	}

	return htmlAttributes;
}

/**
 * Renders navigation buttons for a carousel.
 *
 * @return {Object} The rendered navigation buttons.
 */
export function navigationButtons() {
	const buttonClass = 'wp-block-wpcomsp-carousel-nav--button';

	const previousButtonClasses = clsx(
		buttonClass,
		'wp-block-wpcomsp-carousel-nav--button_prev'
	);

	const nextButtonClasses = clsx(
		buttonClass,
		'wp-block-wpcomsp-carousel-nav--button_next'
	);

	return (
		<>
			<button className={ previousButtonClasses }>
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
			<button className={ nextButtonClasses }>
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
