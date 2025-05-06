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
import { getAttributes, paginationButtons } from './common';
import './editor.css';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId, context } = props;
	const { layout, buttonColors, buttonSize, count } = attributes;
	const { background } = buttonColors || {};

	const itemCountContext = context[ 'wpcomsp/item-count' ];

	const { ...innerBlocksProps } = useInnerBlocksProps(
		useBlockProps( getAttributes( attributes ) ),
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
			<div { ...innerBlocksProps }>{ paginationButtons( count ) }</div>
		</>
	);
}
