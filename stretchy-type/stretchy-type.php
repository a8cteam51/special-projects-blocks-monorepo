<?php
/**
 * Plugin Name:       Stretchy Type
 * Description:       A block that expands to fill the width of its container.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.5
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       stretchy-type
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
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
function wpsp_stretchy_type_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'wpsp_stretchy_type_block_init' );
