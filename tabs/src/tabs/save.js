/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'wp-block-wpcomsp-tab__content',
	} );

	return (
		<div { ...blockProps }>
			<div role="tablist"></div>
			<div { ...innerBlocksProps }></div>
		</div>
	);
}
