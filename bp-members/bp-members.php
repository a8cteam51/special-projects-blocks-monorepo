<?php
/**
 * Plugin Name:       BP Members
 * Description:       Custom block & block variation for BuddyPress members.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bp-members
 *
 * @package A8csp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @return void
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function a8csp_bp_members_block_init() {
	if ( class_exists( 'BuddyPress' ) && bp_is_active( 'members' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );

		include __DIR__ . '/includes/Members-Type-REST-Controller.php';
		A8CAP\BP_MEMBERS\Members_Type_REST_Controller::init();

		include __DIR__ . '/includes/Block-Bindings.php';
		A8CAP\BP_MEMBERS\Block_Bindings::member_block_bindings();
	}
}

add_action( 'init', 'a8csp_bp_members_block_init' );
