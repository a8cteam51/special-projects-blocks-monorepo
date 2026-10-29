/**
 * Helpers for the core/image blocks inside a Photo Carousel.
 */
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export const CAROUSEL = 'newspack/photo-carousel';

/**
 * @param {string} clientId A block's client ID.
 *
 * @return {boolean} Whether the block sits directly inside a Photo Carousel.
 */
export function useIsCarouselImage( clientId ) {
	return useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlockName } =
				select( blockEditorStore );
			const parent = getBlockRootClientId( clientId );

			return !! parent && CAROUSEL === getBlockName( parent );
		},
		[ clientId ]
	);
}

/**
 * The attachment's Media Library caption as plain text. core-data flattens it
 * to a string once the record is resolved, but hands over the REST
 * { raw, rendered } object before then.
 *
 * @param {Object|undefined} record The attachment record.
 *
 * @return {string} The caption, or an empty string.
 */
export function attachmentCaption( record ) {
	const caption = record?.caption;
	const raw = typeof caption === 'string' ? caption : ( caption?.raw ?? '' );

	return raw.replace( /<[^>]*>/g, '' ).trim();
}
