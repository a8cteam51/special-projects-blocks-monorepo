<?php
/**
 * Render the block on the frontend.
 *
 * The following variables are exposed:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

if ( 'page' !== $block->context['postType'] ) {
	return;
}

$parent_page_id = wp_get_post_parent_id( $block->context['postId'] );

if ( false === $parent_page_id ) {
	return;
}

$sibling_pages = get_pages(
	array(
		'parent'      => $parent_page_id,
		'sort_column' => 'menu_order',
	)
);
?>
<div <?php echo wp_kses_post( get_block_wrapper_attributes() ); ?>>
	<ul>
		<?php foreach ( $sibling_pages as $sibling_page ) { ?>

			<?php if ( get_the_ID() === $sibling_page->ID ) { ?>
				<li>
					<?php echo wp_kses_post( $sibling_page->post_title ); ?>
				</li>
			<?php } else { ?>
				<li>
					<a href="<?php echo esc_url( get_permalink( $sibling_page->ID ) ); ?>">
						<?php echo wp_kses_post( $sibling_page->post_title ); ?>
					</a>
				</li>
			<?php } ?>

		<?php } ?>
	</ul>
</div>

