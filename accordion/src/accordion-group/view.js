import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store( 'wpsp/accordion', {
	state: {
		get isOpen() {
			const { attributes } = getElement();
			const { id } = attributes;
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
				context.isOpen.pop( id );
			} else {
				context.isOpen.push( id );
			}
		},
	},
} );
