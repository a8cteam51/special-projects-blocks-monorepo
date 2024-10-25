/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @param  root0
 * @param  root0.attributes
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { content, viewBox } = attributes;
	const blockProps = useBlockProps.save( viewBox ? { viewBox } : {} );
	return (
		<svg { ...blockProps }>
			<foreignObject x="0" y="0" width="100%" height="100%">
				<span>
					<RichText.Content value={ content } />
				</span>
			</foreignObject>
		</svg>
	);
}
