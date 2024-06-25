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
