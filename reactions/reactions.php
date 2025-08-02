<?php
/**
 * Plugin Name:       Reactions
 * Description:       A block that allows users to react to a post.
 * Requires at least: 6.6
 * Requires PHP:      8.0
 * Version:           0.1.1
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/reactions/
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

// If no other WPCOMSP Block Plugin added the self update class, add it.
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
