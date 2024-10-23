<?php
/**
 * Plugin Name:       Stretchy Paragraph
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       stretchy-paragraph
 *
 * @package Wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wpcomsp_stretchy_paragraph_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'wpcomsp_stretchy_paragraph_block_init' );

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
		$blocks[] = 'stretchy-paragraph';

		return $blocks;
	}
);

/**
 * Load JS necessary to extend the paragraph  in the editor.
 */
function wpcomsp_enqueue_stretchy_paragraph() {
	wp_enqueue_script(
		'wpcomsp-stretchy-paragraph',
		plugins_url( 'build/stretchy-paragraph.js', __FILE__ ),
		array( 'wp-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'build/stretchy-paragraph.js' ),
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'wpcomsp_enqueue_stretchy_paragraph' );


/**
 * Enqueue the stylesheet.
 */
function wpcomsp_enqueue_stretchy_paragraph_styles() {
	wp_enqueue_style(
		'wpcomsp-stretchy-paragraph-styles',
		plugins_url( 'src/stretchy-paragraph.css', __FILE__ ),
		array(),
		filemtime( plugin_dir_path( __FILE__ ) . 'src/stretchy-paragraph.css' )
	);
}
add_action( 'enqueue_block_assets', 'wpcomsp_enqueue_stretchy_paragraph_styles' );

/**
 * Change markup when `isStretchy` is active.
 */
function wpcomsp_extend_stretchy_paragraph( $block_content, $block, $block_instance ) {
	if ( empty( $block['attrs']['isStretchy'] ) ) {
		return $block_content;
	}

	// Don't stretch paragraph if it is empty.
	if ( trim( wp_strip_all_tags( $block_content ) ) === '' ) {
		return $block_content;
	}

	$p = new WP_HTML_Tag_Processor( $block_content );
	$p->next_tag( 'p' );
	$p->set_attribute( 'aria-hidden', 'true' );

	$block_content_hidden = $p->get_updated_html();

	return <<<HTML
	<div class="wpcomsp-stretchy-paragraph">
		<div>
			$block_content
		</div>
		$block_content_hidden
	</div>
HTML;
}
add_filter( 'render_block_core/paragraph', 'wpcomsp_extend_stretchy_paragraph', 10, 3 );
