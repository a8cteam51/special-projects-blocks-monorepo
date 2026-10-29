/**
 * Editor view: a live carousel preview (arrows, rail) over the real
 * InnerBlocks image list, so reorder/replace stay native-editable. Captions
 * and credits are edited in each image's own sidebar.
 */
import { __, sprintf } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { useEffect, useRef, useState } from '@wordpress/element';
import {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useEntityRecord } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';

import { attachmentCaption } from '../editor/carousel-image';
import { isCaptionEmpty } from '../editor/caption-text';
import { getSlideCredit, hasCreditProvider } from '../editor/credit-provider';
import SettingsPanel from './settings-panel';

const BLOCK = 'wp-block-newspack-photo-carousel';

const ALLOWED_BLOCKS = [ 'core/image' ];

// Deliberate cap on carousel size: editor.scss compiles one :nth-of-type()
// reveal rule per slide and must share this ceiling.
const MAX_IMAGES = 50;

// Focusing a preview button would select the carousel and drop the selected
// image before goTo() runs, so keep focus where it is.
const keepSelection = ( event ) => event.preventDefault();

function mediaToBlocks( media ) {
	return media.map( ( item ) =>
		createBlock( 'core/image', {
			id: item.id,
			url: item.url,
			alt: item.alt,
			linkDestination: 'none',
		} )
	);
}

