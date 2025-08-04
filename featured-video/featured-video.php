<?php
/**
 * Plugin Name: Featured Video
 * Description: Add the ability to use Featured Video inplace of Featured Image.
 * Version: 0.1.2
 * Author: WordPress Special Projects Team
 * Author URI: https://wpspecialprojects.wordpress.com/
 * Update URI: https://opsoasis.wpspecialprojects.com/featured-video/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: featured-video
 * Requires at least: 6.6
 * Tested up to: 6.8.2
 * Requires PHP: 7.4
 * Network: false
 *
 * @package Wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	WPCOMSP_Blocks_Self_Update::get_instance()->hooks();
}

// If no other WPCOMSP_HTML_Tag_Processor class exists, add it.
if ( ! class_exists( 'WPCOMSP_HTML_Tag_Processor' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-html-tag-processor.php';
}

/**
 * Enqueues the editor script for the block editor.
 *
 * @return void
 */
function wpcomsp_featured_video_enqueue_editor_assets() {

	if ( ! is_readable( __DIR__ . '/build/editor/editor.asset.php' ) || ! is_readable( __DIR__ . '/build/editor/editor.js' ) ) {
		return;
	}

	$asset_meta = include __DIR__ . '/build/editor/editor.asset.php';

	wp_enqueue_script(
		'featured-video-editor-script',
		plugin_dir_url( __FILE__ ) . 'build/editor/editor.js',
		$asset_meta['dependencies'] ?? array(),
		$asset_meta['version'] ?? get_plugin_data( __FILE__ )['Version'],
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'wpcomsp_featured_video_enqueue_editor_assets' );


/**
 * Register the custom post meta.
 *
 * @return void
 */
function wpcomsp_featured_video_register_post_meta() {

	register_post_meta(
		'post',
		'_wpcomsp_featured_video_id',
		array(
			'sanitize_callback' => 'absint',
			'show_in_rest'      => true,
			'type'              => 'number',
			'single'            => true,
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', 'wpcomsp_featured_video_register_post_meta' );

/**
 * Render the featured video in place of the post featured image.
 *
 * @param string   $block_content The block content.
 * @param array    $block         The block attributes.
 * @param WP_Block $wp_block      The WP_Block instance.
 *
 * @return string The updated block content with the featured video.
 */
function wpcomsp_featured_video_render_post_featured_image( $block_content, $block, $wp_block ) {

	if ( empty( $wp_block->context['postId'] ) ) {
		return $block_content;
	}

	$featured_video_id = get_post_meta( $wp_block->context['postId'], '_wpcomsp_featured_video_id', true );

	if ( ! $featured_video_id ) {
		return $block_content;
	}

	$featured_video_url = wp_get_attachment_url( $featured_video_id );
	if ( ! $featured_video_url ) {
		return $block_content;
	}

	$p = new WPCOMSP_HTML_Tag_Processor( $block_content );
	if ( ! $p->next_tag( array( 'class_name' => 'wp-post-image' ) ) ) {
		return $block_content;
	}

	$p->replace_tag(
		sprintf(
			'<video class="attachment-post-thumbnail size-post-thumbnail wp-post-image wp-post-video intrinsic-ignore" autoplay muted loop playsinline src="%s" style="width: 100%%" preload="metadata"><p>%s</p></video>',
			esc_url( $featured_video_url ),
			esc_html__( 'Your browser does not support the video tag.', 'featured-video' )
		)
	);

	return $p->get_updated_html();
}
add_filter( 'render_block_core/post-featured-image', 'wpcomsp_featured_video_render_post_featured_image', 10, 3 );
