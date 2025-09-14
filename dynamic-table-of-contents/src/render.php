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
?>

<?php
// Prepare data attributes for heading levels
$heading_levels     = array();
$heading_attributes = array( 'includeH1', 'includeH2', 'includeH3', 'includeH4', 'includeH5', 'includeH6' );

foreach ( $heading_attributes as $heading_attr ) {
	if ( isset( $attributes[ $heading_attr ] ) && true === $attributes[ $heading_attr ] ) {
		$heading_level    = strtolower( str_replace( 'include', '', $heading_attr ) );
		$heading_levels[] = $heading_level;
	}
}

$data_attributes = array(
	'data-heading-levels' => esc_attr( implode( ',', $heading_levels ) ),
);

$wrapper_attributes = get_block_wrapper_attributes( $data_attributes );
?>

<div <?php echo wp_kses_post( $wrapper_attributes ); ?>>
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
