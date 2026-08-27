<?php
/**
 * Plugin Name:       Podcast Feed
 * Description:       Display podcast episodes from any RSS feed with customizable options.
 * Requires at least: 6.5
 * Requires PHP:      8.0
 * Version:           0.1.0
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/a8csp-podcast-feed/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a8csp-podcast-feed
 *
 * @package Wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	WPCOMSP_Blocks_Self_Update::get_instance()->hooks();
}

/**
 * Setup auto-updates for this plugin from our monorepo.
 *
 * @param array $blocks Array of plugin slugs.
 *
 * @return array
 */
add_filter(
	'wpcomsp_installed_blocks',
	function ( $blocks ) {
		$blocks[] = 'a8csp-podcast-feed';
		return $blocks;
	}
);

require_once __DIR__ . '/includes/rss-podcast-item.php';
require_once __DIR__ . '/includes/block.php';
