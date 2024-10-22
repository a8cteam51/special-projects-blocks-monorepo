<?php
/**
 * Plugin Name:       WordPress.com Special Projects Blocks Monorepo Autoloader
 * Description:       Auto-loads any blocks in the monorepo that have a build directory. Run `npm run build` in the block plugin directory you're working on to create the build directory and auto-load that block plugin.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           1.0.0
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
		if ( file_exists( $dir . DIRECTORY_SEPARATOR . basename( $dir ) . '.php' ) && is_dir( $dir . DIRECTORY_SEPARATOR . 'build' ) ) {
			include $dir . DIRECTORY_SEPARATOR . basename( $dir ) . '.php';
		}
	}
}
add_action( 'plugins_loaded', 'wpcomsp_autoload_monorepo_blocks' );

/**
 * Load JS necessary to extend the query  in the editor.
 */
function wpcomsp_enqueue_filtered_query_loop() {
	wp_enqueue_script(
		'wpcomsp-filtered-query-loop',
		plugins_url( 'filtered-query-block.js', __FILE__ ),
		array( 'wp-block-editor', 'wp-components', 'wp-compose', 'wp-element', 'wp-hooks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'filtered-query-block.js' ),
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
