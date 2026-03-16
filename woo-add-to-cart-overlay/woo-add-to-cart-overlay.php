<?php
/**
 * Plugin Name:       WooCommerce Add To Cart Overlay
 * Description:       Replaces the default add-to-cart button with a button that opens an overlay showing the add to cart form.
 * Version:           0.2.0
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/woo-add-to-cart-overlay/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a8csp-watco
 * Requires at least: 6.8
 * Tested up to:      6.9.1
 * Requires PHP:      8.1
 * Requires Plugins:  woocommerce
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
		$blocks[] = 'woo-add-to-cart-overlay';

		return $blocks;
	}
);

/**
 * Enqueues the scripts and styles.
 *
 * @return void
 */
function a8csp_watco_wp_enqueue_scripts() {

	if ( ! is_readable( __DIR__ . '/build/view/view.asset.php' ) || ! is_readable( __DIR__ . '/build/view/view.js' ) ) {
		return;
	}

	$asset_meta         = include __DIR__ . '/build/view/view.asset.php';
	$asset_version      = $asset_meta['version'] ?? filemtime( __DIR__ . '/build/view/view.js' );
	$asset_dependencies = $asset_meta['dependencies'] ?? array();

	wp_enqueue_script(
		'woo-add-to-cart-overlay-view-script',
		plugin_dir_url( __FILE__ ) . 'build/view/view.js',
		$asset_dependencies,
		$asset_version,
		true
	);

	wp_enqueue_style(
		'woo-add-to-cart-overlay-view-style',
		plugin_dir_url( __FILE__ ) . 'build/view/style-view.css',
		array(),
		$asset_version,
	);
	wp_style_add_data( 'woo-add-to-cart-overlay-view-style', 'rtl', 'replace' );
}
add_action( 'wp_enqueue_scripts', 'a8csp_watco_wp_enqueue_scripts' );

require __DIR__ . '/includes/render-overlay.php';
