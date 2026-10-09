<?php
/**
 * Plugin Name:       Dynamic Shapes
 * Description:       Extends the core Cover, Group, Image, and Featured Image blocks with controls for adjusting corners to create unique shapes.
 * Version:           0.1.1
 * Requires at least: 6.7
 * Requires PHP:      8.0
 * Author:            Automattic Special Projects
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a8csp-dynamic-shapes
 *
 * @package           a8csp-dynamic-shapes
 */

defined( 'ABSPATH' ) || exit;

define( 'A8CSP_DYNAMIC_SHAPES_DIR', plugin_dir_path( __FILE__ ) );
define( 'A8CSP_DYNAMIC_SHAPES_URL', plugin_dir_url( __FILE__ ) );

// Autoload all files in the includes directory.
foreach ( (array) glob( __DIR__ . '/includes/*.php' ) as $a8csp_dynamic_shapes_filename ) {
	include $a8csp_dynamic_shapes_filename;
}
