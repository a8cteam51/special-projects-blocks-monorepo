/**
 * A Photo Caption panel in the sidebar of each image inside a Photo Carousel.
 * It writes the image's own caption, so it stays in sync with the canvas.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEntityRecord } from '@wordpress/core-data';
import { addFilter } from '@wordpress/hooks';

import CaptionControl from './caption-control';
import { textToCaption } from './caption-text';
import { attachmentCaption, useIsCarouselImage } from './carousel-image';

function ImageCaption( { BlockEdit, ...props } ) {
	const { clientId, attributes, setAttributes, isSelected } = props;
	const inCarousel = useIsCarouselImage( clientId );

	// Not for several selected images (it would edit only the first) or an
	// empty placeholder.
	const show = inCarousel && isSelected && !! attributes.url;

	// An empty caption falls back to this one on the front end.
	const { editedRecord } = useEntityRecord(
		'postType',
		'attachment',
		attributes.id,
		{ enabled: show && !! attributes.id }
	);
	const fallback = show ? attachmentCaption( editedRecord ) : '';

	return (
		<>
			<BlockEdit { ...props } />
			{ show && (
				<InspectorControls group="content">
					<PanelBody
						title={ __(
							'Photo Caption',
							'newspack-photo-carousel'
						) }
					>
						<CaptionControl
							caption={ attributes.caption }
							placeholder={ fallback }
							isBound={
								!! attributes.metadata?.bindings?.caption
							}
							help={
								fallback
									? __(
											'Shown under this slide. Leave it empty to show the Media Library caption above.',
											'newspack-photo-carousel'
										)
									: __(
											'Shown under this slide only.',
											'newspack-photo-carousel'
										)
							}
							onChange={ ( text ) =>
								setAttributes( {
									caption: textToCaption( text ),
								} )
							}
						/>
					</PanelBody>
				</InspectorControls>
			) }
		</>
	);
}

const withImageCaption = createHigherOrderComponent(
	( BlockEdit ) => ( props ) =>
		'core/image' === props.name ? (
			<ImageCaption BlockEdit={ BlockEdit } { ...props } />
		) : (
			<BlockEdit { ...props } />
		),
	'withImageCaption'
);

addFilter(
	'editor.BlockEdit',
	'newspack-photo-carousel/image-caption',
	withImageCaption
);
