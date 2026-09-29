/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	ColorPalette,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	withColors,
} from '@wordpress/block-editor';

/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
import {
	BaseControl,
	PanelBody,
	RangeControl,
	SelectControl,
	__experimentalUnitControl as UnitControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import getColumnStyle from './get-column-style';

const UNITS = [ 'px', 'em', 'rem' ].map( ( value ) => ( {
	value,
	label: value,
} ) );

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props                    Block props.
 * @param {Object}   props.attributes         Block attributes.
 * @param {Function} props.setAttributes      Function to set block attributes.
 * @param {Object}   props.columnRuleColor    Rule color object from withColors.
 * @param {Function} props.setColumnRuleColor Rule color setter from withColors.
 * @return {Element} Element to render.
 */
function Edit( {
	attributes,
	setAttributes,
	columnRuleColor,
	setColumnRuleColor,
} ) {
	const { columnCount, columnMinWidth, columnRuleStyle, columnRuleWidth } =
		attributes;
	const hasMinWidth = parseFloat( columnMinWidth ) > 0;

	const blockProps = useBlockProps( {
		style: getColumnStyle( attributes ),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: [ [ 'core/paragraph' ] ],
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Columns', 'flowing-column' ) }>
					<RangeControl
						label={
							hasMinWidth
								? __( 'Maximum columns', 'flowing-column' )
								: __( 'Columns', 'flowing-column' )
						}
						help={
							hasMinWidth
								? __(
										'0 fits as many columns as the minimum width allows.',
										'flowing-column'
								  )
								: undefined
						}
						value={ columnCount }
						onChange={ ( value ) =>
							setAttributes( { columnCount: value } )
						}
						min={ hasMinWidth ? 0 : 1 }
						max={ 6 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={ __( 'Minimum column width', 'flowing-column' ) }
						help={ __(
							'Columns narrower than this reflow into fewer columns. Leave empty for a fixed number of columns.',
							'flowing-column'
						) }
						value={ columnMinWidth }
						onChange={ ( value ) =>
							setAttributes( { columnMinWidth: value } )
						}
						units={ UNITS }
						min={ 0 }
						__next40pxDefaultSize
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Column rule', 'flowing-column' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Style', 'flowing-column' ) }
						value={ columnRuleStyle }
						onChange={ ( value ) =>
							setAttributes( { columnRuleStyle: value } )
						}
						options={ [
							{
								label: __( 'None', 'flowing-column' ),
								value: 'none',
							},
							{
								label: __( 'Solid', 'flowing-column' ),
								value: 'solid',
							},
							{
								label: __( 'Dashed', 'flowing-column' ),
								value: 'dashed',
							},
							{
								label: __( 'Dotted', 'flowing-column' ),
								value: 'dotted',
							},
							{
								label: __( 'Double', 'flowing-column' ),
								value: 'double',
							},
							{
								label: __( 'Groove', 'flowing-column' ),
								value: 'groove',
							},
							{
								label: __( 'Ridge', 'flowing-column' ),
								value: 'ridge',
							},
							{
								label: __( 'Inset', 'flowing-column' ),
								value: 'inset',
							},
							{
								label: __( 'Outset', 'flowing-column' ),
								value: 'outset',
							},
						] }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={ __( 'Width', 'flowing-column' ) }
						value={ columnRuleWidth }
						onChange={ ( value ) =>
							setAttributes( { columnRuleWidth: value } )
						}
						units={ UNITS }
						min={ 0 }
						__next40pxDefaultSize
					/>

					<BaseControl __nextHasNoMarginBottom>
						<BaseControl.VisualLabel>
							{ __( 'Color', 'flowing-column' ) }
						</BaseControl.VisualLabel>
						<ColorPalette
							aria-label={ __( 'Rule color', 'flowing-column' ) }
							value={ columnRuleColor.color }
							onChange={ setColumnRuleColor }
						/>
					</BaseControl>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}

export default withColors( 'columnRuleColor' )( Edit );
