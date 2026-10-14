/**
 * Card placement, shared by the editor and the front end.
 *
 * A hotspot's card is positioned next to its marker, on the side the editor
 * chose (or the side with the most room for "auto"), and kept inside its
 * bounds: the image's box, or with "page" bounds the nearest ancestor that
 * clips overflow (else the document), narrowed to the viewport's width.
 * When it cannot fit on any side, it is "stacked": shown below the image at
 * the image's full width, and the image's canvas gains a bottom margin as
 * tall as the card so that it does not cover what follows.
 *
 * A placed card carries `data-placement` and, for a callout tail, the
 * marker's center relative to its top-left corner as
 * `--a8csp-image-hotspots-card-marker-x` and `-y`.
 *
 * The DOM contract, the same in the editor and on the front end:
 *
 * - `.wp-block-a8csp-image-hotspots__canvas` is the image's box.
 * - `.wp-block-a8csp-image-hotspot` (the item) carries the point as the
 *   `--a8csp-image-hotspots-x` and `-y` percentages, and `data-card-position`.
 *   It is positioned at the point; on the front end it has no size.
 * - The item's `.wp-block-a8csp-image-hotspots__marker` is the marker button,
 *   and its `.wp-block-a8csp-image-hotspots__card` is the card, positioned
 *   from the item's top-left corner.
 */

export const CARD_POSITIONS = [ 'auto', 'above', 'below', 'left', 'right' ];

const OPPOSITE = {
	above: 'below',
	below: 'above',
	left: 'right',
	right: 'left',
};

/**
 * Clamps a number to a range. When the range is empty (max < min), returns min.
 *
 * @param {number} value The number.
 * @param {number} min   Lower bound.
 * @param {number} max   Upper bound.
 * @return {number} The clamped number.
 */
const clamp = ( value, min, max ) => Math.max( min, Math.min( value, max ) );

/**
 * Rounds a percentage to one decimal place and clamps it to 0–100.
 *
 * @param {number} value A percentage.
 * @return {number} The percentage, rounded and clamped.
 */
export function roundPercentage( value ) {
	const number = Number( value );
	if ( ! Number.isFinite( number ) ) {
		return 0;
	}
	return clamp( Math.round( number * 10 ) / 10, 0, 100 );
}

/**
 * Works out where a card goes. Pure: every length is in CSS pixels, relative
 * to the top-left corner of the image's box.
 *
 * @param {Object} args
 * @param {number} args.boxWidth   Width of the image's box.
 * @param {number} args.boxHeight  Height of the image's box.
 * @param {Object} args.point      The marker's point: { x, y }.
 * @param {Object} args.marker     The marker's box: { left, top, right, bottom }.
 * @param {number} args.cardWidth  The card's width.
 * @param {number} args.cardHeight The card's height.
 * @param {number} args.gap        Space between the marker and the card.
 * @param {string} args.preference One of CARD_POSITIONS.
 * @param {Object} [args.bounds]   Where the card may go: { left, top, right,
 *                                 bottom } in the box. Defaults to the box.
 * @return {{placement: string, left: number, top: number}} The side used
 *         (or "stacked") and the card's top-left corner in the box.
 */
