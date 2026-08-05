<?php
/**
 * Plugin Name:       Tabs
 * Plugin URI:        https://wpspecialprojects.wordpress.com/
 * Description:       A block that allows users to organize content into tabs.
 * Requires at least: 6.5
 * Requires PHP:      8.0
 * Version:           0.2.0
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
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
 *
 * @return void
 */
function wpcomsp_tabs_block_init() {
	register_block_type( __DIR__ . '/build/tabs' );
	register_block_type( __DIR__ . '/build/tab' );
}
add_action( 'init', 'wpcomsp_tabs_block_init' );

/**
 * Removes the block from the inserter on sites that ship the core Tabs block.
 * Existing content keeps rendering and stays editable, and can be converted
 * to `core/tabs` from the block toolbar.
 *
 * @param array $metadata Metadata loaded from the `block.json` file.
 *
 * @return array
 */
function wpcomsp_tabs_hide_from_inserter( $metadata ) {
	if ( 'wpcomsp/tabs' !== $metadata['name'] ) {
		return $metadata;
	}

	if ( WP_Block_Type_Registry::get_instance()->is_registered( 'core/tabs' ) ) {
		$metadata['supports']['inserter'] = false;
	}

	return $metadata;
}
add_filter( 'block_type_metadata', 'wpcomsp_tabs_hide_from_inserter' );
