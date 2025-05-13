/* global getComputedStyle */

// External dependencies.
import clsx from 'clsx';

// WordPress dependencies.
import { __ } from '@wordpress/i18n';

/**
 * Returns attributes for a carousel container.
 *
 * @param {Object} attributes The block attributes.
 *
 * @return {Object} The HTML attributes.
 */
export function getHTMLAttributes( attributes ) {
	const {
		animate,
		animateEnd,
		animationSpeed,
		itemCount,
		overflow,
		style,
		title,
	} = attributes;

	let itemGap = style?.spacing?.blockGap ?? 'var:preset|spacing|20';

	if ( itemGap ) {
		itemGap =
			itemGap.replace(
				'var:preset|spacing|',
				'var(--wp--preset--spacing--'
			) + ')';
	}

	const htmlAttributes = {
		'aria-label': title || __( 'Carousel', 'carousel' ),
		'data-animate-end': animateEnd,
		role: 'region',
		className: clsx(
			'all-visible' === animate && 'animate-visible',
			`has-overflow-${ overflow }`
		),
		style: {
			'--animation-speed': `${ animationSpeed }s`,
			'--item-count': String( itemCount ),
			'--item-gap': itemGap,
		},
	};

	// Only add aria-roledescription if `title` is set - it's redundant otherwise.
	if ( title ) {
		htmlAttributes[ 'aria-roledescription' ] = 'carousel';
	}

	return htmlAttributes;
}

/**
 * Sets a `--base-height` CSS variable on the Carousel block.
 *
 * Adding a `ref` to the Carousel block itself interferes with its selectability,
 * so one is added to an empty div below the Carousel's contents instead.
 *
 * This is used only for Gallery carousels with
 * the "Crop images to fit" option disabled.
 *
 * @param {Object} bhTracker The base height tracker element.
 *
 * @return {Function} A cleanup function to remove event listeners.
 */
export function setBaseHeight( bhTracker ) {
	if ( ! bhTracker ) {
		return () => {};
	}

	const carousel = bhTracker.closest( '.wp-block-wpcomsp-carousel' );

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
