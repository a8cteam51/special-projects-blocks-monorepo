// WordPress dependencies.
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
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
];

/**
 * Searches for the slides/content container block.
 *
 * @param {Array} blocks Array of blocks to search through.
 *
 * @return {Object|null} The found content block, or null.
 */
const findContentBlock = ( blocks ) => {
	if ( ! blocks?.length ) {
		return null;
	}

	for ( const block of blocks ) {
		if ( block.name === 'core/group' ) {
			if (
				block.attributes.className?.includes(
					'wp-block-wpcomsp-carousel-track'
				)
			) {
				return block;
			}
		} else if ( CONTENT_BLOCKS.includes( block.name ) ) {
			return block;
		}

		const foundInInner = findContentBlock( block.innerBlocks );
		if ( foundInInner ) {
			return foundInInner;
		}
	}

	return null;
};

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

			const contentBlock = findContentBlock( block.innerBlocks );

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
				case 'woocommerce/product-collection':
					const { getTaxonomy } = select( 'core' );
					const { getEntityRecords } = select( 'core' );

					const query = contentBlock.attributes.query || {};
					const postType = query?.postType || 'post';

					// Remove falsey values from query parameters.
					const cleanQuery = Object.fromEntries(
						Object.entries( {
							...query,
							per_page: query.perPage || 10,
							// eslint-disable-next-line no-unused-vars
						} ).filter( ( [ _, value ] ) => {
							if ( Array.isArray( value ) ) {
								return value.length > 0;
							}
							return (
								value !== '' &&
								value !== null &&
								value !== undefined
							);
						} )
					);

					// Handle taxonomy queries.
					const taxQuery = query.taxQuery
						? Object.fromEntries(
								Object.entries( query.taxQuery ).map(
									( [ taxonomy, terms ] ) => {
										const taxonomyObj =
											getTaxonomy( taxonomy );
										return [
											taxonomyObj?.rest_base || taxonomy,
											terms,
										];
									}
								)
						  )
						: {};

					const records = getEntityRecords( 'postType', postType, {
						...cleanQuery,
						...taxQuery,
						_fields: [ 'id' ],
					} );

					count = records?.length || 0;
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
							label: __( 'Back to beginning/end', 'carousel' ),
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

	const styleInspectorControls = 'gallery' === attributes.type && (
		<InspectorControls group="dimensions">
			<div className="wpcomsp-carousel-track-height-input">
				<TextControl
					label={ __( 'Track height', 'carousel' ) }
					onChange={ ( v ) =>
						setAttributes( { trackHeight: Number( v ) } )
					}
					type="number"
					value={ trackHeight }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={ __( 'Unit', 'carousel' ) }
					onChange={ ( v ) =>
						setAttributes( { trackHeightUnit: v } )
					}
					options={ [
						{ value: 'px', label: 'px' },
						{ value: 'em', label: 'em' },
						{ value: 'rem', label: 'rem' },
						{ value: 'vw', label: 'vw' },
						{ value: 'vh', label: 'vh' },
					] }
					value={ trackHeightUnit }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</div>
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
