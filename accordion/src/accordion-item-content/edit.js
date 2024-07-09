import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	return (
		<div { ...useBlockProps() }>
			<InnerBlocks
				template={ [ 'core/paragraph', {} ] }
				renderAppender={ InnerBlocks.DefaultBlockAppender }
			/>
		</div>
	);
}
