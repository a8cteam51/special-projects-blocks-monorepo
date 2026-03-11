// Internal dependencies.
import { isPresetValue, getComputedPixelValue, getPixelValue } from './utils';

/**
 * Computes rounded corner data using cubic Bezier curves.
 *
 * Given three consecutive polygon vertices, calculates tangent points
 * (where rounding begins/ends on each edge) and cubic Bezier control
 * points that approximate a circular arc. Unlike SVG arc commands, this
 * correctly handles corners at any angle, not just 90 degrees.
 *
 * @param {Object} prev   The previous corner { x, y }.
 * @param {Object} corner The current corner { x, y }.
 * @param {Object} next   The next corner { x, y }.
 * @param {number} radius The corner radius (tangent offset distance in pixels).
 *
 * @return {Object} Corner data with tIn, tOut (tangent points on incoming/outgoing
 *                  edges) and cp1, cp2 (Bezier control points, null if no curve).
 */
const computeCorner = ( prev, corner, next, radius ) => {
	const noRounding = { tIn: corner, tOut: corner, cp1: null, cp2: null };

	if ( radius <= 0 ) {
		return noRounding;
	}

	// Incoming and outgoing edge vectors.
	const inDx = corner.x - prev.x;
	const inDy = corner.y - prev.y;
	const inLen = Math.sqrt( inDx * inDx + inDy * inDy );

	const outDx = next.x - corner.x;
	const outDy = next.y - corner.y;
	const outLen = Math.sqrt( outDx * outDx + outDy * outDy );

	// Degenerate edge (zero length).
	if ( inLen < 0.01 || outLen < 0.01 ) {
		return noRounding;
	}

	const inDir = { x: inDx / inLen, y: inDy / inLen };
	const outDir = { x: outDx / outLen, y: outDy / outLen };

	// Clamp so tangent points don't exceed half of either adjacent edge.
	const d = Math.min( radius, inLen / 2, outLen / 2 );

	// Tangent points: where the curve starts/ends on each edge.
	const tIn = {
		x: corner.x - d * inDir.x,
		y: corner.y - d * inDir.y,
	};
	const tOut = {
		x: corner.x + d * outDir.x,
		y: corner.y + d * outDir.y,
	};

	// Angle between edge directions.
	const dot = inDir.x * outDir.x + inDir.y * outDir.y;
	const theta = Math.acos( Math.max( -1, Math.min( 1, dot ) ) );

	// Near-degenerate angles (straight line or U-turn).
	if ( theta < 0.001 || theta > Math.PI - 0.001 ) {
		return { tIn, tOut, cp1: null, cp2: null };
	}

	// Bezier handle length for a circular arc approximation.
	// The actual arc radius R = d * tan(theta/2), and the standard
	// cubic Bezier handle for an arc of angle alpha is
	// (4/3) * R * tan(alpha/4). Substituting R and alpha = pi - theta:
	const handle =
		( 4 / 3 ) *
		d *
		Math.tan( theta / 2 ) *
		Math.tan( ( Math.PI - theta ) / 4 );

	return {
		tIn,
		tOut,
		cp1: {
			x: tIn.x + handle * inDir.x,
			y: tIn.y + handle * inDir.y,
		},
		cp2: {
			x: tOut.x - handle * outDir.x,
			y: tOut.y - handle * outDir.y,
		},
	};
};

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

	// Define corner points and their radii (clockwise: TL, TR, BR, BL).
	const corners = [
		{ x: htl, y: vtl, radius: rtl },
		{ x: width - htr, y: vtr, radius: rtr },
		{ x: width - hbr, y: vbr, radius: rbr },
		{ x: hbl, y: vbl, radius: rbl },
	];

	const n = corners.length;

	// Compute Bezier curve data for each rounded corner.
	const cornerData = corners.map( ( c, i ) =>
		computeCorner(
			corners[ ( i - 1 + n ) % n ],
			c,
			corners[ ( i + 1 ) % n ],
			c.radius
		)
	);

	// Build the SVG path: for each corner, draw the Bezier curve then the
	// edge to the next corner's incoming tangent point.
	const pathParts = [
		`M ${ r( cornerData[ 0 ].tIn.x ) } ${ r( cornerData[ 0 ].tIn.y ) }`,
	];

	for ( let i = 0; i < n; i++ ) {
		const cd = cornerData[ i ];

		if ( cd.cp1 && cd.cp2 ) {
			pathParts.push(
				`C ${ r( cd.cp1.x ) } ${ r( cd.cp1.y ) } ${ r(
					cd.cp2.x
				) } ${ r( cd.cp2.y ) } ${ r( cd.tOut.x ) } ${ r( cd.tOut.y ) }`
			);
		}

		const next = cornerData[ ( i + 1 ) % n ];
		pathParts.push( `L ${ r( next.tIn.x ) } ${ r( next.tIn.y ) }` );
	}

	pathParts.push( 'Z' );

	return pathParts.join( ' ' );
};
