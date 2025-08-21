/**
 * WordPress dependencies
 *
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls, store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from "@wordpress/element";
import {
	SelectControl,
	PanelBody,
} from '@wordpress/components';

import clsx from 'clsx';

import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {

	const [ selectedVideo, setSelectedVideo ] = useState( attributes.guid );

	const changeVideo = ( value ) => {
		setAttributes( { guid: '', src: '' } );
		setSelectedVideo( value );
	};

	const { blocks, blockAttributes } = useSelect(
		( select ) => {
			const { getBlocks, getBlockAttributes } = select( blockEditorStore );
			const { getMedia } = select( 'core' );
			const blocks = getBlocks().filter( ( block ) => block.name === 'videopress/video' );
			const arrayPosition = blocks.findIndex( ( block ) => block.attributes.guid === selectedVideo );
			const index = arrayPosition === -1 ? 0 : arrayPosition;
			
			// If the block has no title, we need to get the media object to get the generated slug
			const updatedBlocks = blocks.map( ( block ) => {
				if ( block.attributes?.title && block.attributes.src ) {
					return block;
				}

				const mediaObject = getMedia( block.attributes?.id );

				// Handle case where media object is not loaded yet
				if ( ! mediaObject ) {
					return block;
				}

				return {
					...block,
					attributes: {
						...block.attributes,
						...( ! block.attributes?.title && { title: mediaObject.generated_slug } ),
						...( ! block.attributes?.src && { src: mediaObject.source_url } ),
					},
				};
			} );

			const blockAttributes = updatedBlocks ? updatedBlocks[ index ]?.attributes : null;

			return { 
				blocks: updatedBlocks,
				blockAttributes: blockAttributes,
			};
		}, [ attributes, selectedVideo ]
	);

	useEffect( 
		() => {
			if ( ! blocks || ! blockAttributes ) {
				return;
			}

			if ( blockAttributes?.guid && attributes.guid !== blockAttributes.guid ) {
				setAttributes( { guid: blockAttributes.guid } );
			}
			if ( blockAttributes?.src && attributes.src !== blockAttributes.src ) {
				setAttributes( { src: blockAttributes.src } );
			}
			if ( attributes?.allowDownload !== blockAttributes?.allowDownload ) {
				setAttributes( { allowDownload: blockAttributes.allowDownload } );
			}
			if ( attributes.isPrivate !== blockAttributes?.isPrivate ) {
				setAttributes( { isPrivate: blockAttributes.isPrivate } );
			}
		}, [ blocks, blockAttributes, attributes, setAttributes ]
	);

	if ( blocks.length === 0 ) {
		return (
			<div { ...useBlockProps() }>
				<p>{ __( 'No VideoPress block found', 'videopress-download' ) }</p>
			</div>
		);
	}

	const options = blocks.filter(
		( block ) => block?.attributes?.guid
	).map( ( block ) => {
		return { value: block.attributes.guid, label: block.attributes?.title || block.attributes?.guid };
	} );

	const alignmentClass = clsx( attributes?.style?.typography?.textAlign && `has-text-align-${ attributes?.style?.typography?.textAlign }` );

	return (
		<>
		{ options.length > 1 && (
			<InspectorControls>
				<PanelBody title={ __( 'Select a VideoPress block', 'videopress-download' ) }>
					<SelectControl
						label={ __( 'Select Video', 'videopress-download' ) }
						value={ selectedVideo }
						options={ options }
						onChange={ changeVideo }
					/>
				</PanelBody>
			</InspectorControls>
		) }

		{ attributes?.allowDownload === false ? (
			<div { ...useBlockProps() }>
				<p>{ __( 'Download is disabled for this video', 'videopress-download' ) }</p>
			</div>
		) : (
			<a { ...useBlockProps({
				className: alignmentClass,
			}) } >
				<RichText
					tagName="span" 
					value={ attributes.text } 
					allowedFormats={ [] } 
					onChange={ ( value ) => setAttributes( { text: value } ) } 
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="icons"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
				>
					<path d="M21 19H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2M12 2a1 1 0 0 0-1 1v10.59l-3.29-3.3a1 1 0 0 0-1.42 1.42l5 5a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0-1.42-1.42L13 13.59V3a1 1 0 0 0-1-1"></path>
				</svg>
			</a>
		)
	}	
	</>
	);
}
