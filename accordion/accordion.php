<?php
/**
 * Plugin Name:       Accordion
 * Description:       Container block for accordion items.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.2.0
 * Author:            Studio 51
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       accordion
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
function wpcomsp_accordion_block_init() {
	register_block_type( __DIR__ . '/build/accordion-group' );
	register_block_type( __DIR__ . '/build/accordion-item' );
	register_block_type( __DIR__ . '/build/accordion-trigger' );
	register_block_type( __DIR__ . '/build/accordion-content' );
}
add_action( 'init', 'wpcomsp_accordion_block_init' );
