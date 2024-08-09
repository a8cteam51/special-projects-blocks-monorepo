<?php

/**
 * Plugin Name:       Client Side Extract Embed
 * Description:       Extracts an embed URL from post content and renders it
 *                    as an embed block. For use in query loop post templates
 *                    with region-based client side navigation enabled,
 *                    where one is unable to read from the post content directly.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            WordPress.com Special Projects Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       client-side-extract-embed
 *
 * @package CreateBlock
 */

/**
 * Renders the `core/embed` block on server.
 *
 * @since 5.0.0
 *
 * @param array $attributes The block attributes.
 * @param string $content The block content.
 * @param WP_Block $block The block object.
 *
 * @return string Returns the embed block content.
 */
function render_block_client_side_extract_embed( $attributes, $content, $block ) {
	$post_id       = $block->context['postId'];
	$post          = get_post( $post_id );
	$content       = $post->post_content;
	$parsed_blocks = parse_blocks( $content );
	$embed_url     = '';

	foreach ( $parsed_blocks as $block ) {
		if ( isset( $block['blockName'] ) && 'core/embed' === $block['blockName'] ) {
			if ( isset( $block['attrs']['url'] ) ) {
				$embed_url = $block['attrs']['url'];
				break; // Stop the loop once the first embed URL is found
			}
		}
	}

	if ( ! $embed_url ) {
		return ''; // Return empty if no embed URL found
	}

	// Create an embed block content as a string
	$youtube_block =
	'<!-- wp:embed {"url":"' . $embed_url . '","type":"video","providerNameSlug":"youtube","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
		<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio">
			<div class="wp-block-embed__wrapper">
				' . $embed_url . '
			</div>
	</figure>
	<!-- /wp:embed -->';

	$parsed = do_blocks( $youtube_block );

	global $wp_embed;
	$content = $wp_embed->autoembed( $parsed );

	return $content;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @return void
 */
function create_block_client_side_extract_embed_block_init() {
	register_block_type(
		__DIR__ . '/build',
		array(
			'render_callback' => 'render_block_client_side_extract_embed',
		)
	);
}
add_action( 'init', 'create_block_client_side_extract_embed_block_init' );
