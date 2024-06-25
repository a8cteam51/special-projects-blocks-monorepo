<?php
/**
 * Plugin Name:       Sibling Pages List
 * Description:       Displays a list of the current page's sibling pages
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            WordPress.com Special Projects Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sibling-pages-list
 *
 * @package Wpsp
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
		$blocks[] = 'sibling-pages-list';

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
function wpsp_sibling_pages_list_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'wpsp_sibling_pages_list_block_init' );
