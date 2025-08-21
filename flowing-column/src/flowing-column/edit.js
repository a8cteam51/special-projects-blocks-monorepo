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
	ToggleControl,
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
		columnGap,
		columnRuleStyle,
		columnRuleWidth,
		columnRuleColor,
		stackOnMobile,
	} = attributes;

	const blockProps = useBlockProps( {
		style: {
			'--a8csp-flowing-column-column-count': columnCount,
			'--a8csp-flowing-column-column-gap': columnGap + 'rem',
			'--a8csp-flowing-column-column-rule-style': columnRuleStyle,
			'--a8csp-flowing-column-column-rule-width': columnRuleWidth + 'px',
			'--a8csp-flowing-column-column-rule-color': columnRuleColor,
		},
		className: stackOnMobile ? 'stack-on-mobile' : '',
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
						label={ __( 'Column Gap (rem)', 'flowing-column' ) }
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
						label={ __( 'Rule Width (px)', 'flowing-column' ) }
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

					<ColorPicker
						label={ __( 'Rule Color', 'flowing-column' ) }
						color={ columnRuleColor }
						onChangeComplete={ ( color ) =>
							setAttributes( { columnRuleColor: color.hex } )
						}
						enableAlpha={ false }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Responsive Settings', 'flowing-column' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Stack on Mobile', 'flowing-column' ) }
						checked={ stackOnMobile }
						onChange={ ( value ) =>
							setAttributes( { stackOnMobile: value } )
						}
						help={ __(
							'Stack columns vertically on mobile devices',
							'flowing-column'
						) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks template={ [ [ 'core/paragraph' ] ] } />
			</div>
		</>
	);
}
