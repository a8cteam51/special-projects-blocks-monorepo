<?php
/**
 * Plugin Name:       Scroll Progress Bar
 * Description:       Progress bar that reflects the user's scroll position within the document.
 * Version:           0.1.2
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       scroll-progress-bar
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
 */
function a8csp_scroll_progress_bar_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build/block.json' );
}
add_action( 'init', 'a8csp_scroll_progress_bar_block_init' );
