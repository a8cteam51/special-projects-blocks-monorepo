<?php
/**
 * Plugin Name:       Cover Background Crossfade
 * Description:       Adds Crossfading background images or videos of multiple cover blocks on a single page based on their scroll position.
 * Version:           0.1.0
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/cover-bg-crossfade/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a8csp-cover-bg-crossfade
 * Requires at least: 6.6
 * Tested up to:      6.8.3
 * Requires PHP:      7.4
 * Network:           false
 *
 * @package           a8csp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	WPCOMSP_Blocks_Self_Update::get_instance()->hooks();
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
		// Add the plugin slug here to enable autoupdates.
		$blocks[] = 'cover-bg-crossfade';

		return $blocks;
	}
);

/**
 * Enqueues the scripts and styles.
 *
 * @return void
 */
function a8csp_cover_crossfade_wp_enqueue_scripts() {

	if ( ! is_readable( __DIR__ . '/build/view/view.asset.php' ) || ! is_readable( __DIR__ . '/build/view/view.js' ) ) {
		return;
	}

	$asset_meta    = include __DIR__ . '/build/view/view.asset.php';
	$asset_version = $asset_meta['version'] ?? filemtime( __DIR__ . '/build/view/view.js' );

	wp_enqueue_script(
		'cover-bg-crossfade-view-script',
		plugin_dir_url( __FILE__ ) . 'build/view/view.js',
		$asset_meta['dependencies'] ?? array(),
		$asset_version,
		true
	);

	wp_enqueue_style(
		'cover-bg-crossfade-view-style',
		plugin_dir_url( __FILE__ ) . 'build/view/style-view.css',
		$asset_meta['dependencies'] ?? array(),
		$asset_version,
	);
	wp_style_add_data( 'cover-bg-crossfade-view-style', 'rtl', 'replace' );
}
add_action( 'wp_enqueue_scripts', 'a8csp_cover_crossfade_wp_enqueue_scripts' );


/**
 * Add block style for cover bg crossfade.
 *
 * @return void
 */
function a8csp_cover_crossfade_register_block_styles() {
	register_block_style(
		'core/cover',
		array(
			'name'  => 'a8csp-cover-bg-crossfade',
			'label' => esc_html__( 'Crossfade Background', 'a8csp-cover-bg-crossfade' ),
		)
	);
}
add_action( 'after_setup_theme', 'a8csp_cover_crossfade_register_block_styles' );
