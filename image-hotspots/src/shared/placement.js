/**
 * Card placement, shared by the editor and the front end.
 *
 * A hotspot's card is positioned next to its marker, on the side the editor
 * chose (or the side with the most room for "auto"), and kept inside the
 * image's box. When it cannot fit on any side, it is "stacked": shown below
 * the image at the image's full width, and the image's canvas gains a bottom
 * margin as tall as the card so that it does not cover what follows.
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
	const maxLeft = boxWidth - cardWidth;
	const maxTop = boxHeight - cardHeight;

	const candidates = {
		above: {
			left: clamp( point.x - cardWidth / 2, 0, maxLeft ),
			top: markerBox.top - gap - cardHeight,
		},
		below: {
			left: clamp( point.x - cardWidth / 2, 0, maxLeft ),
			top: markerBox.bottom + gap,
		},
		left: {
			left: markerBox.left - gap - cardWidth,
			top: clamp( middleY - cardHeight / 2, 0, maxTop ),
		},
		right: {
			left: markerBox.right + gap,
			top: clamp( middleY - cardHeight / 2, 0, maxTop ),
		},
	};

	const fits = ( { left, top } ) =>
		left >= 0 &&
		top >= 0 &&
		left + cardWidth <= boxWidth + 0.5 &&
		top + cardHeight <= boxHeight + 0.5;

	const room = {
		above: markerBox.top,
		below: boxHeight - markerBox.bottom,
		left: markerBox.left,
		right: boxWidth - markerBox.right,
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

	const result = computePlacement( {
		boxWidth: canvas.offsetWidth,
		boxHeight: canvas.offsetHeight,
		point,
		marker: toBox( marker.getBoundingClientRect() ),
		cardWidth: card.offsetWidth,
		cardHeight: card.offsetHeight,
		gap,
		preference: item.dataset.cardPosition || 'auto',
	} );

	card.dataset.placement = result.placement;
	card.style.left = `${ Math.round( result.left - origin.x ) }px`;
	card.style.top = `${ Math.round( result.top - origin.y ) }px`;

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
	const canvas = card.closest( '.wp-block-a8csp-image-hotspots__canvas' );
	if ( canvas ) {
		reserveSpace( canvas, card, 0 );
	}
}
