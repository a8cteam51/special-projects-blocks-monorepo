<?php
/**
 * Plugin Name:       Hello World
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.1
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://opsoasis.mystagingwebsite.com/hello-world/
 * Text Domain:       hello-world
 *
 * @package           wpsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

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
	function( $blocks ) {
		$plugin_data = get_plugin_data( __FILE__ );

		// Add the plugin slug here to enable autoupdates.
		$blocks[] = 'hello-world';

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
function hello_world_hello_world_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'hello_world_hello_world_block_init' );
