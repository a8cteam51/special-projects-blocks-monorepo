<?php
/**
 * Plugin Name:       Dynamic Table of Contents
 * Description:       Creates a table of contents that's dynamically (PHP) rendered.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           0.4.1
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dynamic-table-of-contents
 *
 * @package           wpcomsp
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define the plugin folder name.


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wpcomsp_dynamic_table_of_contents_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'wpcomsp_dynamic_table_of_contents_block_init' );

/**
 * Filter the render block output of heading blocks.
 *
 * @param string $block_content The block content about to be rendered.
 * @param array  $block         The block object.
 *
 * @return string Block content.
 */
function wpcomsp_dynamic_table_of_contents_block_render( $block_content, $block ) {
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
add_filter( 'render_block', 'wpcomsp_dynamic_table_of_contents_block_render', 10, 2 );
