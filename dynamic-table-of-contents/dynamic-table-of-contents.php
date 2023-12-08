<?php
/**
 * Plugin Name:       Dynamic Table of Contents
 * Description:       Creates a table of contents that's dynamically (PHP) rendered.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           0.2
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dynamic-table-of-contents
 *
 * @package           wpsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// handles updating of the plugin itself.
require_once __DIR__ . '/class-wpsp-blocks-self-update.php';

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
