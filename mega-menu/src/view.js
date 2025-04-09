/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

const { state, actions, helpers } = store( 'a8csp/mega-menu', {
	state: {
		get isOpen() {
			const { id } = getContext();
			return state.selected === id;
		},
	},
	selectors: {
		toggleText: () => {
			const context = getContext();

			return context.isMenuOpen ? state.closeText : state.openText;
		},
	},
	actions: {
		toggleMenu() {
			const context = getContext();

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

			pageBody.classList.remove( 'mega-menu-open' );
		},
		openMenu() {
			const { id } = getContext();

			state.selected = id;

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
