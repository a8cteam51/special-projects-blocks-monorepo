import clsx from 'clsx';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	Panel,
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

const INNER_BLOCKS_TEMPLATE = [
	[
		'wpsp/accordion-item',
		{
			templateLock: 'all',
		},
	],
];

export default function Edit( {
	attributes: { iconPosition, allowMultipleOpen },
	setAttributes,
} ) {
	const className = clsx( {
		'icon-position-left': iconPosition === 'left',
	} );

	const blockProps = useBlockProps( {
		className,
		template: INNER_BLOCKS_TEMPLATE,
	} );

	return (
		<>
			<InspectorControls key="setting">
				<Panel>
					<PanelBody
						title={ __( 'Accordion Settings' ) }
						initialOpen={ true }
					>
						<PanelRow>
							<ToggleControl
								label={ __( 'Allow multiple items open' ) }
								onChange={ ( value ) => {
									setAttributes( {
										allowMultipleOpen: value,
									} );
								} }
								checked={ allowMultipleOpen }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleGroupControl
								__nextHasNoMarginBottom
								isBlock
								label={ __( 'Icon Position' ) }
								value={ iconPosition }
								onChange={ ( value ) => {
									setAttributes( { iconPosition: value } );
								} }
							>
								<ToggleGroupControlOption
									label="Left"
									value="left"
								/>
								<ToggleGroupControlOption
									label="Right"
									value="right"
								/>
							</ToggleGroupControl>
						</PanelRow>
					</PanelBody>
				</Panel>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks />
			</div>
		</>
	);
}
