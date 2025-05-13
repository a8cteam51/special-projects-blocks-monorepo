// WordPress dependencies.
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/block-editor';
import { RangeControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import { getHTMLAttributes, navigationButtons } from './common';
import './editor.css';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { layout, buttonColors, buttonSize } = attributes;
	const { background, icon } = buttonColors;

	const { ...innerBlocksProps } = useInnerBlocksProps(
		useBlockProps( getHTMLAttributes( attributes ) ),
		{
			templateInsertUpdatesSelection: true,
			orientation: layout?.orientation ?? 'horizontal',
			renderAppender: false,
		}
	);

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={ clientId }
					settings={ [
						{
							label: __( 'Button background', 'carousel' ),
							colorValue: background,
							onColorChange: ( v ) =>
								setAttributes( {
									buttonColors: {
										...buttonColors,
										background: v,
									},
								} ),
						},
						{
							label: __( 'Button icon', 'carousel' ),
							colorValue: icon,
							onColorChange: ( v ) =>
								setAttributes( {
									buttonColors: { ...buttonColors, icon: v },
								} ),
						},
					] }
					{ ...useMultipleOriginColorsAndGradients() }
				/>
			</InspectorControls>
			<InspectorControls>
				<PanelBody title={ __( 'Button size', 'carousel' ) }>
					<RangeControl
						label={ __( 'Button size', 'carousel' ) }
						value={ buttonSize }
						onChange={ ( v ) => setAttributes( { buttonSize: v } ) }
						min={ 0 }
						max={ 100 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps }>
				{ navigationButtons( attributes ) }
			</div>
		</>
	);
}
