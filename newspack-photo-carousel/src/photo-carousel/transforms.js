/**
 * Gallery ⇄ carousel. Both hold core/image blocks, so the images and their
 * captions carry over.
 */
import { createBlock } from '@wordpress/blocks';

const cloneImages = ( innerBlocks ) =>
	innerBlocks
		.filter( ( { name } ) => 'core/image' === name )
		.map( ( { attributes } ) =>
			createBlock( 'core/image', { ...attributes } )
		);

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'core/gallery' ],
			transform: ( { imageCrop = true }, innerBlocks ) =>
				createBlock(
					'newspack/photo-carousel',
					{ imageCrop },
					cloneImages( innerBlocks )
				),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/gallery' ],
			transform: ( { imageCrop }, innerBlocks ) =>
				createBlock(
					'core/gallery',
					{ imageCrop },
					cloneImages( innerBlocks )
				),
		},
	],
};
