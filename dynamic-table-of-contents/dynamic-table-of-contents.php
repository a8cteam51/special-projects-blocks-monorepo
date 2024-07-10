<?php
/**
 * Plugin Name:       Dynamic Table of Contents
 * Description:       Creates a table of contents that's dynamically (PHP) rendered.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           0.1.9
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis-develop.mystagingwebsite.com/dynamic-table-of-contents/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dynamic-table-of-contents
 *
 * @package           wpsp
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define the plugin folder name.


// If no other WPSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpsp-blocks-self-update.php';

	$wpsp_blocks_self_update = WPSP_Blocks_Self_Update::get_instance();
	$wpsp_blocks_self_update->hooks();
}

/**
 * Setup auto-updates for this plugin from our monorepo.
 * Done in an anonymous function for simplicity in making this a drop-in snippet.
 *
 * @param array $blocks Array of plugin files.
 *
 * @return array
 */
add_filter(
	'wpsp_installed_blocks',
	function ( $blocks ) {
		$plugin_data = get_plugin_data( __FILE__ );

		// Add the plugin slug here to enable autoupdates.
		$blocks[] = 'dynamic-table-of-contents';

		return $blocks;
	}
);

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wpsp_dynamic_table_of_contents_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'wpsp_dynamic_table_of_contents_block_init' );

/**
 * Filter the render block output of heading blocks.
 *
 * @param string $block_content The block content about to be rendered.
 * @param array  $block         The block object.
 *
 * @return string Block content.
 */
function wpsp_dynamic_table_of_contents_block_render( $block_content, $block ) {
	if ( 'core/heading' !== $block['blockName'] ) {
		return $block_content;
	}

	// Parse the block with the WP_HTML_Tag_Processor.
	$processor = new WP_HTML_Tag_Processor( $block_content );
	$processor->next_tag();

	// If the heading already has an ID, don't add one.
	if ( null !== $processor->get_attribute( 'ID' ) ) {
		return $block_content;
	}

	// If the heading doesn't have an ID, add one.
	$content = wp_strip_all_tags( $block_content );
	$processor->set_attribute( 'ID', esc_attr( sanitize_title( $content ) ) );

	return $processor->get_updated_html();
}
add_filter( 'render_block', 'wpsp_dynamic_table_of_contents_block_render', 10, 2 );