// Prev is mirrored via CSS.
function ArrowButton( { className, label, onClick } ) {
	return (
		<button
			type="button"
			className={ className }
			aria-label={ label }
			onMouseDown={ keepSelection }
			onClick={ onClick }
		>
			<svg
				className={ `${ BLOCK }__chevron` }
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
				focusable="false"
			>
				<path
					d="m9 6 6 6-6 6"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
			</svg>
		</button>
	);
}

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	isSelected,
} ) {
	const { aspectRatio, imageCrop, showCaptions, showCredits } = attributes;
	const [ activeIndex, setActiveIndex ] = useState( 0 );

	const { replaceInnerBlocks, selectBlock } =
		useDispatch( 'core/block-editor' );
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);
	const imageCount = innerBlocks.length;
	const hasImages = imageCount > 0;
	const activeImage = innerBlocks[ activeIndex ];
	const activeId = activeImage?.attributes.id;

	// The front end falls back to the Media Library caption and prints the
	// attachment's credit; the preview reads the same record.
	const { editedRecord: activeRecord } = useEntityRecord(
		'postType',
		'attachment',
		activeId,
		{ enabled: !! activeId }
	);
	const ownCaption = activeImage?.attributes.caption;
	const hasOwnCaption = ! isCaptionEmpty( ownCaption );
	const fallbackCaption = hasOwnCaption
		? ''
		: attachmentCaption( activeRecord );
	const hasCaption = showCaptions && ( hasOwnCaption || !! fallbackCaption );
	const hasCredit = showCredits && hasCreditProvider();

	// Position of the selected block among this carousel's images, or -1 when
	// the carousel itself or something else is selected.
	const selectedIndex = useSelect(
		( select ) => {
			const { getSelectedBlockClientId, getBlockOrder } =
				select( 'core/block-editor' );

			return getBlockOrder( clientId ).indexOf(
				getSelectedBlockClientId()
			);
		},
		[ clientId ]
	);

	// Keep activeIndex valid as images are added/removed.
	useEffect( () => {
		if ( activeIndex >= imageCount ) {
			setActiveIndex( Math.max( 0, imageCount - 1 ) );
		}
	}, [ activeIndex, imageCount ] );

	// Selecting an image (List View, breadcrumb, preview) shows its slide.
	useEffect( () => {
		if ( selectedIndex >= 0 ) {
			setActiveIndex( selectedIndex );
		}
	}, [ selectedIndex ] );

	const blockProps = useBlockProps( {
		style: { '--newspack-photo-carousel-aspect-ratio': aspectRatio },
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: `${ BLOCK }__slides` },
		{ allowedBlocks: ALLOWED_BLOCKS, renderAppender: false }
	);

	// Pickers fire onSelect repeatedly per operation, each time with the
	// whole cumulative list: rebuild from a baseline instead of appending.
	const replaceImages = ( baseline, media ) => {
		const items = ( Array.isArray( media ) ? media : [ media ] ).filter(
			Boolean
		);
		replaceInnerBlocks(
			clientId,
			[ ...baseline, ...mediaToBlocks( items ) ].slice( 0, MAX_IMAGES )
		);
	};

	// Baseline for the toolbar's append, taken when the picker opens.
	const appendBaseline = useRef( [] );

	// Preview pick: a selected image follows the slide, a selected carousel
	// stays selected, anything else gives way to the carousel.
	const goTo = ( index ) => {
		setActiveIndex( index );

		if ( selectedIndex >= 0 && innerBlocks[ index ] ) {
			selectBlock( innerBlocks[ index ].clientId );
		} else if ( ! isSelected ) {
			selectBlock( clientId );
		}
	};

	const step = ( delta ) => {
		goTo( ( activeIndex + delta + imageCount ) % imageCount );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							multiple
							onSelect={ ( media ) =>
								replaceImages( appendBaseline.current, media )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<ToolbarButton
									icon="insert"
									label={ __(
										'Add images',
										'newspack-photo-carousel'
									) }
									disabled={ imageCount >= MAX_IMAGES }
									onClick={ () => {
										appendBaseline.current = innerBlocks;
										open();
									} }
								/>
							) }
						/>
					</MediaUploadCheck>
				</ToolbarGroup>
			</BlockControls>

			<SettingsPanel
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<div { ...blockProps }>
				{ hasImages && (
					<ArrowButton
						className={ `${ BLOCK }__prev` }
						label={ __(
							'Previous slide',
							'newspack-photo-carousel'
						) }
						onClick={ () => step( -1 ) }
					/>
				) }

				{ /* Mounted even when empty: canInsertBlockType() rejects
				     inserts into a parent with no list settings, and those
				     are registered by InnerBlocks on mount. */ }
				<div
					{ ...innerBlocksProps }
					className={ `${ innerBlocksProps.className }${ hasImages ? '' : ' is-empty' }` }
					data-active-index={ Math.min(
						activeIndex,
						MAX_IMAGES - 1
					) }
					data-image-crop={ imageCrop ? '1' : '0' }
				/>

				{ hasImages ? (
					<>
						<ArrowButton
							className={ `${ BLOCK }__next` }
							label={ __(
								'Next slide',
								'newspack-photo-carousel'
							) }
							onClick={ () => step( 1 ) }
						/>

						<ul className={ `${ BLOCK }__rail` }>
							{ innerBlocks.map( ( block, index ) => (
								<li key={ block.clientId }>
									<button
										type="button"
										className={
											`${ BLOCK }__goto` +
											( index === activeIndex
												? ' is-active'
												: '' )
										}
										aria-label={ sprintf(
											/* translators: 1: slide number, 2: total number of slides. */
											__(
												'Preview slide %1$d of %2$d',
												'newspack-photo-carousel'
											),
											index + 1,
											imageCount
										) }
										onMouseDown={ keepSelection }
										onClick={ () => goTo( index ) }
									>
										<img
											className={ `${ BLOCK }__goto-image` }
											src={ block.attributes.url }
											alt={ block.attributes.alt }
										/>
									</button>
								</li>
							) ) }
						</ul>

						<div className={ `${ BLOCK }__captions` }>
							<div className={ `${ BLOCK }__caption is-active` }>
								{ hasCaption && (
									<span
										className={ `${ BLOCK }__caption-text` }
									>
										{ hasOwnCaption ? (
											<RichText.Content
												value={ ownCaption }
											/>
										) : (
											fallbackCaption
										) }
									</span>
								) }
								{ hasCredit &&
									getSlideCredit(
										activeRecord,
										`${ BLOCK }__caption-credit`
									) }
							</div>
						</div>
					</>
				) : (
					<div className={ `${ BLOCK }__placeholder` }>
						<MediaPlaceholder
							icon="format-gallery"
							labels={ {
								title: __(
									'Photo Carousel',
									'newspack-photo-carousel'
								),
								instructions: __(
									'Upload or select images to add to the carousel.',
									'newspack-photo-carousel'
								),
							} }
							onSelect={ ( media ) => replaceImages( [], media ) }
							accept="image/*"
							allowedTypes={ [ 'image' ] }
							multiple
						/>
					</div>
				) }
			</div>
		</>
	);
}
