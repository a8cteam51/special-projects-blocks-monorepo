<?php
/**
 * Plugin Name:       Exclude Current Post from Query
 * Description:       Excludes the current post ID from core Query Loop block results on singular pages, so related-posts queries on a single post never return the post itself.
 * Version:           0.1.0
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/exclude-current-post-from-query/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a8csp-exclude-current-post
 * Requires at least: 6.6
 * Tested up to:      6.8.3
 * Requires PHP:      7.4
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
 *
 * @param array $blocks Array of plugin files.
 *
 * @return array
 */
add_filter(
	'wpcomsp_installed_blocks',
	function ( $blocks ) {
		$blocks[] = 'exclude-current-post-from-query';

		return $blocks;
	}
);

/**
 * Exclude the current singular post from Query Loop block results.
 *
 * @param array<string,mixed> $query_args Array containing parameters for `WP_Query` as parsed by the block context.
 *
 * @return array<string,mixed>
 */
function a8csp_exclude_current_post_query_loop_block_query_vars( $query_args ) {

	if ( ! is_singular() ) {
		return $query_args;
	}

	$current_post_id = get_queried_object_id();

	if ( ! $current_post_id ) {
		return $query_args;
	}

	if ( isset( $query_args['post__not_in'] ) && is_array( $query_args['post__not_in'] ) ) {
		if ( ! in_array( $current_post_id, $query_args['post__not_in'], true ) ) {
			$query_args['post__not_in'][] = $current_post_id;
		}
	} else {
		$query_args['post__not_in'] = array( $current_post_id );
	}

	return $query_args;
}
add_filter( 'query_loop_block_query_vars', 'a8csp_exclude_current_post_query_loop_block_query_vars' );
