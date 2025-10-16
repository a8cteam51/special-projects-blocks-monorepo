/* global getComputedStyle */

// WordPress dependencies.
import { useSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

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
		// Use the provided element or create a temporary one.
		const targetElement = element || document.documentElement;

		// Convert preset to CSS variable if needed.
		const cssVar = presetToCssVar( value );

		// Check if it's already a CSS variable or preset.
		if ( ! cssVar.startsWith( 'var(' ) && ! value.startsWith( 'var(' ) ) {
			// Not a CSS variable, try getPixelValue directly.
			return getPixelValue( value, element );
		}

		// Extract the CSS variable name (remove 'var(' and ')').
		const varName = cssVar.replace( /^var\(/, '' ).replace( /\)$/, '' );

		// Get the computed style.
		const computedStyle = window.getComputedStyle( targetElement );
		const computedValue = computedStyle.getPropertyValue( varName ).trim();

		if ( ! computedValue ) {
			return 0;
		}

		// Handle clamp() values by extracting the minimum value.
		if ( computedValue.includes( 'clamp(' ) ) {
			// Extract the first value from clamp(min, preferred, max).
			const clampMatch = computedValue.match( /clamp\(\s*([^,)]+)/ );
			if ( clampMatch ) {
				// Use getPixelValue to convert the minimum value (which may be in rem, vw, etc.).
				return getPixelValue( clampMatch[ 1 ].trim(), element );
			}
			return 0;
		}

		// For other computed values (may be in px, rem, em, %, vw, vh, etc.),
		// use getPixelValue to convert to pixels.
		return getPixelValue( computedValue, element );
	} catch ( error ) {
		return 0;
	}
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

	if ( value.endsWith( 'em' ) ) {
		if ( ! element ) {
			return number * rootFontSize;
		}

		const elementFontSize = parseFloat(
			getComputedStyle( element ).fontSize
		);
		return number * elementFontSize;
	}

	if ( value.endsWith( 'rem' ) ) {
		return number * rootFontSize;
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
 * Gets the preset slug from a preset value.
 *
 * @param {string} value The preset value.
 *
 * @return {string|null} The preset slug or null
 */
export const getPresetSlug = ( value ) => {
	if ( ! isPresetValue( value ) ) {
		return null;
	}

	const match = value.match( /var:preset\|spacing\|(.+)$/ );
	return match ? match[ 1 ] : null;
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
	if ( ! palette || ! Array.isArray( attributes ) ) {
		return fallback;
	}

	for ( const attr of attributes ) {
		const { value, paletteKey = false } = attr;

		if ( paletteKey ) {
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

/**
 * Custom hook to get spacing presets with fallback priority.
 *
 * @return {Array} The resolved spacing presets.
 */
export const useSpacingPresets = () => {
	const defaultSpacingPresets =
		useSettings( 'spacing.spacingSizes.default' )?.[ 0 ] || [];
	const themeSpacingPresets =
		useSettings( 'spacing.spacingSizes.theme' )?.[ 0 ] || [];
	const blockSettings = useSettings( 'blocks.core/group' ) || [];

	return (
		blockSettings?.spacing?.presets ||
		themeSpacingPresets ||
		defaultSpacingPresets ||
		[]
	);
};

/**
 * Checks if any of the specified keys have values in the dynamic shape attribute.
 *
 * @param {Object} dynamicShape The dynamic shape object.
 * @param {Array}  keys         Array of keys to check.
 *
 * @return {boolean} True if any corner has a value.
 */
export const hasAxisValues = ( dynamicShape, keys ) => {
	if ( ! dynamicShape || ! Array.isArray( keys ) ) {
		return false;
	}

	return keys.some( ( key ) => dynamicShape[ key ] );
};

/**
 * Creates corner configuration arrays for axis controls.
 *
 * @param {Array} keys Array of corner keys.
 *
 * @return {Array} Array of corner objects with key and label.
 */
export const axisConfig = ( keys ) => {
	const labels = {
		vtl: __( 'Top left', 'dynamic-shapes' ),
		vtr: __( 'Top right', 'dynamic-shapes' ),
		vbl: __( 'Bottom left', 'dynamic-shapes' ),
		vbr: __( 'Bottom right', 'dynamic-shapes' ),
		htl: __( 'Top left', 'dynamic-shapes' ),
		htr: __( 'Top right', 'dynamic-shapes' ),
		hbl: __( 'Bottom left', 'dynamic-shapes' ),
		hbr: __( 'Bottom right', 'dynamic-shapes' ),
	};

	return keys.map( ( key ) => ( {
		key,
		label: labels[ key ],
	} ) );
};
