/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * The block renders on the server (render.php). Saving the inner blocks keeps
 * the card's content in the post content.
 *
 * @return {Element} The card's content.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
