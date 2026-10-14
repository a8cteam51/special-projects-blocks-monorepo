/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * The block renders on the server (render.php). Saving the inner blocks keeps
 * the hotspots in the post content.
 *
 * @return {Element} The hotspots' content.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
