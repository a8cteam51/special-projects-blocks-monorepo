/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { actions, state, helpers } = store( 'a8csp/modal', {
	state: {
		get isModalOpen() {
			const { id } = getContext();
			return state.selected === id;
		},
		clickedButton: null,
	},
	actions: {
		focusOpen() {
			const { id } = getContext();
			const modal = helpers.getModal( id );
			const focusElements = [ ...modal.querySelectorAll(
				'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"]'
				) ].filter( element => ! element.hasAttribute( 'disabled' ) && ! element.getAttribute('aria-hidden') );
			const focusElement = focusElements[ 0 ] || null;
			const closeBtn = helpers.getCloseBtn( modal );
	
			if ( focusElement ) {
				focusElement.focus();
			} else {
				closeBtn.focus();
			}

			if ( helpers.hasTransition( modal ) ) {
				modal.removeEventListener( 'transitionend', actions.focusOpen );
			}
		},
		focusClose() {
			const { id } = getContext();
			const modal = helpers.getModal( id );
			const button = helpers.getButton( state.clickedButton );
			button.focus();

			if ( helpers.hasTransition( modal ) ) {
				modal.removeEventListener( 'transitionend', actions.focusOpen );
			}
		},
		closeModal() {
			const { id } = getContext();
			const modal = helpers.getModal( id );
			const body = helpers.getBody();

			state.selected = null;

			actions.togglePageFocus( false );

			// This is needed as the focus cannot be set until the modal is fully visible.
			if ( helpers.hasTransition( modal ) ) {
				modal.addEventListener( 'transitionend', actions.focusClose, false );
			} else {
				actions.focusClose();
			}

			body.classList.remove( 'modal-open' );
		},
		openModal( event ) {
			const { id } = getContext();
			const modal = helpers.getModal( id );
			const body = helpers.getBody();

			state.selected = id;

			// Don't return focus to the clicked button if it is inside a modal.
			if ( event.target.closest(".wp-block-a8csp-modal-container") === null ) {
				state.clickedButton = event.target.id;
			}

			actions.togglePageFocus( true );

			// This is needed as the focus cannot be set until the modal is fully visible.
			if ( helpers.hasTransition( modal ) ) {
				modal.addEventListener( 'transitionend', actions.focusOpen, false );
			} else {
				actions.focusOpen();
			}

			body.classList.add( 'modal-open' );
		},
		handleModalKeydown( event ) {
			// If Escape close the menu.
			if ( event?.key === 'Escape' ) {
				actions.closeModal();
			}
		},
		togglePageFocus( toggle ) {
			const siteContainer = helpers.getSiteContainer();
			const skipLink = helpers.getSkipLink();

			if ( toggle ) {
				siteContainer?.setAttribute( 'inert', 'true' );
				skipLink?.setAttribute( 'inert', 'true' );
			} else {
				siteContainer?.removeAttribute( 'inert' );
				skipLink?.removeAttribute( 'inert' );
			}
		},
	},
	callbacks: {
		handleModalOutsideClick( event ) {
			const { id } = getContext();

			if ( state.selected !== id ) {
				return;
			}

			if ( 'wp-block-a8csp-modal' === event.target.className ) {
				return;
			}
			
			const modal = helpers.getModal( id );
			const modalInner = modal.querySelector( '.wp-block-a8csp-modal-container--inner' );

			if ( ! modalInner.contains( event.target ) ) {
				actions.closeModal();
			}
		},
	},
	helpers: {
		getButton: ( button ) => {
			return document.getElementById( button );
		},
		getModal: ( id ) => {
			return document.getElementById( id );
		},
		getSiteContainer: () => {
			return document.getElementsByClassName( 'wp-site-blocks' ) ? document.getElementsByClassName( 'wp-site-blocks' )[ 0 ] : null;
		},
		getSkipLink: () => {
			return document.getElementsByClassName( 'skip-link' ) ? document.getElementsByClassName( 'skip-link' )[ 0 ] : null;
		},
		getCloseBtn: ( modal ) => {
			return modal.getElementsByClassName( 'close-modal' )[ 0 ];
		},
		hasTransition( element ) {
			return parseFloat( getComputedStyle(element)['transitionDuration'] );
		},
		getBody() {
			return document.body;
		}
	},
} );
