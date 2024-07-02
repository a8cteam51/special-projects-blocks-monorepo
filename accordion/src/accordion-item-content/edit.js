import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	HeadingLevelDropdown,
	AlignmentControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	return (
		<div {...useBlockProps()}>
			<InnerBlocks 
				template={['core/paragraph', {}]} 
				renderAppender={InnerBlocks.DefaultBlockAppender}
			/>
		</div>
	);
}
