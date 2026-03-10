<?php
/**
 * Plugin Name:       Dynamic Shapes
 * Description:       Extends the core Group, Image, and Featured Image blocks with controls for adjusting corners to create unique shapes.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Automattic Special Projects
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/dynamic-shapes/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a8csp-dynamic-shapes
 *
 * @package           a8csp-dynamic-shapes
 */

defined( 'ABSPATH' ) || exit;

define( 'A8CSP_DYNAMIC_SHAPES_DIR', plugin_dir_path( __FILE__ ) );
define( 'A8CSP_DYNAMIC_SHAPES_URL', plugin_dir_url( __FILE__ ) );

// Add the self update class if needed.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	$wpcomsp_blocks_self_update = WPCOMSP_Blocks_Self_Update::get_instance(); // @phpstan-ignore class.notFound
	$wpcomsp_blocks_self_update->hooks();
}

/**
 * Setup auto-updates from the monorepo.
 *
 * @param array $blocks Array of plugin files.
 *
 * @return array
 */
add_filter(
	'wpcomsp_installed_blocks',
	function ( $blocks ) {
		$blocks[] = 'a8csp-dynamic-shapes';

		return $blocks;
	}
);

// Autoload all files in the includes directory.
foreach ( (array) glob( __DIR__ . '/includes/*.php' ) as $a8csp_dynamic_shapes_filename ) {
	include $a8csp_dynamic_shapes_filename;
}
