<?php
/**
 * Plugin Name:       Table Plus
 * Description:       A structured, flexible table block with per-cell editing, header/footer rows, and customisable borders.
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/table-plus/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       table-plus
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	WPCOMSP_Blocks_Self_Update::get_instance()->hooks();
}

require __DIR__ . '/classes/class-wpcomsp-table-plus-renderer.php';

/**
 * Setup auto-updates for this plugin from our monorepo.
 * Done in an anonymous function for simplicity in making this a drop-in snippet.
 *
 * @param array $blocks Array of plugin files.
 *
 * @return array
 */
add_filter(
	'wpcomsp_installed_blocks',
	function ( $blocks ) {
		$blocks[] = 'table-plus';

		return $blocks;
	}
);

/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function wpcomsp_table_plus_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'wpcomsp_table_plus_block_init' );
