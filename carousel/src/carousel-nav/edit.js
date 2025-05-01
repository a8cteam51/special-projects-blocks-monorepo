// WordPress dependencies.
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import { getAttributes, navigationButtons } from './common';
import './editor.css';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { layout, buttonColors } = attributes;
	const { background, icon } = buttonColors;

	const { ...innerBlocksProps } = useInnerBlocksProps(
		useBlockProps( getAttributes() ),
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
							label: __( 'Icon', 'carousel' ),
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
			<div { ...innerBlocksProps }>
				{ navigationButtons( attributes ) }
			</div>
		</>
	);
}
