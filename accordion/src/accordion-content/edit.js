import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
	HeadingLevelDropdown,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';

export default function Edit( {
	attributes: { templateLock, allowedBlocks },
} ) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		className: 'wpsp-accordion-item__content',
	} );

	return (
		<div { ...innerBlocksProps }>
			<InnerBlocks
				template={ [
					[
						'core/paragraph',
						{ placeholder: 'Accordion item content goes here.' },
					],
				] }
			/>
		</div>
	);
}
