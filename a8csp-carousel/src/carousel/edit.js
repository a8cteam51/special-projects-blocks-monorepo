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
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import CarouselPlaceHolder from './placeholder';
import { getHTMLAttributes } from './common';
import './editor.css';

const TRACK_CLASS = 'wp-block-a8csp-carousel-track';

// Wrapper blocks whose child template block carries the track class.
const CONTENT_BLOCKS = [ 'core/query', 'woocommerce/product-collection' ];

/**
 * Default item count resolvers keyed by block name.
 *
 * Each resolver receives the block's `attributes` object and returns a number.
 * Developers can add entries for third-party blocks via the
 * `a8csp.carousel.itemCountResolvers` filter.
 */
const DEFAULT_ITEM_COUNT_RESOLVERS = {
	'core/query': ( attrs ) => Number( attrs.query?.perPage || 0 ),
	'woocommerce/product-collection': ( attrs ) =>
		Number( attrs.query?.perPage || 0 ),
};

/**
 * Searches for the slides/content container block.
 *
 * Matches any block with the track className first, then falls back
 * to known wrapper block types whose descendants carry the track class.
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
		if ( block.attributes.className?.includes( TRACK_CLASS ) ) {
			return block;
		}

		if ( CONTENT_BLOCKS.includes( block.name ) ) {
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

			const resolvers = applyFilters(
				'a8csp.carousel.itemCountResolvers',
				DEFAULT_ITEM_COUNT_RESOLVERS
			);

			const resolver = resolvers[ contentBlock.name ];
			const count = resolver
				? resolver( contentBlock.attributes )
				: contentBlock.innerBlocks?.length || 0;

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
			createBlock( 'a8csp/carousel-nav', {}, [] ),
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
			<PanelBody title={ __( 'Carousel Settings', 'a8csp-carousel' ) }>
				<TextControl
					help={ __(
						'Briefly describe the carousel for screen reader users.',
						'a8csp-carousel'
					) }
					label={ __( 'Title', 'a8csp-carousel' ) }
					onChange={ ( v ) => setAttributes( { title: v } ) }
					value={ title }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={ __( 'Overflow', 'a8csp-carousel' ) }
					onChange={ ( v ) => setAttributes( { overflow: v } ) }
					options={ [
						{
							value: 'hidden',
							label: __( 'Hidden', 'a8csp-carousel' ),
						},
						{
							value: 'right',
							label: __( 'Right', 'a8csp-carousel' ),
						},
						{
							value: 'left',
							label: __( 'Left', 'a8csp-carousel' ),
						},
						{
							value: 'both',
							label: __( 'Left and right', 'a8csp-carousel' ),
						},
					] }
					value={ overflow }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<SelectControl
					label={ __( 'Animate', 'a8csp-carousel' ) }
					onChange={ ( v ) => setAttributes( { animate: v } ) }
					options={ [
						{
							value: 'one',
							label: __(
								'One slide at a time',
								'a8csp-carousel'
							),
						},
						{
							value: 'all-visible',
							label: __( 'All visible slides', 'a8csp-carousel' ),
						},
					] }
					value={ animate }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<SelectControl
					label={ __( 'At end', 'a8csp-carousel' ) }
					onChange={ ( v ) => setAttributes( { animateEnd: v } ) }
					options={ [
						{
							value: 'stop',
							label: __( 'Stop', 'a8csp-carousel' ),
						},
						{
							value: 'jump',
							label: __( 'Jump to other end', 'a8csp-carousel' ),
						},
						{
							value: 'infinite',
							label: __( 'Infinite loop', 'a8csp-carousel' ),
						},
					] }
					value={ animateEnd }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<TextControl
					label={ __(
						'Animation speed (in seconds)',
						'a8csp-carousel'
					) }
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
			<div className="a8csp-carousel-track-height-input">
				<TextControl
					label={ __( 'Track height', 'a8csp-carousel' ) }
					onChange={ ( v ) =>
						setAttributes( { trackHeight: Number( v ) } )
					}
					type="number"
					value={ trackHeight }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={ __( 'Unit', 'a8csp-carousel' ) }
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
