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
	const { itemCount, overflow, style } = attributes;

	let itemGap = style?.spacing?.blockGap ?? '0px';

	if ( itemGap ) {
		itemGap =
			itemGap.replace(
				'var:preset|spacing|',
				'var(--wp--preset--spacing--'
			) + ')';
	}

	return {
		'aria-label': 'block title', // TODO: Add block title.
		'aria-roledescription': 'carousel',
		className: `has-overflow-${ overflow }`,
		role: 'region',
		style: {
			'--item-count': String( itemCount ),
			'--item-gap': itemGap,
		},
	};
}

/**
 * Adds a base height to the carousel.
 *
 * @param {Object} carousel The carousel element.
 *
 * @return {Function} A cleanup function to remove event listeners.
 */
export function addBaseHeight( carousel ) {
	if ( ! carousel ) {
		return () => {};
	}

	const track = carousel.querySelector(
		'.wp-block-gallery:not(.is-cropped)'
	);

	if ( ! track ) {
		return () => {};
	}

	const images = track.querySelectorAll( 'img' );
	const containerWidth = carousel.offsetWidth;
	const itemGap = parseFloat(
		getComputedStyle( track ).getPropertyValue( 'column-gap' )
	);
	const targetWidth = containerWidth / 3 - itemGap;

	let widestImage = null;
	let maxWidth = 0;

	const handleImageLoad = ( img ) => {
		const rect = img.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const aspectRatio = width / height;
		const scaledWidth = targetWidth * aspectRatio;

		if ( scaledWidth > maxWidth ) {
			maxWidth = scaledWidth;
			widestImage = img;
		}
	};

	const handleLastImageLoad = () => {
		if ( widestImage ) {
			const rect = widestImage.getBoundingClientRect();
			const width = Math.min( targetWidth, Number( rect.width ) );
			const aspectRatio = Number( rect.width ) / Number( rect.height );
			const baseHeight = Math.round( width / aspectRatio );
			carousel.style.setProperty( '--base-height', `${ baseHeight }px` );
		}
	};

	// Store cleanup functions
	const cleanupFns = [];

	images.forEach( ( img ) => {
		if ( img.complete ) {
			handleImageLoad( img );
		} else {
			img.addEventListener( 'load', () => handleImageLoad( img ) );
			cleanupFns.push( () =>
				img.removeEventListener( 'load', () => handleImageLoad( img ) )
			);
		}
	} );

	const lastImage = images[ images.length - 1 ];
	if ( lastImage ) {
		if ( lastImage.complete ) {
			handleLastImageLoad();
		} else {
			lastImage.addEventListener( 'load', handleLastImageLoad );
			cleanupFns.push( () =>
				lastImage.removeEventListener( 'load', handleLastImageLoad )
			);
		}
	}

	return () => {
		cleanupFns.forEach( ( fn ) => fn() );
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
