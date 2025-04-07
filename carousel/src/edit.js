// WordPress dependencies.
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import CarouselPlaceHolder from './placeholder';
import './editor.css';

/**
 * Recursively creates a block and its inner blocks.
 *
 * @param {Object} block The block configuration.
 *
 * @return {Object} The created block.
 */
const createBlockWithInnerBlocks = ( block ) => {
	return createBlock(
		block.name,
		block.attributes || {},
		block.innerBlocks?.map( createBlockWithInnerBlocks )
	);
};

export default function Edit( { clientId, name, setAttributes } ) {
	const { children, ...innerBlockProps } = useInnerBlocksProps(
		useBlockProps(),
		{
			renderAppender: false,
		}
	);

	const { hasInnerBlocks } = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );

			if ( ! block?.innerBlocks?.length ) {
				return { hasInnerBlocks: false };
			}

			const innerBlock = block.innerBlocks[ 0 ];
			let count = 0;

			switch ( innerBlock.name ) {
				case 'core/gallery':
					count = innerBlock.innerBlocks?.length || 0;
					break;
				default:
					count = innerBlock.attributes.query?.perPage || 0;
			}

			return { hasInnerBlocks: true, itemCount: count };
		},
		[ clientId ]
	);

	const { selectBlock, insertBlock } = useDispatch( blockEditorStore );

	const selectVariation = ( nextVariation ) => {
		nextVariation.innerBlocks.forEach( ( block ) => {
			insertBlock(
				createBlockWithInnerBlocks( block ),
				undefined,
				clientId
			);
		} );

		setAttributes( nextVariation.attributes );

		selectBlock( clientId );
	};

	return (
		<>
			{ ! hasInnerBlocks ? (
				<>
					{ children }
					<CarouselPlaceHolder
						name={ name }
						onSelect={ selectVariation }
					/>
				</>
			) : (
				<>
					<div { ...innerBlockProps }>
						{ children }
					</div>
				</>
			) }
		</>
	);
}
