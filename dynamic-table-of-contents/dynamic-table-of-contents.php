<?php
/**
 * Plugin Name:       Dynamic Table of Contents
 * Description:       Creates a table of contents that's dynamically (PHP) rendered.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           0.5.0
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/dynamic-table-of-contents/
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


// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	$wpcomsp_blocks_self_update = WPCOMSP_Blocks_Self_Update::get_instance();
	$wpcomsp_blocks_self_update->hooks();
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
	'wpcomsp_installed_blocks',
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
 *
 * @return void
 */
function wpcomsp_dynamic_table_of_contents_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'wpcomsp_dynamic_table_of_contents_block_init' );

/**
 * Whether editors may give headings a custom table of contents title.
 *
 * @return boolean
 */
function wpcomsp_dynamic_table_of_contents_allow_custom_titles() {
	/**
	 * Filters whether headings may have a custom table of contents title.
	 *
	 * Returning false hides the custom title controls in the editor and makes the
	 * table of contents use the heading text on the frontend.
	 *
	 * @since 0.5.0
	 *
	 * @param bool $allow_custom_titles Whether custom titles are allowed. Default true.
	 */
	return (bool) apply_filters( 'a8csp_dynamic_table_of_contents_allow_custom_titles', true );
}

/**
 * Pass the custom titles setting to the editor script.
 *
 * @return void
 */
function wpcomsp_dynamic_table_of_contents_editor_settings() {
	wp_add_inline_script(
		generate_block_asset_handle( 'wpcomsp/dynamic-table-of-contents', 'editorScript' ),
		sprintf(
			'window.wpcomspDynamicTOCEditor=%s;',
			wp_json_encode( array( 'allowCustomTitles' => wpcomsp_dynamic_table_of_contents_allow_custom_titles() ) )
		),
		'before'
	);
}
add_action( 'enqueue_block_editor_assets', 'wpcomsp_dynamic_table_of_contents_editor_settings' );

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

	// Custom table of contents title, stored in the block comment only.
	if ( ! empty( $block['attrs']['customTitle'] ) && is_string( $block['attrs']['customTitle'] ) ) {
		$processor->set_attribute( 'data-toc-title', $block['attrs']['customTitle'] );
	}

	// If the heading already has an ID, don't add one.
	if ( null === $processor->get_attribute( 'id' ) ) {
		// If the heading doesn't have an ID, add one.
		$content = wp_strip_all_tags( $block_content );
		$processor->set_attribute( 'id', esc_attr( sanitize_title( $content ) ) );
	}

	return $processor->get_updated_html();
}
add_filter( 'render_block', 'wpcomsp_dynamic_table_of_contents_block_render', 10, 2 );
