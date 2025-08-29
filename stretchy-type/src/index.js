import {
	createBlock,
	getBlockType,
	registerBlockType,
} from '@wordpress/blocks';
import { subscribe } from '@wordpress/data';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

// Subscribe is needed to wait for the core/paragraph block to be registered.
const unsubscribe = subscribe( () => {
	const paragraphBlockType = getBlockType( 'core/paragraph' );
	if ( paragraphBlockType ) {
		unsubscribe();
		registerBlockType( metadata.name, {
			edit: Edit,
			save,
			supports: {
				...paragraphBlockType.supports,
				className: true,
				typography: {
					...paragraphBlockType.supports.typography,
					fontSize: false,
				},
			},
			transforms: {
				from: [
					{
						type: 'block',
						blocks: [ 'core/paragraph', 'core/heading' ],
						transform: ( { content } ) => {
							return createBlock( metadata.name, {
								content,
							} );
						},
					},
				],
				to: [
					{
						type: 'block',
						blocks: [ 'core/paragraph' ],
						transform: ( { content } ) => {
							return createBlock( 'core/paragraph', {
								content,
							} );
						},
					},
				],
			},
		} );
	}
} );
