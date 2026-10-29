/**
 * A Photo Credit panel in the sidebar of each image inside a Photo Carousel.
 * It edits Newspack's media credit on the attachment, so the credit follows
 * the image everywhere; attachment-save.js saves it with the post.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import { useIsCarouselImage } from '../editor/carousel-image';
import { CREDIT_META } from './slide-credit';

function CreditFields( { meta, onChange } ) {
	const field = ( key ) => ( {
		__next40pxDefaultSize: true,
		__nextHasNoMarginBottom: true,
		value: meta[ key ] ?? '',
		onChange: ( value ) => onChange( key, value ),
	} );

	return (
		<>
			<TextControl
				{ ...field( CREDIT_META.credit ) }
				label={ __( 'Credit', 'newspack-photo-carousel' ) }
				help={ __(
					'Stored on the image, so it follows it everywhere. Saved when you save the post.',
					'newspack-photo-carousel'
				) }
			/>
			<TextControl
				{ ...field( CREDIT_META.url ) }
				type="url"
				label={ __( 'Credit URL', 'newspack-photo-carousel' ) }
			/>
			<TextControl
				{ ...field( CREDIT_META.organization ) }
				label={ __( 'Organization', 'newspack-photo-carousel' ) }
			/>
		</>
	);
}

function ImageCredit( { BlockEdit, ...props } ) {
	const { clientId, attributes, isSelected } = props;
	const inCarousel = useIsCarouselImage( clientId );
	const imageId = attributes.id;
	const show = inCarousel && isSelected && !! attributes.url;

	// editedRecord, not record: a field bound to the saved value never shows
	// what was just typed.
	const { editedRecord, edit } = useEntityRecord(
		'postType',
		'attachment',
		imageId,
		{ enabled: show && !! imageId }
	);

	// An Author cannot edit another user's upload. undefined while resolving.
	const canEdit = useSelect(
		( select ) =>
			show && imageId
				? select( coreStore ).canUser( 'update', {
						kind: 'postType',
						name: 'attachment',
						id: imageId,
					} )
				: undefined,
		[ show, imageId ]
	);

	let content = (
		<CreditFields
			meta={ editedRecord?.meta ?? {} }
			onChange={ ( key, value ) => edit( { meta: { [ key ]: value } } ) }
		/>
	);
	if ( ! imageId ) {
		content = (
			<p>
				{ __(
					'Choose an image from the Media Library to credit it.',
					'newspack-photo-carousel'
				) }
			</p>
		);
	} else if ( false === canEdit ) {
		content = (
			<p>
				{ __(
					'Only the image’s uploader or an editor can change its credit.',
					'newspack-photo-carousel'
				) }
			</p>
		);
	}

	return (
		<>
			<BlockEdit { ...props } />
			{ show && (
				<InspectorControls group="content">
					<PanelBody
						title={ __(
							'Photo Credit',
							'newspack-photo-carousel'
						) }
					>
						{ content }
					</PanelBody>
				</InspectorControls>
			) }
		</>
	);
}

const withImageCredit = createHigherOrderComponent(
	( BlockEdit ) => ( props ) =>
		'core/image' === props.name ? (
			<ImageCredit BlockEdit={ BlockEdit } { ...props } />
		) : (
			<BlockEdit { ...props } />
		),
	'withImageCredit'
);

/**
 * Registers the panel.
 *
 * @return {void}
 */
export function initImageCredit() {
	addFilter(
		'editor.BlockEdit',
		'newspack-photo-carousel/image-credit',
		withImageCredit
	);
}