export function computePlacement( {
	boxWidth,
	boxHeight,
	point,
	marker,
	cardWidth,
	cardHeight,
	gap,
	preference,
	bounds = { left: 0, top: 0, right: boxWidth, bottom: boxHeight },
} ) {
	// The marker's box, stretched to include its point (a pin's tip hangs
	// below the button).
	const markerBox = {
		left: Math.min( marker.left, point.x ),
		right: Math.max( marker.right, point.x ),
		top: Math.min( marker.top, point.y ),
		bottom: Math.max( marker.bottom, point.y ),
	};
	const middleY = ( markerBox.top + markerBox.bottom ) / 2;
	const maxLeft = bounds.right - cardWidth;
	const maxTop = bounds.bottom - cardHeight;

	const candidates = {
		above: {
			left: clamp( point.x - cardWidth / 2, bounds.left, maxLeft ),
			top: markerBox.top - gap - cardHeight,
		},
		below: {
			left: clamp( point.x - cardWidth / 2, bounds.left, maxLeft ),
			top: markerBox.bottom + gap,
		},
		left: {
			left: markerBox.left - gap - cardWidth,
			top: clamp( middleY - cardHeight / 2, bounds.top, maxTop ),
		},
		right: {
			left: markerBox.right + gap,
			top: clamp( middleY - cardHeight / 2, bounds.top, maxTop ),
		},
	};

	// A pixel of slack: layout widths are fractional (a scrollbar, a
	// percentage), and a card that misses by less than a pixel still fits.
	const fits = ( { left, top } ) =>
		left >= bounds.left - 1 &&
		top >= bounds.top - 1 &&
		left + cardWidth <= bounds.right + 1 &&
		top + cardHeight <= bounds.bottom + 1;

	const room = {
		above: markerBox.top - bounds.top,
		below: bounds.bottom - markerBox.bottom,
		left: markerBox.left - bounds.left,
		right: bounds.right - markerBox.right,
	};
	const vertical =
		room.above > room.below ? [ 'above', 'below' ] : [ 'below', 'above' ];
	const horizontal =
		room.right >= room.left ? [ 'right', 'left' ] : [ 'left', 'right' ];

	let order;
	if ( OPPOSITE[ preference ] ) {
		// A chosen side first, then its opposite, then the other two.
		const rest = [ ...vertical, ...horizontal ].filter(
			( side ) => side !== preference && side !== OPPOSITE[ preference ]
		);
		order = [ preference, OPPOSITE[ preference ], ...rest ];
	} else {
		order = [ ...vertical, ...horizontal ];
	}

	for ( const side of order ) {
		if ( fits( candidates[ side ] ) ) {
			return {
				placement: side,
				left: Math.round( candidates[ side ].left ),
				top: Math.round( candidates[ side ].top ),
			};
		}
	}

	return {
		placement: 'stacked',
		left: 0,
		top: Math.round( boxHeight + gap ),
	};
}

/**
 * Finds the parts of a hotspot around its card.
 *
 * @param {HTMLElement} card The card element.
 * @return {Object|null} { item, marker, canvas }, or null when incomplete.
 */
function getParts( card ) {
	const item = card?.parentElement;
	const marker = item?.querySelector(
		':scope > .wp-block-a8csp-image-hotspots__marker'
	);
	const canvas = card?.closest( '.wp-block-a8csp-image-hotspots__canvas' );
	if ( ! item || ! marker || ! canvas ) {
		return null;
	}
	return { item, marker, canvas };
}

/**
 * Reserves room below the image for a stacked card, or releases it.
 *
 * @param {HTMLElement} canvas The image's box.
 * @param {HTMLElement} card   The card that reserves or releases the room.
 * @param {number}      space  Pixels to reserve; 0 releases.
 */
function reserveSpace( canvas, card, space ) {
	if ( space > 0 ) {
		canvas.dataset.stackedCard = card.id || 'card';
		canvas.style.setProperty(
			'--a8csp-image-hotspots-stack-space',
			`${ Math.ceil( space ) }px`
		);
	} else if ( canvas.dataset.stackedCard === ( card.id || 'card' ) ) {
		delete canvas.dataset.stackedCard;
		canvas.style.removeProperty( '--a8csp-image-hotspots-stack-space' );
	}
}

/**
 * Measures a hotspot in the image's box, in CSS pixels.
 *
 * The point comes from the item's `--a8csp-image-hotspots-x` and `-y`
 * percentages; the origin is the item's top-left corner, which the card is
 * positioned from. On the front end the two are the same. In the editor the
 * item's box may be larger, to cover the marker and its card.
 *
 * @param {HTMLElement} item   The hotspot's item element.
 * @param {HTMLElement} canvas The image's box.
 * @return {Object} { toBox, point, origin, scale }: toBox maps a client rect
 *                  to a box rect.
 */
