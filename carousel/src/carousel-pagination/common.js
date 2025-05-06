// WordPress dependencies.
import { __ } from '@wordpress/i18n';

/**
 * Returns attributes for the carousel nav buttons container.
 *
 * @param {Object} attributes The block attributes.
 *
 * @return {Object} The HTML attributes.
 */
export function getAttributes( attributes ) {
	const { buttonColors, buttonSize, style = {} } = attributes;
	const { background } = buttonColors || {};
	const { border = {} } = style;
	const { radius, width } = border;

	const sizePx = buttonSize ? `${ buttonSize }px` : undefined;

	const styles = Object.fromEntries(
		Object.entries( {
			'--button-background': background,
			'--button-border-radius': radius,
			'--button-border-width': width,
			'--button-size': sizePx,
		} ).filter( ( [ , value ] ) => value )
	);

	const htmlAttributes = {
		'aria-label': __( 'Slide controls', 'carousel' ),
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
 * @param {number} count The number of slides.
 *
 * @return {Object} The rendered navigation buttons.
 */
export function paginationButtons( count ) {
	return (
		<>
			{ Array.from( { length: count }, ( _, index ) => (
				<button
					className="wp-block-wpcomsp-carousel-pagination--button"
					key={ index }
				>
					<span className="screen-reader-text">
						{ `Slide ${ index + 1 } of ${ count }` }
					</span>
				</button>
			) ) }
		</>
	);
}
