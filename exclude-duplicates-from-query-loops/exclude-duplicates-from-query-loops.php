<?php
/**
 * Plugin Name:       Exclude Duplicate Posts from Query Loops
 * Description:       Exclude posts from query loops that have already been displayed on the current page.
 * Version:           0.1.0
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/exclude-duplicates-from-query-loops/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a8csp-exclude-duplicates
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
		$blocks[] = 'exclude-duplicates-from-query-loops';

		return $blocks;
	}
);

/**
 * Enqueues the editor script for the block editor.
 *
 * @return void
 */
function a8csp_exclude_duplicates_enqueue_block_editor_assets() {

	if ( ! is_readable( __DIR__ . '/build/editor/editor.asset.php' ) || ! is_readable( __DIR__ . '/build/editor/editor.js' ) ) {
		return;
	}

	$asset_meta    = include __DIR__ . '/build/editor/editor.asset.php';
	$asset_version = $asset_meta['version'] ?? filemtime( __DIR__ . '/build/editor/editor.js' );

	wp_enqueue_script(
		'exclude-duplicates-from-query-loops-editor-script',
		plugin_dir_url( __FILE__ ) . 'build/editor/editor.js',
		$asset_meta['dependencies'] ?? array(),
		$asset_version,
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'a8csp_exclude_duplicates_enqueue_block_editor_assets' );

/**
 * Add hooks for query blocks to store post ids and exclude previous post ids for blocks
 * with the query > exclude_previous_posts attribute.
 *
 * @param string|null         $block_content The pre-rendered content. Default null.
 * @param array<string,mixed> $block         An associative array of the block being rendered. See WP_Block_Parser_Block.
 *
 * @return string|null
 */
function a8csp_exclude_duplicates_pre_render_block( $block_content, $block ) {

	if ( 'core/query' !== $block['blockName'] ) {
		return $block_content;
	}

	// store post id for each query
	add_filter( 'render_block_context', 'a8csp_exclude_duplicates_render_block_context' );

	// if flag is set -> exclude previous posts
	if ( isset( $block['attrs']['query']['exclude_previous_posts'] ) && true === $block['attrs']['query']['exclude_previous_posts'] ) {
		add_filter( 'query_loop_block_query_vars', 'a8csp_exclude_duplicates_query_loop_block_query_vars' );
	}

	return $block_content;
}
add_filter( 'pre_render_block', 'a8csp_exclude_duplicates_pre_render_block', 10, 2 );

/**
 * Update query args for frontend query block.
 *
 * @param array<string,mixed> $query_args Array containing parameters for `WP_Query` as parsed by the block context.
 *
 * @return array<string,mixed>
 */
function a8csp_exclude_duplicates_query_loop_block_query_vars( $query_args ) {

	// remove filter so it doesn't run for other query loops
	remove_filter( 'query_loop_block_query_vars', 'a8csp_exclude_duplicates_query_loop_block_query_vars' );

	$query_args['offset'] = 0;

	if ( ! isset( $GLOBALS['a8csp_exclude_duplicates_post_ids'] ) || ! is_array( $GLOBALS['a8csp_exclude_duplicates_post_ids'] ) ) {
		return $query_args;
	}

	if ( isset( $query_args['post__not_in'] ) && is_array( $query_args['post__not_in'] ) ) {
		$query_args['post__not_in'] = array_merge( $query_args['post__not_in'], $GLOBALS['a8csp_exclude_duplicates_post_ids'] );
	} else {
		$query_args['post__not_in'] = $GLOBALS['a8csp_exclude_duplicates_post_ids'];
	}

	return $query_args;
}

/**
 * Store post ids.
 *
 * @param array<string,mixed> $context Default context.
 *
 * @return array<string,mixed>
 */
function a8csp_exclude_duplicates_render_block_context( $context ) {

	if ( ! isset( $context['postId'] ) ) {
		return $context;
	}

	if ( ! isset( $GLOBALS['a8csp_exclude_duplicates_post_ids'] ) ) {
		$GLOBALS['a8csp_exclude_duplicates_post_ids'] = array();
	}

	if ( ! in_array( $context['postId'], $GLOBALS['a8csp_exclude_duplicates_post_ids'], true ) ) {
		$GLOBALS['a8csp_exclude_duplicates_post_ids'][] = $context['postId'];
	}

	return $context;
}

/**
 * Remove filter after rendering query block.
 *
 * @param string $block_content The block content.
 *
 * @return string
 */
function a8csp_exclude_duplicates_render_block_core_query( $block_content ) {

	remove_filter( 'render_block_context', 'a8csp_exclude_duplicates_render_block_context' );

	return $block_content;
}
add_filter( 'render_block_core/query', 'a8csp_exclude_duplicates_render_block_core_query' );
