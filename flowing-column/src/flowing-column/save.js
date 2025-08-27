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
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const {
		columnCount,
		columnMinWidth,
		columnMinWidthUnit,
		columnGap,
		columnGapUnit,
		columnRuleStyle,
		columnRuleWidth,
		columnRuleWidthUnit,
		columnRuleColor,
		minColumns,
	} = attributes;

	const blockProps = useBlockProps.save( {
		style: {
			'--a8csp-flowing-column-column-count': columnCount + '',
			'--a8csp-flowing-column-column-min-width':
				columnMinWidth + columnMinWidthUnit,
			'--a8csp-flowing-column-column-gap': columnGap + columnGapUnit,
			'--a8csp-flowing-column-column-rule-style': columnRuleStyle,
			'--a8csp-flowing-column-column-rule-width':
				columnRuleWidth + columnRuleWidthUnit,
			'--a8csp-flowing-column-column-rule-color': columnRuleColor,
			'--a8csp-flowing-column-min-columns': minColumns + '',
		},
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
