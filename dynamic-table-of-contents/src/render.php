<?php
/**
 * Render the block on the frontend.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Don't render this block if it's not in the context of a post.
if ( ! isset( $block->context['postId'] ) ) {
	return;
}

// WPCom is having trouble enqueueing view.js for this block, so doing it here.
$asset_deps = require trailingslashit( plugin_dir_path( __FILE__ ) ) . 'view.asset.php';

wp_enqueue_script(
	'wpcomsp-dynamic-table-of-contents-view',
	plugins_url( 'view.js', __FILE__ ),
	$asset_deps['dependencies'],
	$asset_deps['version'],
	true
);

// An empty selection falls back to every level, matching the editor.
$heading_levels = ! empty( $attributes['headingLevels'] ) ? $attributes['headingLevels'] : range( 1, 6 );

$default_heading_selectors = array_map(
	static function ( $level ) {
		return sprintf( '.wp-block-post-content h%d', $level );
	},
	$heading_levels
);

/**
 * Filters the selectors used by the view script to collect headings for the table of contents.
 *
 * @since 0.2.0
 *
 * @param string[] $default_heading_selectors Array of selectors for table of contents headings.
 * @param array    $attributes                Block attributes.
 * @param WP_Block $block                     The block object.
 */
$heading_selectors = apply_filters(
	'a8csp_dynamic_table_of_contents_heading_selectors',
	$default_heading_selectors,
	$attributes,
	$block
);

$include_nested_headings = ! empty( $attributes['includeNestedHeadings'] );

$default_exclude_selectors = array( '.hide-from-toc' );

/**
 * Filters the selectors that exclude a heading from the table of contents.
 *
 * A heading is skipped when it — or any ancestor — matches one of these selectors.
 *
 * @since 0.4.0
 *
 * @param string[] $default_exclude_selectors Array of selectors that exclude a heading.
 * @param array    $attributes                Block attributes.
 * @param WP_Block $block                     The block object.
 */
$exclude_selectors = apply_filters(
	'a8csp_dynamic_table_of_contents_exclude_selectors',
	$default_exclude_selectors,
	$attributes,
	$block
);

$custom_titles = ! empty( $attributes['customTitles'] ) && wpcomsp_dynamic_table_of_contents_allow_custom_titles();

wp_add_inline_script(
	'wpcomsp-dynamic-table-of-contents-view',
	sprintf(
		'window.wpcomspDynamicTOC=window.wpcomspDynamicTOC||{};window.wpcomspDynamicTOC.headingSelectors=%1$s;window.wpcomspDynamicTOC.includeNestedHeadings=%2$s;window.wpcomspDynamicTOC.excludeSelectors=%3$s;window.wpcomspDynamicTOC.customTitles=%4$s;',
		wp_json_encode( implode( ', ', $heading_selectors ) ),
		wp_json_encode( $include_nested_headings ),
		wp_json_encode( implode( ', ', $exclude_selectors ) ),
		wp_json_encode( $custom_titles )
	),
	'before'
);
?>

<div <?php echo wp_kses_post( get_block_wrapper_attributes() ); ?>>
	<?php
	$block_title = $attributes['title'] ?? '';
	$block_title = apply_filters( 'wpcomsp_dynamic_table_of_contents_block_title', $block_title, $attributes );

	if ( ! empty( $block_title ) ) {
		printf(
			'<h2>%s</h2>',
			wp_kses_post( $block_title )
		);
	}
	?>
	<ul></ul>
</div>
