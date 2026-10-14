/**
 * Front-end behaviour of Image Hotspots, with the Interactivity API.
 *
 * - A marker's click or tap toggles its card. Only one card on the page is
 *   open at a time: `state.openId` holds the open hotspot's id.
 * - With `openOn: "hover"`, a mouse entering a hotspot opens its card, and
 *   leaving it closes the card after `closeDelay` milliseconds. A click on a
 *   card opened by hover keeps it open. Touch and keyboard use clicks.
 * - Escape closes the open card, and returns focus to its marker when focus
 *   was on the marker or in the card.
 * - A pointer press outside the open hotspot closes it, and so does focus
 *   moving out of it. Focus is never trapped.
 * - While a card is open, it is placed next to its marker (see
 *   `../shared/placement.js`) and re-placed when it or the image resizes.
 */

/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Internal dependencies
 */
import { placeCard, resetCard } from '../shared/placement';

let closeTimer = null;

/**
 * The open hotspot of this block, if the open one is this block's. Found by
 * its class rather than by an id, which the marker attributes filter may
 * change.
 *
 * @param {HTMLElement} ref The block's element.
 * @return {HTMLElement|null} The open hotspot's item, or null.
 */
const getOpenItem = ( ref ) =>
	ref.querySelector(
		':scope > .wp-block-a8csp-image-hotspots__canvas > .wp-block-a8csp-image-hotspots__markers > .wp-block-a8csp-image-hotspot.is-open'
	);

/**
 * A hotspot's marker button.
 *
 * @param {HTMLElement} item The hotspot's item.
 * @return {HTMLElement|null} The marker.
 */
const getMarker = ( item ) =>
	item.querySelector( ':scope > .wp-block-a8csp-image-hotspots__marker' ) ||
	item.querySelector( ':scope > button' );

const prefersReducedMotion = () =>
	window.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches;

const { state } = store( 'a8csp/image-hotspots', {
	state: {
		/**
		 * Whether the hotspot in context is the open one.
		 *
		 * @return {boolean} True when its card is open.
		 */
		get isOpen() {
			const { id } = getContext();
			return !! id && state.openId === id;
		},
	},
	actions: {
		/**
		 * Opens the hotspot's card, or closes it if it is open. A card that
		 * hover opened stays open on click instead, as the click means the
		 * visitor wants it.
		 */
		toggle() {
			const { id } = getContext();
			window.clearTimeout( closeTimer );

			if ( state.openId === id ) {
				if ( 'hover' === state.openedBy ) {
					state.openedBy = 'click';
					return;
				}
				state.openId = '';
				state.openedBy = '';
				return;
			}

			state.openId = id;
			state.openedBy = 'click';
		},

		/**
		 * With hover, opens the card when a mouse enters the hotspot.
		 *
		 * @param {PointerEvent} event The pointerenter event.
		 */
		openOnHover( event ) {
			const { id, openOn } = getContext();
			if ( 'hover' !== openOn || 'mouse' !== event.pointerType ) {
				return;
			}
			window.clearTimeout( closeTimer );
			if ( state.openId !== id ) {
				state.openId = id;
				state.openedBy = 'hover';
			}
		},

		/**
		 * With hover, closes a card that hover opened, a moment after the
		 * mouse leaves the hotspot (marker and card), so that the pointer can
		 * cross from the marker to its card.
		 *
		 * @param {PointerEvent} event The pointerleave event.
		 */
		closeOnLeave( event ) {
			const { id, openOn, closeDelay } = getContext();
			if (
				'hover' !== openOn ||
				'mouse' !== event.pointerType ||
				state.openId !== id ||
				'hover' !== state.openedBy
			) {
				return;
			}
			window.clearTimeout( closeTimer );
			closeTimer = window.setTimeout(
				() => {
					if ( state.openId === id && 'hover' === state.openedBy ) {
						state.openId = '';
						state.openedBy = '';
					}
				},
				Number.isFinite( closeDelay ) ? closeDelay : 300
			);
		},

		/**
		 * Closes the card when focus moves out of the hotspot to another
		 * element. Focus leaving the window (no related target) keeps it open.
		 *
		 * @param {FocusEvent} event The focusout event.
		 */
		closeOnFocusOut( event ) {
			const { id } = getContext();
			const { ref } = getElement();
			const next = event.relatedTarget;
			if ( state.openId !== id || ! next || ref.contains( next ) ) {
				return;
			}
			state.openId = '';
			state.openedBy = '';
		},
	},
	callbacks: {
		/**
		 * Closes the open card when a pointer is pressed outside its hotspot.
		 * Pointer events, unlike clicks, reach the document from any tap on
		 * iOS.
		 *
		 * @param {PointerEvent} event The pointerdown event.
		 */
		closeOnOutsidePointer( event ) {
			if ( ! state.openId ) {
				return;
			}
			const { ref } = getElement();
			const item = getOpenItem( ref );
			if ( ! item ) {
				// The open card belongs to another block.
				return;
			}
			if (
				event.target instanceof window.Node &&
				item.contains( event.target )
			) {
				return;
			}
			window.clearTimeout( closeTimer );
			state.openId = '';
			state.openedBy = '';
		},

		/**
		 * Closes the open card on Escape. Focus goes back to the marker when
		 * it was in the hotspot; a card that hover opened while focus was
		 * elsewhere just closes.
		 *
		 * @param {KeyboardEvent} event The keydown event.
		 */
		closeOnEscape( event ) {
			if ( 'Escape' !== event.key || ! state.openId ) {
				return;
			}
			const { ref } = getElement();
			const item = getOpenItem( ref );
			if ( ! item ) {
				return;
			}
			const marker = getMarker( item );
			const focusWasInside = item.contains(
				item.ownerDocument.activeElement
			);
			window.clearTimeout( closeTimer );
			state.openId = '';
			state.openedBy = '';
			if ( focusWasInside && marker ) {
				marker.focus();
			}
		},

		/**
		 * Places the card while it is open, and keeps it placed as it or the
		 * image resizes (images in the card load, the window narrows). Runs
		 * on the card with `data-wp-watch`.
		 *
		 * @return {(() => void)|undefined} Cleanup that stops observing.
		 */
		placeCard() {
			const { ref } = getElement();
			if ( ! state.isOpen ) {
				resetCard( ref );
				return undefined;
			}

			const placement = placeCard( ref );
			// Below the image, the card may be off screen. Not for a card that
			// hover opened: scrolling would move the marker from under the
			// mouse, and the card would close as the pointer leaves.
			if ( 'stacked' === placement && 'hover' !== state.openedBy ) {
				ref.scrollIntoView( {
					block: 'nearest',
					behavior: prefersReducedMotion() ? 'auto' : 'smooth',
				} );
			}

			if ( 'undefined' === typeof window.ResizeObserver ) {
				return undefined;
			}
			let frame = 0;
			const observer = new window.ResizeObserver( () => {
				window.cancelAnimationFrame( frame );
				frame = window.requestAnimationFrame( () => placeCard( ref ) );
			} );
			observer.observe( ref );
			const canvas = ref.closest(
				'.wp-block-a8csp-image-hotspots__canvas'
			);
			if ( canvas ) {
				observer.observe( canvas );
			}
			return () => {
				window.cancelAnimationFrame( frame );
				observer.disconnect();
			};
		},
	},
} );
