import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store( 'wpsp/accordion', {
	state: {
		get isOpen() {
			const { attributes } = getElement();
			const id =
				attributes.id ||
				attributes[ 'aria-controls' ] ||
				attributes[ 'data-id' ];
			const context = getContext();
			return context.isOpen.includes( id );
		},
	},
	actions: {
		toggle: () => {
			const { attributes } = getElement();
			const id = attributes[ 'aria-controls' ];
			const context = getContext();
			if ( context.isOpen.includes( id ) ) {
				if ( context.allowMultipleOpen ) {
					context.isOpen = context.isOpen.filter(
						( item ) => item !== id
					);
				} else {
					context.isOpen = [];
				}
			} else {
				if ( context.allowMultipleOpen ) {
					context.isOpen = [ ...context.isOpen, id ];
				} else {
					context.isOpen = [ id ];
				}
			}
		},
	},
} );
