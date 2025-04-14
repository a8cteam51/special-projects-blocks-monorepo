// WordPress dependencies.
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import CarouselPlaceHolder from './placeholder';
import {
	addBaseHeight,
	getAttributes,
	prevNextButtons,
	paginationButtons,
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
	const { overflow, pagination, prevNext } = attributes;

	const carouselRef = useRef( null );

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
					count = innerBlock.innerBlocks?.length || 0;
					break;
				default:
					count = innerBlock.attributes.query?.perPage || 0;
			}

			return { hasInnerBlocks: true, itemCount: count };
		},
		[ clientId ]
	);

	useEffect( () => {
		setAttributes( { itemCount: Number( itemCount ) } );
	}, [ itemCount, setAttributes ] );

	useEffect( () => {
		const carousel = carouselRef.current;
		if ( ! carousel ) {
			return;
		}

		const cleanupBaseHeight = addBaseHeight( carousel );

		const resizeObserver = new ResizeObserver( () => {
			addBaseHeight( carousel );
		} );

		resizeObserver.observe( carousel );

		return () => {
			cleanupBaseHeight();
			resizeObserver.disconnect();
		};
	}, [ carouselRef ] );

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
				<ToggleControl
					checked={ prevNext }
					label={ __( 'Previous/Next buttons', 'carousel' ) }
					onChange={ ( v ) => setAttributes( { prevNext: v } ) }
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					checked={ pagination }
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
				/>
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
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
					<div { ...innerBlockProps } ref={ carouselRef }>
						{ prevNext && prevNextButtons() }
						{ pagination && paginationButtons( itemCount ) }
						{ children }
					</div>
				</>
			) }
		</>
	);
}
