// WordPress dependencies.
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	ToggleControl,
	__experimentalHStack as HStack, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import { getHTMLAttributes, navigationButtons } from './common';
import './editor.css';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { layout, buttonColors, buttonSize, customIcon, iconUpload } =
		attributes;
	const { background, backgroundHover, icon, iconHover } = buttonColors;

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
							label: __( 'Button', 'carousel' ),
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
							label: __( 'Button hover', 'carousel' ),
							colorValue: backgroundHover,
							onColorChange: ( v ) =>
								setAttributes( {
									buttonColors: {
										...buttonColors,
										backgroundHover: v,
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
						{
							label: __( 'Icon hover', 'carousel' ),
							colorValue: iconHover,
							onColorChange: ( v ) =>
								setAttributes( {
									buttonColors: {
										...buttonColors,
										iconHover: v,
									},
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
				<PanelBody title={ __( 'Button icon', 'carousel' ) }>
					<ToggleControl
						label={ __( 'Custom icon', 'carousel' ) }
						checked={ customIcon }
						onChange={ ( v ) => setAttributes( { customIcon: v } ) }
					/>
					{ customIcon && (
						<>
							<p>
								{ __(
									'Upload an icon for the left button. It will be flipped for the right button',
									'carousel'
								) }
							</p>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( v ) =>
										setAttributes( { iconUpload: v } )
									}
									allowedTypes={ [ 'image' ] }
									value={ iconUpload ? iconUpload.id : null }
									render={ ( { open } ) => (
										<>
											{ iconUpload ? (
												<HStack>
													<Button
														label={ __(
															'Reset icon',
															'carousel'
														) }
														onClick={ open }
													>
														<img
															src={
																iconUpload.url
															}
															alt={
																iconUpload.alt
															}
															style={ {
																maxWidth:
																	buttonSize +
																	'px',
															} }
														/>
													</Button>
													<Button
														isDestructive
														onClick={ () =>
															setAttributes( {
																iconUpload:
																	null,
															} )
														}
													>
														{ __(
															'Remove',
															'carousel'
														) }
													</Button>
												</HStack>
											) : (
												<Button onClick={ open }>
													{ __(
														'Set icon',
														'carousel'
													) }
												</Button>
											) }
										</>
									) }
								/>
							</MediaUploadCheck>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps }>
				{ navigationButtons( attributes ) }
			</div>
		</>
	);
}
