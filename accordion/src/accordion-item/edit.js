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
	attributes: { allowedBlocks, templateLock, openByDefault },
	setAttributes,
} ) {
	const blockProps = useBlockProps( {
		template: [
			[
				'wpsp/accordion-trigger',
				{
					templateLock: 'all',
				},
			],
			[
				'wpsp/accordion-content',
				{
					templateLock: 'insert',
				},
			],
		],
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		className: 'wpsp-accordion-item__content',
	} );

	return (
		<>
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Display' ) }>
					<PanelRow>
						<ToggleControl
							label={ __( 'Open by default' ) }
							onChange={ ( value ) => {
								setAttributes( {
									openByDefault: value,
								} );
							} }
							checked={ openByDefault }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks { ...innerBlocksProps } />
		</>
	);
}
