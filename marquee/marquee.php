<?php
/**
 * Plugin Name:       Marquee
 * Description:       Provides a marquee effect for your content.
 * Version:           0.1.4
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       marquee
 *
 * @package A8csp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 *
 * @return void
 */
function a8csp_marquee_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build/marquee' );
}
add_action( 'init', 'a8csp_marquee_block_init' );
