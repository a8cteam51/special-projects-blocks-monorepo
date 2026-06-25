<?php
/**
 * Plugin Name:       BP Groups Blocks
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bp-groups-blocks
 *
 * @package A8csp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The progress bar block is gated behind a filter to allow sites to disable it if they choose.
 *
 * @return boolean Whether the progress bar should be registered and shown in the group edit screen.
 */
function a8csp_bp_groups_progress_bar() {
	return apply_filters( 'bp_groups_progress_bar', true );
}

/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 *
 * @return void
 */
function a8csp_bp_groups_block_init() {
	if ( class_exists( 'BuddyPress' ) && bp_is_active( 'groups' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}

	if ( false === a8csp_bp_groups_progress_bar() ) {
		unregister_block_type( 'a8csp/bp-groups-progress' );
	}
}

add_action( 'init', 'a8csp_bp_groups_block_init' );

/**
 * Include the necessary classes for the plugin.
 *
 * @return void
 */
function a8csp_bp_groups_include_classes() {
	if ( bp_is_active( 'groups' ) ) {
		include_once __DIR__ . '/includes/Groups-Block-Bindings.php';
		include_once __DIR__ . '/includes/Groups-Type-REST-Controller.php';
		include_once __DIR__ . '/includes/Groups-Progress-Bar.php';

		A8CSP\BP_GROUPS\Groups_Type_REST_Controller::init();
		A8CSP\BP_GROUPS\Groups_Block_Bindings::group_block_bindings();

		add_filter( 'render_block_core/image', array( 'A8CSP\BP_GROUPS\Groups_Block_Bindings', 'render_block_core_image_avatar' ), 10, 3 );

		if ( true === a8csp_bp_groups_progress_bar() ) {
			// Register the extension
			bp_register_group_extension( 'A8CSP\BP_GROUPS\Groups_Progress_Bar' );
		}
	}
}

add_action( 'bp_init', 'a8csp_bp_groups_include_classes' );

// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	$wpcomsp_blocks_self_update = WPCOMSP_Blocks_Self_Update::get_instance();
	$wpcomsp_blocks_self_update->hooks();
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
	'wpcomsp_installed_blocks',
	function ( $blocks ) {
		$plugin_data = get_plugin_data( __FILE__ );

		// Add the plugin slug here to enable autoupdates.
		$blocks[] = 'bp-groups';

		return $blocks;
	}
);
