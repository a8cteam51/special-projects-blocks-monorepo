// WordPress dependencies.
import { __ } from '@wordpress/i18n';

/**
 * Returns attributes for a carousel container.
 *
 * @param {Object} attributes The block attributes.
 *
 * @return {Object} The HTML attributes.
 */
export function getAttributes( attributes ) {
	const { itemCount, overflow } = attributes;

	return {
		'aria-label': 'block title', // TODO: Add block title.
		'aria-roledescription': 'carousel',
		className: `has-overflow-${ overflow }`,
		'data-item-count': itemCount,
		role: 'region',
	};
}

/**
 * Renders previous/next buttons for a carousel.
 *
 * @return {Object} The rendered previous/next buttons.
 */
export function prevNextButtons() {
	return (
		<div
			aria-label={ __( 'Previous/next controls', 'carousel' ) }
			className="wp-block-wpcomsp-carousel__prev-next"
			role="group"
		>
			<button className="wp-block-wpcomsp-carousel__prev-next-button prev">
				<span className="screen-reader-text">
					{ __( 'Previous slide', 'carousel' ) }
				</span>
			</button>
			<button className="wp-block-wpcomsp-carousel__prev-next-button next">
				<span className="screen-reader-text">
					{ __( 'Next slide', 'carousel' ) }
				</span>
			</button>
		</div>
	);
}

/**
 * Renders pagination buttons for a carousel.
 *
 * @param {number} count The number of items to paginate.
 *
 * @return {Object} The rendered pagination buttons.
 */
export function paginationButtons( count ) {
	return (
		<div
			aria-label={ __( 'Slide controls', 'carousel' ) }
			className="wp-block-wpcomsp-carousel__pagination"
			role="group"
		>
			{ Array.from( { length: count }, ( _, index ) => (
				<button
					className="wp-block-wpcomsp-carousel__pagination-button"
					key={ index }
				>
					<span className="screen-reader-text">
						{ `Slide ${ index + 1 } of ${ count }` }
					</span>
				</button>
			) ) }
		</div>
	);
}
