<?php
/**
 * Plugin Name:       WordPress.com Special Projects Blocks Monorepo Autoloader
 * Description:       Auto-loads any blocks in the monorepo that have a build directory. Run `npm run build` in the block plugin directory you're working on to create the build directory and auto-load that block plugin.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           1.1.0
 * Author:            WordPress.com Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wpcomsp-blocks
 *
 * @package           wpcomsp
 */


/**
 * Load all existing blocks within subfolders that have build directories.
 * It assumes that the PHP file name is exactly like the directory name + .php.
 *
 * Example: /dynamic-table-of-contents/dynamic-table-of-contents.php
 */
function wpcomsp_autoload_monorepo_blocks() {
	$dirs = glob( __DIR__ . '/*', GLOB_ONLYDIR );

	foreach ( $dirs as $dir ) {
		$plugin_file = $dir . DIRECTORY_SEPARATOR . basename( $dir ) . '.php';
		if ( ! file_exists( $plugin_file ) ) {
			continue;
		}

		// Block plugins have a `src` directory that must be compiled to `build`.
		// PHP-only sub-plugins have no `src` and load directly.
		$has_src   = is_dir( $dir . DIRECTORY_SEPARATOR . 'src' );
		$has_build = is_dir( $dir . DIRECTORY_SEPARATOR . 'build' );

		if ( $has_src && ! $has_build ) {
			continue;
		}

		include $plugin_file;
	}
}
add_action( 'plugins_loaded', 'wpcomsp_autoload_monorepo_blocks' );
