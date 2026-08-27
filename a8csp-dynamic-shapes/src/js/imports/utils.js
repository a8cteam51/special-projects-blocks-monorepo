/* global getComputedStyle */

/**
 * Shared helpers for both the editor and front-end bundles.
 *
 * This module is reachable from `view.js`, so it must stay free of
 * `@wordpress/block-editor` imports — anything imported here lands in
 * `view.asset.php` and gets enqueued on the front-end. Editor-only
 * helpers belong in `editor-utils.js`.
 */

/**
 * Converts a preset value to a CSS variable.
 *
 * Supports any preset type (e.g., spacing, shadow, color, etc.).
 *
 * @param {string} presetValue The preset value (e.g., "var:preset|spacing|40" or "var:preset|shadow|small").
 *
 * @return {string} The CSS variable (e.g., "var(--wp--preset--spacing--40)" or "var(--wp--preset--shadow--small)").
 */
export const presetToCssVar = ( presetValue ) => {
	if ( ! presetValue || typeof presetValue !== 'string' ) {
		return '';
	}

	// Match the pattern: var:preset|{type}|{value}
	const match = presetValue.match( /^var:preset\|([^|]+)\|(.+)$/ );
	if ( ! match ) {
		// If it doesn't match the pattern, return as-is (might already be a CSS variable or invalid).
		return presetValue;
	}

	const presetType = match[ 1 ];
	const presetSlug = match[ 2 ];

	return `var(--wp--preset--${ presetType }--${ presetSlug })`;
};

/**
 * Gets the computed pixel value of a CSS variable or regular value.
 *
 * Handles preset values, CSS variables, and various units (px, rem, em, %, vw, vh).
 * For clamp() values, extracts the minimum value and converts it to pixels.
 *
 * @param {string}      value   The value to compute (CSS variable, preset, or regular value).
 * @param {HTMLElement} element The element to use for relative unit calculations (optional).
 *
 * @return {number} The computed pixel value.
 */
export const getComputedPixelValue = ( value, element = null ) => {
	if ( ! value ) {
		return 0;
	}

	// If it's a number, return it.
	if ( typeof value === 'number' ) {
		return value;
	}

	// If it's a direct unit value (not a preset or CSS variable), use getPixelValue.
	// This handles px, rem, em, %, vw, vh units directly.
	if (
		typeof value === 'string' &&
		! value.includes( 'var:' ) &&
		! value.startsWith( 'var(' )
	) {
		return getPixelValue( value, element );
	}

	// For CSS variables or preset values, we need to compute them first.
	try {
		// Convert preset to CSS variable if needed.
		const cssVar = presetToCssVar( value );

		// Check if it's already a CSS variable or preset.
		if ( ! cssVar.startsWith( 'var(' ) && ! value.startsWith( 'var(' ) ) {
			// Not a CSS variable, try getPixelValue directly.
			return getPixelValue( value, element );
		}

		// Resolve the CSS variable to pixels using a temporary element.
		// Appended to documentElement (:root) to avoid triggering
		// MutationObservers watching block containers on the front-end.
		const temp = document.createElement( 'div' );
		temp.style.cssText = 'position:absolute;visibility:hidden;height:0;';
		temp.style.width = cssVar;
		document.documentElement.appendChild( temp );

		// `finally` so the node can't outlive the measurement if reading the
		// computed style throws.
		try {
			return parseFloat( window.getComputedStyle( temp ).width ) || 0;
		} finally {
			temp.remove();
		}
	} catch ( error ) {
		return 0;
	}
};

/**
 * Encode an SVG string for use in a data URI.
 * Escapes characters that would break the URI or cause parsing issues.
 *
 * @param {string} svg The SVG string to encode.
 *
 * @return {string} The encoded SVG string.
 */
export const encodeSvgForDataUri = ( svg ) => {
	return svg
		.replace( /%/g, '%25' )
		.replace( /"/g, "'" )
		.replace( /#/g, '%23' )
		.replace( /\{/g, '%7B' )
		.replace( /\}/g, '%7D' )
		.replace( /</g, '%3C' )
		.replace( />/g, '%3E' );
};

/**
 * Converts spacing value to CSS value, handling presets.
 *
 * @param {string} spacingValue The spacing value to convert.
 *
 * @return {string} The CSS value.
 */
export const getPaddingVar = ( spacingValue ) => {
	if ( ! spacingValue || spacingValue === '0' ) {
		return '0px';
	}

	return isPresetValue( spacingValue )
		? presetToCssVar( spacingValue )
		: spacingValue;
};

/**
 * Returns the pixel value from a value that may be in a relative unit.
 *
 * @param {string}  value   The value from which to parse the pixel value.
 * @param {Element} element The element to use for relative unit calculations (optional).
 *
 * @return {number} The pixel value.
 */
export const getPixelValue = ( value, element = null ) => {
	if ( ! value ) {
		return 0;
	}

	const number = parseFloat( value );

	if ( isNaN( number ) ) {
		return 0;
	}

	// If already in pixels, return as-is.
	if ( value.endsWith( 'px' ) ) {
		return number;
	}

	// Get computed styles for unit conversions.
	const rootStyles = getComputedStyle( document.documentElement );
	const rootFontSize = parseFloat( rootStyles.fontSize );
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	if ( value.endsWith( 'rem' ) ) {
		return number * rootFontSize;
	}

	if ( value.endsWith( 'em' ) ) {
		if ( ! element ) {
			return number * rootFontSize;
		}

		const elementFontSize = parseFloat(
			getComputedStyle( element ).fontSize
		);
		return number * elementFontSize;
	}

	if ( value.endsWith( '%' ) ) {
		// For percentage, we need context - use viewport width as fallback.
		// In practice, this should be used with a specific element context.
		if ( element ) {
			const parentWidth =
				element.parentElement?.offsetWidth || viewportWidth;
			return ( number / 100 ) * parentWidth;
		}
		// Fallback to viewport width for percentage.
		return ( number / 100 ) * viewportWidth;
	}

	if ( value.endsWith( 'vw' ) ) {
		return ( number / 100 ) * viewportWidth;
	}

	if ( value.endsWith( 'vh' ) ) {
		return ( number / 100 ) * viewportHeight;
	}

	return number;
};

/**
 * Checks if a value is a preset value.
 *
 * @param {string} value The value to check.
 *
 * @return {boolean} True if the value is a preset.
 */
export const isPresetValue = ( value ) => {
	return (
		value && typeof value === 'string' && value.includes( 'var:preset|' )
	);
};

/**
 * Resolves a color value from a palette and custom values with priority order.
 *
 * @param {Array}  palette    The color palette array.
 * @param {Array}  attributes Array of attribute objects in priority order.
 *                            Each object should have: { value, paletteKey }
 * @param {string} fallback   Fallback color value (default: 'transparent').
 *
 * @return {string} The resolved color value.
 */
export const resolveColor = (
	palette,
	attributes,
	fallback = 'transparent'
) => {
	if ( ! Array.isArray( attributes ) ) {
		return fallback;
	}

	for ( const attr of attributes ) {
		const { value, paletteKey = false } = attr;

		if ( paletteKey && palette ) {
			const colorEntry = palette.find(
				( entry ) => entry.slug === value
			);
			if ( colorEntry ) {
				return colorEntry.color;
			}
		} else if ( value ) {
			return value;
		}
	}

	return fallback;
};
