<?php
/**
 * Plugin Name:       Jetpack Related Posts Query Loop
 * Description:       Adds a query loop variation to display related posts from Jetpack.
 * Version:           0.1.0
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/jp-related-posts-query-loop/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       a8csp-jprpql
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
		$blocks[] = 'jp-related-posts-query-loop';

		return $blocks;
	}
);

/**
 * Add block variations.
 *
 * @param array<mixed>  $variations Array of registered variations for a block type.
 * @param WP_Block_Type $block_type The full block type object.
 *
 * @return array<mixed>
 *
 * @SuppressWarnings(ExcessiveMethodLength)
 */
function a8csp_jrpql_register_related_query_block_variation( $variations, $block_type ) {

	if ( 'core/query' === $block_type->name ) {
		$variations[] = array(
			'icon'            => 'star-filled',
			'name'            => 'jp-related-posts-query-loop',
			'title'           => esc_html__( 'Related Posts Query', 'a8csp-jprpql' ),
			'description'     => esc_html__( 'Related posts query block.', 'a8csp-jprpql' ),
			'keywords'        => array(
				/* translators: search keyword for block variation */
				esc_html__( 'query', 'a8csp-jprpql' ),
				/* translators: search keyword for block variation */
				esc_html__( 'related', 'a8csp-jprpql' ),
			),
			'attributes'      => array(
				'align'     => 'wide',
				'query'     => array(
					'query_type' => 'related-posts',
					'perPage'    => 4,
					'inherit'    => false,
					'postType'   => 'post',
				),
				'namespace' => 'a8csp-jrpql/related-posts',
			),
			'allowedControls' => array( 'postCount' ),
			'isActive'        => array( 'namespace' ),
			'isDefault'       => false,
		);
	}

	return $variations;
}
add_filter( 'get_block_type_variations', 'a8csp_jrpql_register_related_query_block_variation', 10, 2 );

/**
 * Add hooks for query blocks to store post ids and related previous post ids for blocks
 * with the query > related_previous_posts attribute.
 *
 * @param string|null         $block_content The pre-rendered content. Default null.
 * @param array<string,mixed> $block         An associative array of the block being rendered. See WP_Block_Parser_Block.
 *
 * @return string|null
 */
function a8csp_jrpql_pre_render_block_query_block_related( $block_content, $block ) {

	if ( 'core/query' !== $block['blockName'] ) {
		return $block_content;
	}

	// if flag is set -> related previous posts
	if ( isset( $block['attrs']['namespace'] ) && 'a8csp-jrpql/related-posts' === $block['attrs']['namespace'] ) {
		add_filter( 'query_loop_block_query_vars', 'a8csp_jrpql_query_loop_block_query_vars_related' );
	}

	return $block_content;
}
add_filter( 'pre_render_block', 'a8csp_jrpql_pre_render_block_query_block_related', 10, 2 );

/**
 * Update query args for frontend query block.
 *
 * @param array<string,mixed> $query_args Array containing parameters for `WP_Query` as parsed by the block context.
 *
 * @return array<string,mixed>
 */
function a8csp_jrpql_query_loop_block_query_vars_related( $query_args ) {

	// remove filter so it doesn't run for other query loops
	remove_filter( 'query_loop_block_query_vars', 'a8csp_jrpql_query_loop_block_query_vars_related' );

	return a8csp_jrpql_get_related_posts_args( $query_args );
}

/**
 * Get related posts.
 *
 * @param array<string, mixed> $query_args Query arguments.
 *
 * @return array<string, mixed> An array containing the posts and the source of the data.
 */
function a8csp_jrpql_get_related_posts_args( array $query_args ): array {

	$post_id = get_the_ID();

	if ( ! empty( $post_id ) ) {
		return $query_args;
	}

	$ppp      = $query_args['posts_per_page'] ?? 4;
	$post_ids = array();

	if ( class_exists( 'Jetpack_RelatedPosts' ) && class_exists( 'Jetpack_RelatedPosts_Raw' ) ) {
		/**
		 * Get related posts instance.
		 *
		 * @var Jetpack_RelatedPosts_Raw $posts
		 */
		$posts = Jetpack_RelatedPosts::init_raw();
		$posts = $posts->set_query_name( 'a8csp_jrpql_related_posts' )->get_for_post_id( $post_id, array( 'size' => $ppp ) );

		$post_ids = wp_list_pluck( $posts, 'id' );
		$post_ids = array_filter(
			$post_ids,
			function ( $post_id ) {
				return (int) $post_id > 0;
			}
		);
	}

	// fallback to get random posts
	if ( count( $post_ids ) === 0 ) {
		$posts = new WP_Query(
			array(
				'posts_per_page' => $ppp * 3,
				'fields'         => 'ids',
				'post_type'      => 'post',
				'post__not_in'   => array( $post_id ),
			)
		);

		$post_ids = $posts->posts;
		shuffle( $post_ids );
	}

	// Only query for the posts we need.
	$post_ids = array_slice( $post_ids, 0, $ppp );

	$query_args['offset']   = 0;
	$query_args['post__in'] = $post_ids;
	$query_args['orderby']  = 'post__in';

	return $query_args;
}
