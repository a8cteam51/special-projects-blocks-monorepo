/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import { useEntityBlockEditor, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { SandBox } from '@wordpress/components';
import { getAuthority } from '@wordpress/url';
import { View } from '@wordpress/primitives';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object} props Properties passed from the editor.
 *
 * @return {Element} Element to render.
 */
export default function Edit( props ) {
	const { context = {}, className } = props;
	const { postType, postId } = context;

	const [ blocks ] = useEntityBlockEditor( 'postType', postType, {
		id: postId,
	} );

	const blockProps = useBlockProps();

	let embedUrl = '';

	for ( const block of blocks ) {
		if ( block.name && block.name === 'core/embed' ) {
			if ( block.attributes?.url ) {
				embedUrl = block.attributes.url;
				break; // Stop the loop once the first embed URL is found
			}
		}
	}

	const { preview } = useSelect(
		( select ) => {
			const { getEmbedPreview, getThemeSupports } = select( coreStore );
			if ( ! embedUrl ) {
				return { fetching: false, cannotEmbed: false };
			}

			const embedPreview = getEmbedPreview( embedUrl );

			// The external oEmbed provider does not exist. We got no type info and no html.
			const badEmbedProvider =
				embedPreview?.html === false &&
				embedPreview?.type === undefined;

			const validPreview = !! embedPreview && ! badEmbedProvider;
			return {
				preview: validPreview ? embedPreview : undefined,
				themeSupportsResponsive:
					getThemeSupports()[ 'responsive-embeds' ],
			};
		},
		[ embedUrl ]
	);

	if ( ! preview ) {
		return null;
	}

	const { scripts, type } = preview;

	const html = preview.html;
	const embedSourceUrl = getAuthority( embedUrl );
	const iframeTitle = `Embedded content from ${ embedSourceUrl }`;

	const sandboxClassnames = clsx( type, 'wp-block-embed__wrapper' );

	return (
		<View { ...blockProps }>
			<figure
				className={ clsx( className, 'wp-block-embed', {
					'is-type-video': 'video' === type,
				} ) }
			>
				<div className="wp-block-embed__wrapper">
					<SandBox
						html={ html }
						scripts={ scripts }
						title={ iframeTitle }
						type={ type }
						className={ sandboxClassnames }
					/>
				</div>
			</figure>
		</View>
	);
}
