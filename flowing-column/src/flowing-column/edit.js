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
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';

/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ColorPicker,
} from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		columnCount,
		columnMinWidth,
		columnMinWidthUnit,
		columnGap,
		columnGapUnit,
		columnRuleStyle,
		columnRuleWidth,
		columnRuleWidthUnit,
		columnRuleColor,
		minColumns,
	} = attributes;

	const blockProps = useBlockProps( {
		style: {
			'--a8csp-flowing-column-column-count': String( columnCount ),
			'--a8csp-flowing-column-column-min-width':
				columnMinWidth === 0 || columnMinWidth === null
					? 'auto'
					: `${ columnMinWidth }${ columnMinWidthUnit }`,
			'--a8csp-flowing-column-column-gap': `${ columnGap }${ columnGapUnit }`,
			'--a8csp-flowing-column-column-rule-style': String(
				columnRuleStyle || 'none'
			),
			'--a8csp-flowing-column-column-rule-width': `${ columnRuleWidth }${ columnRuleWidthUnit }`,
			'--a8csp-flowing-column-column-rule-color': String(
				columnRuleColor || '#000000'
			),
			'--a8csp-flowing-column-min-columns': String( minColumns ),
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Column Settings', 'flowing-column' ) }
					initialOpen={ true }
				>
					<RangeControl
						label={ __( 'Number of Columns', 'flowing-column' ) }
						value={ columnCount }
						onChange={ ( value ) =>
							setAttributes( { columnCount: value } )
						}
						min={ 1 }
						max={ 6 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={ __(
							'Minimum Number of Columns',
							'flowing-column'
						) }
						value={ minColumns }
						onChange={ ( value ) =>
							setAttributes( { minColumns: value } )
						}
						min={ 1 }
						max={ columnCount }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={ __( 'Column Minimum Width', 'flowing-column' ) }
						value={ columnMinWidth }
						onChange={ ( value ) =>
							setAttributes( { columnMinWidth: value } )
						}
						min={ 100 }
						max={ 800 }
						step={ 10 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={ __(
							'Column Minimum Width Unit',
							'flowing-column'
						) }
						value={ columnMinWidthUnit }
						onChange={ ( value ) =>
							setAttributes( { columnMinWidthUnit: value } )
						}
						options={ [
							{
								label: __( 'Pixels (px)', 'flowing-column' ),
								value: 'px',
							},
							{
								label: __( 'Ems (em)', 'flowing-column' ),
								value: 'em',
							},
							{
								label: __( 'Rems (rem)', 'flowing-column' ),
								value: 'rem',
							},
						] }
					/>

					<RangeControl
						label={ __( 'Column Gap', 'flowing-column' ) }
						value={ columnGap }
						onChange={ ( value ) =>
							setAttributes( { columnGap: value } )
						}
						min={ 0 }
						max={ 5 }
						step={ 0.1 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={ __( 'Column Gap Unit', 'flowing-column' ) }
						value={ columnGapUnit }
						onChange={ ( value ) =>
							setAttributes( { columnGapUnit: value } )
						}
						options={ [
							{
								label: __( 'Pixels (px)', 'flowing-column' ),
								value: 'px',
							},
							{
								label: __( 'Ems (em)', 'flowing-column' ),
								value: 'em',
							},
							{
								label: __( 'Rems (rem)', 'flowing-column' ),
								value: 'rem',
							},
						] }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Column Rule Settings', 'flowing-column' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Rule Style', 'flowing-column' ) }
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
					/>

					<RangeControl
						label={ __( 'Rule Width', 'flowing-column' ) }
						value={ columnRuleWidth }
						onChange={ ( value ) =>
							setAttributes( { columnRuleWidth: value } )
						}
						min={ 0 }
						max={ 10 }
						step={ 1 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={ __( 'Rule Width Unit', 'flowing-column' ) }
						value={ columnRuleWidthUnit }
						onChange={ ( value ) =>
							setAttributes( { columnRuleWidthUnit: value } )
						}
						options={ [
							{
								label: __( 'Pixels (px)', 'flowing-column' ),
								value: 'px',
							},
							{
								label: __( 'Ems (em)', 'flowing-column' ),
								value: 'em',
							},
							{
								label: __( 'Rems (rem)', 'flowing-column' ),
								value: 'rem',
							},
						] }
					/>

					<ColorPicker
						label={ __( 'Rule Color', 'flowing-column' ) }
						color={ columnRuleColor }
						onChangeComplete={ ( color ) =>
							setAttributes( { columnRuleColor: color.hex } )
						}
						enableAlpha={ false }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks template={ [ [ 'core/paragraph' ] ] } />
			</div>
		</>
	);
}
