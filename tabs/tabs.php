<?php
/**
 * Plugin Name:       Tabs
 * Plugin URI:        https://wpspecialprojects.wordpress.com/
 * Description:       A block that allows users to organize content into tabs.
 * Requires at least: 6.5
 * Requires PHP:      8.0
 * Version:           0.1.0
 * Author:            WordPress Special Projects Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tabs
 * Update URI:        https://opsoasis.wpspecialprojects.com/tabs/
 *
 * @package wpcomsp
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
function wpcomsp_tabs_block_init() {
	register_block_type( __DIR__ . '/build/tabs' );
	register_block_type( __DIR__ . '/build/tab' );
}
add_action( 'init', 'wpcomsp_tabs_block_init' );
