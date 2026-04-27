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

$default_heading_selectors = array(
	'.wp-block-post-content h1',
	'.wp-block-post-content h2',
	'.wp-block-post-content h3',
	'.wp-block-post-content h4',
	'.wp-block-post-content h5',
	'.wp-block-post-content h6',
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

wp_add_inline_script(
	'wpcomsp-dynamic-table-of-contents-view',
	sprintf(
		'window.wpcomspDynamicTOC=window.wpcomspDynamicTOC||{};window.wpcomspDynamicTOC.headingSelector=%s;',
		wp_json_encode( implode( ', ', $heading_selectors ) )
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