export function measureHotspot( item, canvas ) {
	const canvasRect = canvas.getBoundingClientRect();
	// The editor may scale the canvas (zoom out); work in CSS pixels.
	const scale =
		canvas.offsetWidth > 0 ? canvasRect.width / canvas.offsetWidth : 1;
	const toBox = ( rect ) => ( {
		left: ( rect.left - canvasRect.left ) / scale,
		top: ( rect.top - canvasRect.top ) / scale,
		right: ( rect.right - canvasRect.left ) / scale,
		bottom: ( rect.bottom - canvasRect.top ) / scale,
	} );

	const itemBox = toBox( item.getBoundingClientRect() );
	const origin = { x: itemBox.left, y: itemBox.top };

	const view = item.ownerDocument.defaultView || window;
	const styles = view.getComputedStyle( item );
	const x = parseFloat(
		styles.getPropertyValue( '--a8csp-image-hotspots-x' )
	);
	const y = parseFloat(
		styles.getPropertyValue( '--a8csp-image-hotspots-y' )
	);
	const point = {
		x: Number.isFinite( x ) ? ( x / 100 ) * canvas.offsetWidth : origin.x,
		y: Number.isFinite( y ) ? ( y / 100 ) * canvas.offsetHeight : origin.y,
	};

	return { toBox, point, origin, scale };
}

/**
 * Which bounds a card is kept inside: "image" (the image's box) or "page".
 *
 * Read from the card's `--a8csp-image-hotspots-card-bounds` custom
 * property, which the block sets from its "Keep cards inside the image"
 * setting and a theme may override, at a breakpoint for example.
 *
 * @param {HTMLElement} card The card element.
 * @return {string} "image" or "page".
 */
export function getCardBounds( card ) {
	const view = card.ownerDocument.defaultView || window;
	const value = view
		.getComputedStyle( card )
		.getPropertyValue( '--a8csp-image-hotspots-card-bounds' )
		.trim();
	return 'page' === value ? 'page' : 'image';
}

/**
 * The space a card keeps from the edges of its bounds, in pixels.
 *
 * Read from the card's `--a8csp-image-hotspots-card-inset`: one length for
 * every side, or two, as in `margin`, for the top and bottom and then the
 * left and right. The property is registered with `@property` as lengths, so
 * the computed value is in pixels whatever unit the theme used.
 *
 * @param {HTMLElement} card The card element.
 * @return {{block: number, inline: number}} The insets, 0 or more.
 */
export function getCardInset( card ) {
	const view = card.ownerDocument.defaultView || window;
	const values = view
		.getComputedStyle( card )
		.getPropertyValue( '--a8csp-image-hotspots-card-inset' )
		.trim()
		.split( /\s+/ )
		.map( ( value ) => Math.max( 0, parseFloat( value ) || 0 ) );
	return {
		block: values[ 0 ] || 0,
		inline: ( values.length > 1 ? values[ 1 ] : values[ 0 ] ) || 0,
	};
}

/**
 * The client rect a card may use with "page" bounds: the nearest ancestor of
 * the image that clips its overflow (a cover block, for instance), or else
 * the whole document, narrowed to the viewport's width.
 *
 * @param {HTMLElement} canvas The image's box.
 * @return {{left: number, top: number, right: number, bottom: number}} The
 *         bounds, in client coordinates.
 */
