// WordPress dependencies.
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	useSettings,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	SelectControl,
	TextControl,
	__experimentalUseCustomUnits as useCustomUnits, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import CarouselPlaceHolder from './placeholder';
import { getHTMLAttributes } from './common';
import './editor.css';

const CONTENT_BLOCKS = [
	'core/query',
	'core/gallery',
	'core/group',
	'woocommerce/product-collection',
	'core/columns',
];

/**
 * Recursively creates a block and its inner blocks.
 *
 * @param {Object} block The block configuration.
 *
 * @return {Object} The created block.
 */
const createBlockWithInnerBlocks = ( block ) => {
	return createBlock(
		block.name,
		{
			...block.attributes,
			metadata: block.metaData,
		},
		block.innerBlocks?.map( createBlockWithInnerBlocks )
	);
};

export default function Edit( { attributes, clientId, name, setAttributes } ) {
	const {
		animate,
		animateEnd,
		animationSpeed,
		overflow,
		title,
		trackHeight,
		trackHeightUnit,
	} = attributes;

	const { hasInnerBlocks, itemCount } = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );

			if ( ! block?.innerBlocks?.length ) {
				return { hasInnerBlocks: false, itemCount: 0, innerBlocks: [] };
			}

			const contentBlock = block.innerBlocks.find( ( innerBlock ) =>
				CONTENT_BLOCKS.includes( innerBlock.name )
			);

			if ( ! contentBlock ) {
				return { hasInnerBlocks: false, itemCount: 0, innerBlocks: [] };
			}

			let count = 0;

			switch ( contentBlock.name ) {
				case 'core/gallery':
				case 'core/group':
					count = contentBlock.innerBlocks?.length || 0;
					break;
				case 'core/query':
				case 'core/product-collection':
					// @TODO: Find a better way, this may not be reflective of displayed items.
					count = contentBlock.attributes.query?.perPage || 0;
					break;
				default:
					count = 0;
			}

			return {
				hasInnerBlocks: true,
				itemCount: count,
			};
		},
		[ clientId ]
	);

	const { children, ...innerBlockProps } = useInnerBlocksProps(
		useBlockProps( getHTMLAttributes( attributes ) )
	);

	useEffect( () => {
		setAttributes( { itemCount: Number( itemCount ) } );
	}, [ itemCount, setAttributes ] );

	const { selectBlock, insertBlock } = useDispatch( blockEditorStore );

	const selectVariation = ( nextVariation ) => {
		insertBlock(
			createBlock( 'wpcomsp/carousel-nav', {}, [] ),
			undefined,
			clientId
		);

		nextVariation.innerBlocks.forEach( ( block ) => {
			insertBlock(
				createBlockWithInnerBlocks( block ),
				undefined,
				clientId
			);
		} );

		setAttributes( nextVariation.attributes );

		selectBlock( clientId );
	};

	const HeightInput = ( {
		onChange,
		onUnitChange,
		unit = 'px',
		value = '',
	} ) => {
		const isPx = unit === 'px';

		const [ availableUnits ] = useSettings( 'spacing.units' );
		const units = useCustomUnits( {
			availableUnits: availableUnits || [ 'px', 'em', 'rem', 'vw', 'vh' ],
			defaultValues: {
				px: 430,
				'%': 20,
				em: 20,
				rem: 20,
				vw: 20,
				vh: 50,
			},
		} );

		const handleOnChange = ( unprocessedValue ) => {
			const inputValue =
				unprocessedValue !== ''
					? parseFloat( unprocessedValue )
					: undefined;

			if ( isNaN( inputValue ) && inputValue !== undefined ) {
				return;
			}

			onChange( inputValue );
		};

		const computedValue = useMemo( () => {
			const [ parsedQuantity ] =
				parseQuantityAndUnitFromRawValue( value );
			return [ parsedQuantity, unit ].join( '' );
		}, [ unit, value ] );

		return (
			<UnitControl
				__next40pxDefaultSize
				label={ __( 'Track height', 'carousel' ) }
				isResetValueOnUnitChange
				min={ isPx ? 430 : 0 }
				onChange={ handleOnChange }
				onUnitChange={ onUnitChange }
				units={ units }
				value={ computedValue }
			/>
		);
	};

	const defaultInspectorControls = (
		<InspectorControls>
			<PanelBody title={ __( 'Carousel Settings', 'carousel' ) }>
				<TextControl
					help={ __(
						'Briefly describe the carousel for screen reader users.',
						'carousel'
					) }
					label={ __( 'Title', 'carousel' ) }
					onChange={ ( v ) => setAttributes( { title: v } ) }
					value={ title }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={ __( 'Overflow', 'carousel' ) }
					onChange={ ( v ) => setAttributes( { overflow: v } ) }
					options={ [
						{
							value: 'hidden',
							label: __( 'Hidden', 'carousel' ),
						},
						{
							value: 'right',
							label: __( 'Right', 'carousel' ),
						},
						{
							value: 'left',
							label: __( 'Left', 'carousel' ),
						},
						{
							value: 'both',
							label: __( 'Left and right', 'carousel' ),
						},
					] }
					value={ overflow }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<SelectControl
					label={ __( 'Animate', 'carousel' ) }
					onChange={ ( v ) => setAttributes( { animate: v } ) }
					options={ [
						{
							value: 'one',
							label: __( 'One slide at a time', 'carousel' ),
						},
						{
							value: 'all-visible',
							label: __( 'All visible slides', 'carousel' ),
						},
					] }
					value={ animate }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<SelectControl
					label={ __( 'At end', 'carousel' ) }
					onChange={ ( v ) => {
						setAttributes( { animateEnd: v } );

						if ( 'infinite' === v ) {
							setAttributes( { pagination: false } );
						}
					} }
					options={ [
						{
							value: 'stop',
							label: __( 'Stop', 'carousel' ),
						},
						{
							value: 'back',
							label: __( 'Go back to first slide', 'carousel' ),
							disabled: true,
						},
						{
							value: 'infinite',
							label: __( 'Infinite loop', 'carousel' ),
						},
					] }
					value={ animateEnd }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<TextControl
					label={ __( 'Animation speed (in seconds)', 'carousel' ) }
					max="10"
					min="0.1"
					step="0.1"
					type="number"
					onChange={ ( v ) =>
						setAttributes( { animationSpeed: Number( v ) } )
					}
					value={ animationSpeed }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);

	const styleInspectorControls = (
		<InspectorControls group="dimensions">
			<HeightInput
				value={ trackHeight }
				unit={ trackHeightUnit }
				onChange={ ( v ) => setAttributes( { trackHeight: v } ) }
				onUnitChange={ ( v ) =>
					setAttributes( { trackHeightUnit: v } )
				}
			/>
		</InspectorControls>
	);

	return (
		<div { ...innerBlockProps }>
			{ ! hasInnerBlocks ? (
				<>
					{ children }
					<CarouselPlaceHolder
						name={ name }
						onSelect={ selectVariation }
					/>
				</>
			) : (
				<>
					{ defaultInspectorControls }
					{ styleInspectorControls }
					{ children }
				</>
			) }
		</div>
	);
}
