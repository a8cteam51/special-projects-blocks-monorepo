<?php
/**
 * Plugin Name:       Featured Image Captions
 * Description:       Adds caption support to the core/post-featured-image block.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           1.0.0
 * Author:            Automattic Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/featured-image-captions/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       featured-image-captions
 *
 * @package wpcomsp
 */

defined( 'ABSPATH' ) || exit;

// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	$self_update_file = __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	if ( file_exists( $self_update_file ) ) {
		require $self_update_file;
		WPCOMSP_Blocks_Self_Update::get_instance()->hooks();
	}
}

/**
 * Enqueues the editor script for the Featured Image caption extension.
 *
 * @return void
 */
function featured_image_captions_editor_assets(): void {
	$asset_file = __DIR__ . '/build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset_meta = require $asset_file;

	wp_enqueue_script(
		'featured-image-captions-editor',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_meta['dependencies'],
		$asset_meta['version'],
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'featured_image_captions_editor_assets' );

/**
 * Enqueues the frontend styles for the Featured Image caption extension.
 *
 * @return void
 */
function featured_image_captions_frontend_styles(): void {
	$asset_file = __DIR__ . '/build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset_meta = require $asset_file;

	wp_enqueue_style(
		'featured-image-captions',
		plugins_url( 'build/index.css', __FILE__ ),
		array(),
		$asset_meta['version']
	);
}
add_action( 'wp_enqueue_scripts', 'featured_image_captions_frontend_styles' );

/**
 * Appends a caption to the Featured Image block output.
 *
 * @param string               $block_content  The block content.
 * @param array<string, mixed> $block          The block data.
 * @param WP_Block             $block_instance The block instance.
 *
 * @return string
 */
function featured_image_captions_render_caption( string $block_content, array $block, WP_Block $block_instance ): string {
	if ( empty( $block['attrs']['isCaptionEnabled'] ) ) {
		return $block_content;
	}

	$figcaption = '';
	if ( ! empty( $block['attrs']['caption'] ) && is_string( $block['attrs']['caption'] ) ) {
		$figcaption = $block['attrs']['caption'];
	} else {
		$post_id    = isset( $block_instance->context['postId'] ) ? (int) $block_instance->context['postId'] : null;
		$figcaption = get_the_post_thumbnail_caption( $post_id );
	}

	if ( is_string( $figcaption ) && '' !== $figcaption ) {
		$block_content = str_replace(
			'</figure>',
			'<figcaption class="wp-element-caption">' . wp_kses_post( $figcaption ) . '</figcaption></figure>',
			$block_content
		);
	}

	return $block_content;
}
add_filter( 'render_block_core/post-featured-image', 'featured_image_captions_render_caption', 10, 3 );

/**
 * Setup auto-updates for this plugin from our monorepo.
 *
 * @param array $blocks Array of plugin slugs.
 *
 * @return array
 */
add_filter(
	'wpcomsp_installed_blocks',
	function ( $blocks ) {
		$blocks[] = 'featured-image-captions';
		return $blocks;
	}
);
