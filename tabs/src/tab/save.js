/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes: { isActive, tabNumber } } ) {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return (
		<div
			{ ...innerBlocksProps }
			id={ `tabpanel-${ tabNumber }` }
			role="tabpanel"
			aria-labelledby={ `tab-${ tabNumber }` }
			hidden={ ! isActive }
		/>
	);
}
