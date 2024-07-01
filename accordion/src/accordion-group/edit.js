import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Edit( { attributes } ) {
	const { allowedBlocks } = attributes;

	return (
		<div { ...useBlockProps() }>
			<InnerBlocks allowedBlocks={ allowedBlocks } />
		</div>
	);
}
