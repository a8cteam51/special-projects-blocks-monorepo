/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

const { state, actions, helpers } = store( 'wpcomsp/mega-menu', {
	selectors: {
		toggleText: () => {
			const context = getContext();

			return context.isMenuOpen ? state.closeText : state.openText;
		},
	},
	actions: {
		toggleMenu() {
			const context = getContext();

			if ( context.isMenuOpen ) {
				actions.closeMenu();
			} else {
				actions.openMenu();
			}
		},
		closeMenu() {
			const context = getContext();

			context.isMenuOpen = false;
			const { pageBody } = helpers.getDivs();

			pageBody.classList.remove( 'mega-menu-open' );
		},
		openMenu() {
			const context = getContext();
			context.isMenuOpen = true;

			const { pageBody, megaMenuContainer } = helpers.getDivs();

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
			const context = getContext();

			// If Escape close the menu.
			if ( event?.key === 'Escape' ) {
				const button = helpers.getButton( context.button );

				actions.closeMenu();
				button.focus();
			}
		},
	},
	helpers: {
		getButton: ( id ) => {
			return document.getElementById( id );
		},
		getDivs: () => {
			return {
				megaMenuContainer: document.getElementById( 'mega-menu-1' ),
				pageBody: document.querySelector( 'body' ),
			};
		},
	},
} );
