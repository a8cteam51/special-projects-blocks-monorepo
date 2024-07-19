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

export default function Edit( { attributes: { templateLock } } ) {
	const blockProps = useBlockProps( {
		className: 'wpsp-accordion-item__content',
		template: [
			[
				'core/paragraph',
				{ placeholder: 'Accordion item content goes here.' },
			],
		],
		templateLock,
	} );

	return <InnerBlocks { ...blockProps } />;
}
