/* global ResizeObserver */

// WordPress dependencies.
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import CarouselPlaceHolder from './placeholder';
import {
	getAttributes,
	prevNextButtons,
	paginationButtons,
	setBaseHeight,
} from './common';
import './editor.css';

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
		block.attributes || {},
		block.innerBlocks?.map( createBlockWithInnerBlocks )
	);
};

export default function Edit( { attributes, clientId, name, setAttributes } ) {
	const {
		animate,
		animateEnd,
		animationSpeed,
		overflow,
		pagination,
		prevNext,
		prevNextPosition,
		title,
	} = attributes;

	const baseHeightRef = useRef( null );

	const { children, ...innerBlockProps } = useInnerBlocksProps(
		useBlockProps( getAttributes( attributes ) ),
		{
			renderAppender: false,
		}
	);

	const { hasInnerBlocks, itemCount } = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );

			if ( ! block?.innerBlocks?.length ) {
				return { hasInnerBlocks: false, itemCount: 0 };
			}

			const innerBlock = block.innerBlocks[ 0 ];
			let count = 0;

			switch ( innerBlock.name ) {
				case 'core/gallery':
				case 'core/group':
					count = innerBlock.innerBlocks?.length || 0;
					break;
				case 'core/query':
				case 'core/product-collection':
					// @TODO: Find a better way, this may not be reflective of displayed items.
					count = innerBlock.attributes.query?.perPage || 0;
					break;
				default:
					count = 0;
			}

			return { hasInnerBlocks: true, itemCount: count };
		},
		[ clientId ]
	);

	useEffect( () => {
		setAttributes( { itemCount: Number( itemCount ) } );
	}, [ itemCount, setAttributes ] );

	useEffect( () => {
		const baseHeightTracker = baseHeightRef.current;
		if ( ! baseHeightTracker ) {
			return;
		}

		const cleanupBaseHeight = setBaseHeight( baseHeightTracker );

		const resizeObserver = new ResizeObserver( () => {
			setBaseHeight( baseHeightTracker );
		} );

		resizeObserver.observe( baseHeightTracker );

		return () => {
			cleanupBaseHeight();
			resizeObserver.disconnect();
		};
	}, [ baseHeightRef ] );

	const { selectBlock, insertBlock } = useDispatch( blockEditorStore );

	const selectVariation = ( nextVariation ) => {
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
				/>
				<ToggleControl
					checked={ prevNext }
					label={ __( 'Previous/Next buttons', 'carousel' ) }
					onChange={ ( v ) => setAttributes( { prevNext: v } ) }
					__nextHasNoMarginBottom
				/>
				{ prevNext && (
					<div
						style={ { marginBottom: '24px', paddingLeft: '12px' } }
					>
						<SelectControl
							label={ __( 'Position', 'carousel' ) }
							onChange={ ( v ) =>
								setAttributes( { prevNextPosition: v } )
							}
							options={ [
								{
									value: 'sides',
									label: __( 'Sides', 'carousel' ),
								},
								{
									value: 'top',
									label: __( 'Top', 'carousel' ),
								},
								{
									value: 'top-right',
									label: __( 'Top right', 'carousel' ),
								},
								{
									value: 'left',
									label: __( 'Left', 'carousel' ),
								},
							] }
							value={ prevNextPosition }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</div>
				) }
				<ToggleControl
					checked={ pagination }
					disabled={ ! itemCount || 'infinite' === animateEnd }
					label={ __( 'Pagination buttons', 'carousel' ) }
					onChange={ ( v ) => setAttributes( { pagination: v } ) }
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
				/>
			</PanelBody>
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
					{ prevNext && prevNextButtons() }
					{ pagination && paginationButtons( itemCount ) }
					{ children }
					<div ref={ baseHeightRef }></div>
				</>
			) }
		</div>
	);
}
