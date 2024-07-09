import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { textAlign, openByDefault, iconPosition } = attributes;

	const className = clsx( {
		'icon-position-left': iconPosition === 'left',
		[ `has-text-align-${ textAlign }` ]: textAlign,
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
			</InspectorControls>
			<div { ...useBlockProps( { className: className } ) }>
				<InnerBlocks
					template={ [
						[ 'wpsp/accordion-item-trigger', {} ],
						[ 'wpsp/accordion-item-content', {} ],
					] }
				/>
			</div>
		</>
	);
}
