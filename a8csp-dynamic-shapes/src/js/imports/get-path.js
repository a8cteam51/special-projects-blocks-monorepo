// Internal dependencies.
import { isPresetValue, getComputedPixelValue, getPixelValue } from './utils';

/**
 * Generates a clip-path CSS property for a dynamic shape block.
 *
 * @param {Object}  dimensions   The dimensions of the block.
 * @param {Object}  dynamicShape The dynamic shape attributes.
 * @param {Object}  borderRadius The border radius attributes.
 * @param {Element} element      The element for relative unit calculations.
 * @param {boolean} isImage      Whether this is an image block (uses inset mode vs offset mode).
 *
 * @return {string} The clip-path CSS property.
 */
export const getPath = (
	dimensions,
	dynamicShape,
	borderRadius,
	element,
	isImage = false
) => {
	const { width, height } = dimensions;

	// Round to hundredths to avoid floating-point artifacts in SVG path output.
	const r = ( n ) => Math.round( n * 100 ) / 100;

	const processValues = ( shape ) => {
		const processValue = ( value ) => {
			if ( ! value ) {
				return 0;
			}
			return r(
				isPresetValue( value )
					? getComputedPixelValue( value, element )
					: parseInt( value ) || 0
			);
		};

		return {
			vtl: processValue( shape?.vtl ),
			vtr: processValue( shape?.vtr ),
			vbl: processValue( shape?.vbl ),
			vbr: processValue( shape?.vbr ),
			htl: processValue( shape?.htl ),
			htr: processValue( shape?.htr ),
			hbl: processValue( shape?.hbl ),
			hbr: processValue( shape?.hbr ),
		};
	};

	let { vtl, vtr, vbl, vbr, htl, htr, hbl, hbr } =
		processValues( dynamicShape );

	// Normalize coordinates to absolute pixel positions.
	// User-provided values represent offsets/insets, but the SVG path needs absolute coordinates.
	if ( ! isImage ) {
		// Non-image blocks: vertical values are offset.
		// Find the maximum top offset and adjust all corners relative to it,
		// so the shape extends outward from the block's top edge.
		const maxTop = Math.max( vtl, vtr );
		const maxBottom = height - Math.max( vbl, vbr );

		// Convert top offsets to absolute Y coordinates (measured from top).
		// Smaller offsets = closer to top edge = smaller Y value.
		vtl = maxTop - vtl;
		vtr = maxTop - vtr;
		// Convert bottom offsets to absolute Y coordinates (measured from top).
		// Smaller offsets = closer to bottom edge = larger Y value.
		vbr = maxBottom + vbr;
		vbl = maxBottom + vbl;
	} else {
		// Image blocks: vertical values are inset.
		// Convert to absolute Y coordinates by subtracting from the block height.
		vbr = height - vbr;
		vbl = height - vbl;
	}

	// Provide border radius values for each corner.
	if ( typeof borderRadius === 'string' ) {
		// The editor provides a single {value/unit} string when radii are linked.
		borderRadius = {
			topLeft: borderRadius,
			topRight: borderRadius,
			bottomLeft: borderRadius,
			bottomRight: borderRadius,
		};
	}
	const rtl = r( getPixelValue( borderRadius?.topLeft, element ) );
	const rtr = r( getPixelValue( borderRadius?.topRight, element ) );
	const rbr = r( getPixelValue( borderRadius?.bottomRight, element ) );
	const rbl = r( getPixelValue( borderRadius?.bottomLeft, element ) );

	const pathSegments = [
		`M ${ htl } ${ r( vtl + rtl ) }`,
		rtl > 0 || rtr > 0
			? `A ${ rtl } ${ rtl } 0 0 1 ${ r( htl + rtl ) } ${ vtl } L ${ r(
					width - htr - rtr
			  ) } ${ vtr }`
			: `L ${ r( width - htr ) } ${ vtr }`,
		rtr > 0 || rbr > 0
			? `A ${ rtr } ${ rtr } 0 0 1 ${ r( width - htr ) } ${ r(
					vtr + rtr
			  ) } L ${ r( width - hbr ) } ${ r( vbr - rbr ) }`
			: `L ${ r( width - hbr ) } ${ vbr }`,
		rbr > 0 || rbl > 0
			? `A ${ rbr } ${ rbr } 0 0 1 ${ r(
					width - hbr - rbr
			  ) } ${ vbr } L ${ r( hbl + rbl ) } ${ vbl } `
			: `L ${ hbl } ${ vbl }`,
		rbl > 0 ? `A ${ rbl } ${ rbl } 0 0 1 ${ hbl } ${ r( vbl - rbl ) }` : '',
		`Z`,
	];

	return pathSegments.join( ' ' );
};
