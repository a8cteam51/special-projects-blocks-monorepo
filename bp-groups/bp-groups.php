<?php
/**
 * Plugin Name:       Bp Groups Gutenberg
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bp-groups-gutenberg
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
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function a8csp_bp_groups_block_init() {
	if ( class_exists( 'BuddyPress' ) && bp_is_active( 'groups' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
}
add_action( 'init', 'a8csp_bp_groups_block_init' );


/**
 * Inserts the campaign content into the group home page.
 *
 * @return void
 */
function insert_campaign_content() {
	$group            = groups_get_current_group();
	$bp_is_group_home = bp_is_group_home();

	if ( $bp_is_group_home && bp_current_user_can( 'groups_access_group' ) ) {
		$campaign_content = groups_get_groupmeta( $group->id, 'content', true );
		if ( $campaign_content ) {
			echo '<div class="campaign-content">' . wp_kses_post( wpautop( $campaign_content ) ) . '</div>';
		}
	}
}

add_action( 'bp_before_group_body', 'insert_campaign_content' );