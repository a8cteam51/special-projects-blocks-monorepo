import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Keep in sync with wpcomsp_featured_video_supported_blocks().
const SUPPORTED_BLOCKS = [ 'core/post-featured-image', 'core/cover' ];

addFilter(
	'blocks.registerBlockType',
	'wpcomsp-featured-video/show-featured-video-attribute',
	( settings, name ) => {
		if ( ! SUPPORTED_BLOCKS.includes( name ) ) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				showFeaturedVideo: { type: 'boolean', default: true },
			},
		};
	}
);

const withShowFeaturedVideoControl = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		// A Cover only shows the featured video when it uses the featured image.
		if (
			! SUPPORTED_BLOCKS.includes( name ) ||
			( 'core/cover' === name && ! attributes.useFeaturedImage )
		) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Featured video', 'featured-video' ) }
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Show featured video',
								'featured-video'
							) }
							help={
								'core/cover' === name
									? __(
											'When the post has a featured video from the Media Library or a video file URL, play it as the background instead of the featured image.',
											'featured-video'
									  )
									: __(
											'When the post has a featured video, show it instead of the featured image.',
											'featured-video'
									  )
							}
							checked={ false !== attributes.showFeaturedVideo }
							onChange={ ( value ) =>
								setAttributes( { showFeaturedVideo: value } )
							}
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	},
	'withShowFeaturedVideoControl'
);

addFilter(
	'editor.BlockEdit',
	'wpcomsp-featured-video/show-featured-video-control',
	withShowFeaturedVideoControl
);
