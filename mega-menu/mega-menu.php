<?php
/**
 * Plugin Name:       Mega Menu
 * Description:       Add a menu item that opens a template part area to display as a mega menu.
 * Version:           0.1.0
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mega-menu
 *
 * @package           wpcomsp
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
 *
 * @return void
 */
function wpcomsp_mega_menu_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build' );
}
add_action( 'init', 'wpcomsp_mega_menu_block_init' );

/**
 * Adds a custom template part area for mega menus to the list of template part areas.
 *
 * @param array $areas Existing array of template part areas.
 *
 * @return array Modified array of template part areas.
 */
function wpcomsp_mega_menu_template_areas( array $areas ) {
	$mega_menu_area = apply_filters(
		'wpcomsp_mega_menu_area_args',
		array(
			'area'        => 'menu',
			'area_tag'    => 'div',
			'description' => __( 'Menu templates are used to create sections of a mega menu.', 'wpcomsp' ),
			'icon'        => '',
			'label'       => __( 'Mega Menu', 'wpcomsp' ),
		)
	);

	$areas[] = $mega_menu_area;

	return $areas;
}

add_filter( 'default_wp_template_part_areas', 'wpcomsp_mega_menu_template_areas' );

/**
 * Add Mega Menu block to the list of allowed blocks for the Navigation block.
 *
 * @param array  $args       The block type registration arguments.
 * @param string $block_type The block type name including namespace.
 *
 * @return array
 */
function wpcomsp_mega_menu_navigation_filter( $args, $block_type ) {
	if ( 'core/navigation' === $block_type ) {
		if ( is_array( $args['allowed_blocks'] ) ) {
			$updated_args = array_push( $args['allowed_blocks'], 'wpcomsp/mega-menu' );

			$args['allowedBlocks'] = $updated_args;
		}
	}

	return $args;
}

add_filter( 'register_block_type_args', 'wpcomsp_mega_menu_navigation_filter', 10, 2 );
