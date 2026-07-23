// WordPress dependencies.
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/block-editor';
import { RangeControl, PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import { getHTMLAttributes, paginationButtons } from './common';
import './editor.css';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId, context } = props;
	const { layout, buttonColors, buttonSize, count } = attributes;
	const { background, backgroundHover } = buttonColors || {};

	const itemCountContext = context[ 'a8csp/item-count' ];

	const { ...innerBlocksProps } = useInnerBlocksProps(
		useBlockProps( getHTMLAttributes( attributes ) ),
		{
			templateInsertUpdatesSelection: true,
			orientation: layout?.orientation ?? 'horizontal',
			renderAppender: false,
		}
	);

	useEffect( () => {
		if ( count !== itemCountContext ) {
			setAttributes( { count: itemCountContext } );
		}
	}, [ itemCountContext, setAttributes, count ] );

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={ clientId }
					settings={ [
						{
							label: __( 'Button', 'a8csp-carousel' ),
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
							label: __( 'Button hover', 'a8csp-carousel' ),
							colorValue: backgroundHover,
							onColorChange: ( v ) =>
								setAttributes( {
									buttonColors: {
										...buttonColors,
										backgroundHover: v,
									},
								} ),
						},
					] }
					{ ...useMultipleOriginColorsAndGradients() }
				/>
			</InspectorControls>
			<InspectorControls>
				<PanelBody title={ __( 'Button size', 'a8csp-carousel' ) }>
					<RangeControl
						label={ __( 'Button size', 'a8csp-carousel' ) }
						value={ buttonSize }
						onChange={ ( v ) => setAttributes( { buttonSize: v } ) }
						min={ 0 }
						max={ 100 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps }>{ paginationButtons( count ) }</div>
		</>
	);
}
