<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Don't render this block if it's not in the context of a post.
if ( ! isset( $block->context['postId'] ) ) {
	return;
}

// WPCom is having trouble enqueueing view.js for this block, so doing it here.
$asset_deps = require trailingslashit( plugin_dir_path( __FILE__ ) ) . 'view.asset.php';

wp_enqueue_script(
	'wpsp-dynamic-table-of-contents-view',
	plugins_url( 'view.js', __FILE__ ),
	$asset_deps['dependencies'],
	$asset_deps['version'],
	true
);
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php
	if ( isset( $attributes['title'] ) && ! empty( $attributes['title'] ) ) {
		printf(
			'<h2>%s</h2>',
			wp_kses_post( $attributes['title'] )
		);
	}
	?>
	<ul></ul>
</div>