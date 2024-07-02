import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const INNER_BLOCKS_TEMPLATE = [
	[ 'wpsp/accordion-item', {} ],
	[ 'wpsp/accordion-item', {} ],
];

export default function Edit( { attributes } ) {
	const { allowedBlocks } = attributes;

	return (
		<div { ...useBlockProps() }>
			<InnerBlocks 
				allowedBlocks={ allowedBlocks }
				renderAppender={ InnerBlocks.DefaultBlockAppender }
				template={ INNER_BLOCKS_TEMPLATE }
			/>
		</div>
	);
}
