import { store, getContext } from '@wordpress/interactivity';

store( 'wpsp-accordion', {
	actions: {
		toggle: () => {
			const context = getContext();
			context.isOpen = ! context.isOpen;
		},
	},
	callbacks: {
		logIsOpen: () => {
			const { isOpen } = getContext();
		},
	},
} );
