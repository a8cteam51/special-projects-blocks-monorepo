<?php
/**
 * Plugin Name:       CPT Press Releases
 * Description:       Add a custom post type for press releases, with a pattern-based block for displaying them.
 * Requires at least: 6.5
 * Tested up to:      6.7
 * Requires PHP:      8.0
 * Tested PHP up to:  8.3
 * Version:           1.0.0
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cpt-press
 *
 * @package A8CSP/CPTPress
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// If no other WPCOMSP Block Plugin added the self-update class, add it.
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
		$blocks[] = 'reactions';

		return $blocks;
	}
);

// Load the CPT Press classes.
require_once __DIR__ . '/classes/class-cpt-press.php';
require_once __DIR__ . '/classes/class-cpt-press-table.php';
