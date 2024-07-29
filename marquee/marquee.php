<?php
/**
 * Plugin Name:       Marquee
 * Description:       Marquee block for the WordPress block editor.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       marquee
 *
 * @package           wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Enqueue the block's assets for the editor.
 *
 * @since 0.1.0
 * @return void
 */
function create_block_marquee_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_marquee_block_init' );
