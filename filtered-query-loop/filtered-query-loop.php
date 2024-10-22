<?php
/**
 * Plugin Name:       Filtered Query Loop
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       filtered-query-loop
 *
 * @package Wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

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
		$plugin_data = get_plugin_data( __FILE__ );

		// Add the plugin slug here to enable autoupdates.
		$blocks[] = 'filtered-query-loop';

		return $blocks;
	}
);


/**
 * Load JS necessary to extend the query  in the editor.
 */
function wpcomsp_enqueue_filtered_query_loop() {
	wp_enqueue_script(
		'wpcomsp-filtered-query-loop',
		plugins_url( 'build/filtered-query-loop.js', __FILE__ ),
		array( 'wp-block-editor', 'wp-components', 'wp-compose', 'wp-element', 'wp-hooks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'build/filtered-query-loop.js' ),
		true
	);
}

add_action( 'enqueue_block_editor_assets', 'wpcomsp_enqueue_filtered_query_loop' );

/**
 * Add `queryId` to categories block context.
 */
function wpcomsp_extend_categories_uses_context( $metadata ) {
	if ( 'core/categories' === $metadata['name'] ) {
		$metadata['usesContext'][] = 'queryId';
	}
	return $metadata;
}
add_filter( 'block_type_metadata', 'wpcomsp_extend_categories_uses_context' );

/**
 * Change markup when `isFilter` is active.
 */
function wpcomsp_extend_filtered_query_loop( $block_content, $block, $block_instance ) {
	if ( empty( $block['attrs']['isFilter'] ) ) {
		return $block_content;
	}

	// TODO: Handle logic differently when there is no queryId.
	if ( ! isset( $block_instance->context['queryId'] ) ) {
		return $block_content;
	}

	$p = new WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag( 'li' ) ) {
		$classnames = $p->get_attribute( 'class' );
		// TODO: Make it work for any taxonomy.
		preg_match( '/cat-item-(\d+)/', $classnames, $matches );
		$tax_id = $matches[1];
		if ( ! isset( $tax_id ) ) {
			continue;
		}
		$p->next_tag( 'a' );
		$tax_param  = 'wpcomsp-query-' . $block_instance->context['queryId'] . '-categories';
		$page_param = 'query-' . $block_instance->context['queryId'] . '-page';
		$new_url    = add_query_arg(
			array(
				$tax_param  => $tax_id,
				$page_param => 1,
			)
		);
		$p->set_attribute( 'href', $new_url );
		$p->set_attribute( 'data-wp-on--click', 'core/query::actions.navigate' );
	}
	return $p->get_updated_html();
}
add_filter( 'render_block_core/categories', 'wpcomsp_extend_filtered_query_loop', 10, 3 );

/**
 * Extend query loop to accept URL params.
 */
function wpcomsp_extend_query_loop_url_params( $parsed_block ) {
	if ( 'core/query' !== $parsed_block['blockName'] ) {
		return $parsed_block;
	}

	$param_key        = isset( $parsed_block['attrs']['queryId'] ) ? 'wpcomsp-query-' . $parsed_block['attrs']['queryId'] . '-categories' : 'wpcmosp-query-categories';
	$categories_param = $_GET[ $param_key ] ?? null;
	$categories_array = $categories_param ? array_map( 'intval', explode( ',', $categories_param ) ) : array();

	$parsed_block['attrs']['query']['taxQuery']['category'] = $categories_array;

	return $parsed_block;
}
add_filter( 'render_block_data', 'wpcomsp_extend_query_loop_url_params', 10, 1 );

register_block_style(
	'core/categories',
	array(
		'name'         => 'row-wrapped',
		'label'        => __( 'Row Wrapped', 'textdomain' ),
		'inline_style' => '.wp-block-categories.is-style-row-wrapped { display: flex; gap: 8px; }',
		'is_default'   => true,
	)
);

register_block_style(
	'core/categories',
	array(
		'name'         => 'row-scroll',
		'label'        => __( 'Row Scroll', 'textdomain' ),
		'inline_style' => '.wp-block-categories.is-style-row-scroll { display: flex; gap: 8px; overflow: auto; white-space: nowrap; }',
	)
);

register_block_style(
	'core/categories',
	array(
		'name'  => 'column',
		'label' => __( 'Column', 'textdomain' ),
	)
);
