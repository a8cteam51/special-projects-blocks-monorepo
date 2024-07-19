/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( {} ) {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );
	const tabIndex = 0;
	const tabNumber = tabIndex + 1;
	const isActiveTab = false;

	return (
		<div
			{ ...innerBlocksProps }
			id={ `tabpanel-${ tabNumber }` }
			role="tabpanel"
			aria-labelledby={ `tab-${ tabNumber }` }
			hidden={ ! isActiveTab }
		/>
	);
}