function getPageRect( canvas ) {
	const doc = canvas.ownerDocument;
	const view = doc.defaultView || window;
	const root = doc.documentElement;
	let rect = null;

	for (
		let element = canvas.parentElement;
		element && element !== root && element !== doc.body;
		element = element.parentElement
	) {
		const { overflowX, overflowY } = view.getComputedStyle( element );
		if ( 'visible' !== overflowX || 'visible' !== overflowY ) {
			rect = element.getBoundingClientRect();
			break;
		}
	}

	if ( ! rect ) {
		const rootRect = root.getBoundingClientRect();
		rect = {
			left: rootRect.left,
			top: rootRect.top,
			right: rootRect.left + root.scrollWidth,
			bottom: rootRect.top + root.scrollHeight,
		};
	}

	return {
		left: Math.max( rect.left, 0 ),
		top: rect.top,
		right: Math.min( rect.right, root.clientWidth ),
		bottom: rect.bottom,
	};
}

/**
 * Places a visible card: measures the image, the marker and the card, picks
 * the side, and writes `data-placement` and the card's `left` and `top`
 * (relative to the item, the card's containing block).
 *
 * @param {HTMLElement} card The card element. It must not be `hidden`.
 * @return {string|null} The placement used, or null when it could not place.
 */
export function placeCard( card ) {
	const parts = getParts( card );
	if ( ! parts || ! card.offsetParent ) {
		return null;
	}
	const { item, marker, canvas } = parts;

	// Measure the card at its natural size: a stacked card is full width.
	card.removeAttribute( 'data-placement' );

	const { toBox, point, origin } = measureHotspot( item, canvas );
	// The card's scroll margin carries the gap (any CSS length, resolved).
	// The editor's canvas is an iframe: use the card's own window.
	const view = card.ownerDocument.defaultView || window;
	const gap =
		parseFloat( view.getComputedStyle( card ).scrollMarginTop ) || 0;
	const markerBox = toBox( marker.getBoundingClientRect() );

	const outer =
		'page' === getCardBounds( card )
			? toBox( getPageRect( canvas ) )
			: {
					left: 0,
					top: 0,
					right: canvas.offsetWidth,
					bottom: canvas.offsetHeight,
				};
	const inset = getCardInset( card );

	const result = computePlacement( {
		boxWidth: canvas.offsetWidth,
		boxHeight: canvas.offsetHeight,
		point,
		marker: markerBox,
		cardWidth: card.offsetWidth,
		cardHeight: card.offsetHeight,
		gap,
		preference: item.dataset.cardPosition || 'auto',
		bounds: {
			left: outer.left + inset.inline,
			top: outer.top + inset.block,
			right: outer.right - inset.inline,
			bottom: outer.bottom - inset.block,
		},
	} );

	card.dataset.placement = result.placement;
	card.style.left = `${ Math.round( result.left - origin.x ) }px`;
	card.style.top = `${ Math.round( result.top - origin.y ) }px`;

	// Where the marker's center is from the card's top-left corner, for a
	// theme's callout tail on the side `data-placement` names.
	card.style.setProperty(
		'--a8csp-image-hotspots-card-marker-x',
		`${ Math.round( ( markerBox.left + markerBox.right ) / 2 - result.left ) }px`
	);
	card.style.setProperty(
		'--a8csp-image-hotspots-card-marker-y',
		`${ Math.round( ( markerBox.top + markerBox.bottom ) / 2 - result.top ) }px`
	);

	reserveSpace(
		canvas,
		card,
		'stacked' === result.placement ? card.offsetHeight + gap : 0
	);

	return result.placement;
}

/**
 * Clears a card's placement when it closes or hides.
 *
 * @param {HTMLElement} card The card element.
 */
export function resetCard( card ) {
	if ( ! card ) {
		return;
	}
	card.removeAttribute( 'data-placement' );
	card.style.removeProperty( 'left' );
	card.style.removeProperty( 'top' );
	card.style.removeProperty( '--a8csp-image-hotspots-card-marker-x' );
	card.style.removeProperty( '--a8csp-image-hotspots-card-marker-y' );
	const canvas = card.closest( '.wp-block-a8csp-image-hotspots__canvas' );
	if ( canvas ) {
		reserveSpace( canvas, card, 0 );
	}
}
