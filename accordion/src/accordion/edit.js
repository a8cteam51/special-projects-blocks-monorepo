import clsx from 'clsx';
import {
	InnerBlocks,
	useBlockProps,
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

const INNER_BLOCKS_TEMPLATE = [ [ 'wpsp/accordion-item', {} ] ];

export default function Edit( { attributes, setAttributes } ) {
	const { allowedBlocks, iconPosition, allowMultipleOpen } = attributes;

	const className = clsx( {
		'icon-position-left': iconPosition === 'left',
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
			<div { ...useBlockProps( { className } ) }>
				<InnerBlocks
					allowedBlocks={ allowedBlocks }
					renderAppender={ InnerBlocks.DefaultBlockAppender }
					template={ INNER_BLOCKS_TEMPLATE }
				/>
			</div>
		</>
	);
}
