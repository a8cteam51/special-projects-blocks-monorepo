/**
 * WordPress dependencies
 */
import {
	store,
	getContext,
	getElement,
	withScope,
} from '@wordpress/interactivity';

/**
 * How long a panel opened on hover stays open after the pointer leaves its
 * item, so the pointer can cross a gap between the item and the panel.
 */
const HOVER_CLOSE_DELAY = 120;

let hoverCloseTimer;

const { state, actions, helpers } = store( 'a8csp/mega-menu', {
	state: {
		get isOpen() {
			const { id } = getContext();
			return state.selected === id;
		},
		openedOnHover: false,
	},
	selectors: {
		toggleText: () => {
			const context = getContext();

			return context.isMenuOpen ? state.closeText : state.openText;
		},
	},
	actions: {
		toggleMenu() {
			// A click on a panel opened on hover keeps it open, rather than
			// closing what the visitor has just reached for.
			if ( state.isOpen && state.openedOnHover ) {
				state.openedOnHover = false;
				return;
			}

			if ( state.isOpen ) {
				actions.closeMenu();
			} else {
				actions.openMenu();
			}
		},
		closeMenu() {
			const { id } = getContext();

			const { pageBody } = helpers.getDivs( id );

			state.selected = null;
			state.openedOnHover = false;

			pageBody.classList.remove( 'mega-menu-open' );
		},
		openMenu() {
			const { id } = getContext();

			state.selected = id;
			state.openedOnHover = false;

			const { pageBody, megaMenuContainer } = helpers.getDivs( id );

			pageBody.classList.add( 'mega-menu-open' );

			const internalLinks = megaMenuContainer.querySelectorAll( 'a, button' );

			if ( internalLinks.length ) {
				//	Wait for the menu to be visible before focusing on the first link.
				setTimeout( function() {
						[...internalLinks][ 0 ].focus();
					}, 100
				);
			}
		},
		openOnHover() {
			if ( ! helpers.canOpenOnHover() ) {
				return;
			}

			window.clearTimeout( hoverCloseTimer );

			if ( state.isOpen ) {
				return;
			}

			const { id } = getContext();
			const { pageBody } = helpers.getDivs( id );

			// Unlike a click, hover leaves focus where it is.
			state.selected = id;
			state.openedOnHover = true;

			pageBody.classList.add( 'mega-menu-open' );
		},
		closeOnHover() {
			if ( ! state.isOpen || ! state.openedOnHover ) {
				return;
			}

			const { id } = getContext();

			window.clearTimeout( hoverCloseTimer );
			hoverCloseTimer = window.setTimeout(
				withScope( () => {
					if ( state.selected === id && state.openedOnHover ) {
						actions.closeMenu();
					}
				} ),
				HOVER_CLOSE_DELAY
			);
		},
		handleMenuKeydown( event ) {
			const { id, button } = getContext();

			if ( state.selected !== id ) {
				return;
			}

			// If Escape close the menu.
			if ( event?.key === 'Escape' ) {
				const closeButton = helpers.getButton( button );

				actions.closeMenu();
				closeButton.focus();
			}
		},
	},
	callbacks: {
		handleModalOutsideClick( event ) {
			const { id } = getContext();

			if ( state.selected !== id ) {
				return;
			}

			if ( id === event.target.getAttribute('aria-controls') ) {
				return;
			}

			const modal = helpers.getDivs( id );
			const modalInner = modal.megaMenuContainer;

			if ( ! modalInner.contains( event.target ) ) {
				actions.closeMenu();
			}
		},
	},
	helpers: {
		// Hover opens panels only where the pointer can hover, and not in the
		// open Navigation overlay, where the items are a stacked list.
		canOpenOnHover: () => {
			const { ref } = getElement();

			return (
				window.matchMedia( '(hover: hover)' ).matches &&
				! ref.closest(
					'.wp-block-navigation__responsive-container.is-menu-open'
				)
			);
		},
		getButton: ( id ) => {
			return document.getElementById( id );
		},
		getDivs: ( id ) => {
			return {
				megaMenuContainer: document.getElementById( id ),
				pageBody: document.querySelector( 'body' ),
			};
		},
	},
} );
