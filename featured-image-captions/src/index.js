// WordPress dependencies.
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

import './index.css';

/**
 * Extends the settings of the 'core/post-featured-image' block by adding
 * additional attributes for caption functionality.
 *
 * @param {Object} settings - The current settings of the block.
 * @param {string} name     - The name of the block.
 * @return {Object} The extended settings of the block.
 */
function extendFeaturedImage( settings, name ) {
	if ( 'core/post-featured-image' === name ) {
		return Object.assign( {}, settings, {
			attributes: Object.assign( {}, settings.attributes, {
				isCaptionEnabled: { type: 'boolean', default: false },
				caption: { type: 'string', default: '' },
			} ),
		} );
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'team51-featured-image-captions/attributes',
	extendFeaturedImage
);

/**
 * Higher-order component that adds a toolbar button to the 'core/post-featured-image' block
 * to toggle the caption functionality.
 *
 * @param {Function} BlockEdit - The original block edit component.
 * @return {Function} The enhanced block edit component.
 */
const withToolbarFeaturedImage = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// If current block is not allowed
		if ( 'core/post-featured-image' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;
		const { isCaptionEnabled } = attributes;

		const icon = () => {
			return (
				<svg
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					aria-hidden="true"
					focusable="false"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M6 5.5h12a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5ZM4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm4 10h2v-1.5H8V16Zm5 0h-2v-1.5h2V16Zm1 0h2v-1.5h-2V16Z"
					></path>
				</svg>
			);
		};

		return (
			<div>
				<BlockControls group="block">
					<ToolbarGroup>
						<ToolbarButton
							icon={ icon }
							label={
								isCaptionEnabled
									? __(
											'Remove Caption',
											'featured-image-captions'
									  )
									: __(
											'Add Caption',
											'featured-image-captions'
									  )
							}
							isActive={ isCaptionEnabled }
							onClick={ () => {
								setAttributes( {
									isCaptionEnabled: ! isCaptionEnabled,
								} );
							} }
						/>
					</ToolbarGroup>
				</BlockControls>
				<BlockEdit { ...props } />
			</div>
		);
	};
}, 'withCaptionFeaturedImage' );

addFilter(
	'editor.BlockEdit',
	'featured-image-captions/toolbar',
	withToolbarFeaturedImage
);

/**
 * Higher-order component that adds a caption input field to the 'core/post-featured-image' block
 * if the caption functionality is enabled.
 *
 * @param {Function} BlockListBlock - The original block list block component.
 * @return {Function} The enhanced block list block component.
 */
const withCaptionFeaturedImage = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			// If current block is not allowed
			if ( 'core/post-featured-image' !== props.name ) {
				return <BlockListBlock { ...props } />;
			}

			const { attributes, setAttributes } = props;
			const { isCaptionEnabled, caption } = attributes;

			if ( ! isCaptionEnabled ) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<div>
					<BlockListBlock { ...props } />
					<RichText
						tagName="figcaption"
						identifier="caption"
						label={ __( 'Caption', 'featured-image-captions' ) }
						value={ caption }
						onChange={ ( value ) =>
							setAttributes( { caption: value } )
						}
						inlineToolbar
						placeholder={ __(
							'Add caption (Leave blank to use image caption)',
							'featured-image-captions'
						) }
					/>
				</div>
			);
		};
	},
	'withCaptionFeaturedImage'
);

addFilter(
	'editor.BlockListBlock',
	'featured-image-captions/caption',
	withCaptionFeaturedImage
);
