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
		trackHeight,
		trackHeightUnit,
	} = attributes;

	const styles = {
		'--animation-speed': `${ animationSpeed }s`,
		'--item-count': String( itemCount ),
	};

	const itemGap = style?.spacing?.blockGap;
	if ( itemGap ) {
		styles[ '--item-gap' ] =
			itemGap.replace(
				'var:preset|spacing|',
				'var(--wp--preset--spacing--'
			) + ')';
	}

	if ( trackHeight && trackHeightUnit ) {
		styles[ '--track-height' ] = `${ trackHeight }${ trackHeightUnit }`;
	}

	const htmlAttributes = {
		'aria-label': title || __( 'Carousel', 'carousel' ),
		'data-animate-end': animateEnd,
		role: 'region',
		className: clsx(
			'all-visible' === animate && 'animate-visible',
			`has-overflow-${ overflow }`
		),
		style: styles,
	};

	// Only add aria-roledescription if `title` is set - it's redundant otherwise.
	if ( title ) {
		htmlAttributes[ 'aria-roledescription' ] = 'carousel';
	}

	return htmlAttributes;
}
