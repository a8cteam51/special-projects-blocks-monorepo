/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

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
	const {
		columnCount,
		columnGap,
		columnRuleStyle,
		columnRuleWidth,
		columnRuleColor,
		stackOnMobile,
	} = attributes;

	console.log( columnCount );

	const blockProps = useBlockProps.save( {
		style: {
			'--a8csp-flowing-column-column-count': columnCount + '',
			'--a8csp-flowing-column-column-gap': columnGap + 'rem',
			'--a8csp-flowing-column-column-rule-style': columnRuleStyle,
			'--a8csp-flowing-column-column-rule-width': columnRuleWidth + 'px',
			'--a8csp-flowing-column-column-rule-color': columnRuleColor,
		},
		className: stackOnMobile ? 'stack-on-mobile' : '',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
