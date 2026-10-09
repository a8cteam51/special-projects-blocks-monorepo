<?php
/**
 * Plugin Name:       Reactions
 * Description:       A block that allows users to react to a post.
 * Requires at least: 6.6
 * Requires PHP:      8.0
 * Version:           0.1.2
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       reactions
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'WPCOMSP_REACTIONS_DIR', plugin_dir_path( __FILE__ ) );
define( 'WPCOMSP_REACTIONS_URL', plugin_dir_url( __FILE__ ) );
define( 'WPCOMSP_REACTIONS_TABLE_NAME', 'wpcomsp_reactions' );

// Setup the reactions table on plugin activation.
register_activation_hook( __FILE__, 'wpcomsp_reactions_setup_table' );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 *
 * @return void
 */
function wpcomsp_reactions_block_init(): void {
	register_block_type( __DIR__ . '/build/reactions' );
	register_block_type( __DIR__ . '/build/reaction' );
}
add_action( 'init', 'wpcomsp_reactions_block_init' );


// Autoload all files in the includes directory.
foreach ( glob( __DIR__ . '/includes/*.php' ) as $wpcomsp_filename ) {
	include $wpcomsp_filename;
}
