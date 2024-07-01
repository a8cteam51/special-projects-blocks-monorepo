<?php
/**
 * Plugin Name:       Stretchy Type
 * Description:       A block that expands to fill the width of its container.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Studio 51
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       stretchy-type
 *
 * @package Wpsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

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
	function( $blocks ) {
		$plugin_data = get_plugin_data( __FILE__ );

		// Add the plugin slug here to enable autoupdates.
		$blocks[] = 'stretchy-type';

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
function wpsp_stretchy_type_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'wpsp_stretchy_type_block_init' );
