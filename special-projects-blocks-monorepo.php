<?php
/**
 * Plugin Name:       Dynamic Table of Contents
 * Description:       Creates a table of contents that's dynamically (PHP) rendered.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           0.3
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dynamic-table-of-contents
 *
 * @package           wpsp
 */


/**
 * Load all existing blocks within subfolders
 * It assumes that the PHP file name is exactly like the directory name + .php.
 *
 * Example: /dynamic-table-of-contents/dynamic-table-of-contents.php
 */
function load_add_downloaded_blocks(){
	$dirs = glob( dirname( __FILE__ ) . '/*', GLOB_ONLYDIR );

	foreach ( $dirs as $dir ) {
		if ( file_exists( $dir . DIRECTORY_SEPARATOR . basename( $dir ) . '.php' ) ) {
			require $dir . DIRECTORY_SEPARATOR . basename( $dir ) . '.php';
		}
	}
}

add_action( 'init', 'load_add_downloaded_blocks' );
