<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$mega_menu_blocks_label     = isset( $attributes['label'] ) ? esc_html( $attributes['label'] ) : esc_html__( 'Menu', 'mega-menu' );
$mega_menu_blocks_menu_slug = isset( $attributes['menuSlug'] ) ? esc_attr( $attributes['menuSlug'] ) : null;

if ( ! $mega_menu_blocks_menu_slug ) {
	return null;
}

$mega_menu_blocks_unique_id     = wp_unique_id( 'mega-menu-' );
$mega_menu_blocks_unique_button = wp_unique_id( 'mega-menu-btn-' );
$mega_menu_open_on_hover        = ! empty( $attributes['openOnHover'] );

$mega_menu_extra_block_wrapper_attributes = apply_filters( 'a8csp_mega_menu_extra_block_wrapper_attributes', array() );
$mega_menu_button_classes                 = apply_filters( 'a8csp_mega_menu_button_classes', array() );
$mega_menu_container_classes              = apply_filters( 'a8csp_mega_menu_container_classes', array( 'wp-block-a8csp-mega-menu__menu-container' ) );

wp_interactivity_state(
	'a8csp/mega-menu',
	array(
		'selected' => null,
	)
);

/*
 * The panel is hidden until it is opened, so its images must not use up the
 * page's eager-loading slots or take its high fetch priority. They are marked
 * as core marks the Navigation overlay's images, with fetchpriority="low". The
 * filter covers images rendered while the panel renders; the attribute covers
 * images that the enclosing template part's content filter processes later.
 */
$mega_menu_low_priority_images = static function ( $loading_attrs, $tag_name ) {
	return 'img' === $tag_name ? array(
		'decoding'      => 'async',
		'fetchpriority' => 'low',
	) : $loading_attrs;
};

add_filter( 'pre_wp_get_loading_optimization_attributes', $mega_menu_low_priority_images, 10, 2 );
ob_start();
block_template_part( $mega_menu_blocks_menu_slug );
$mega_menu_panel = ob_get_clean();
remove_filter( 'pre_wp_get_loading_optimization_attributes', $mega_menu_low_priority_images, 10 );

$mega_menu_panel_tags = new WP_HTML_Tag_Processor( $mega_menu_panel );
while ( $mega_menu_panel_tags->next_tag( 'IMG' ) ) {
	$mega_menu_panel_tags->set_attribute( 'fetchpriority', 'low' );
}
$mega_menu_panel = $mega_menu_panel_tags->get_updated_html();

?>
<li
	<?php echo wp_kses_data( get_block_wrapper_attributes( $mega_menu_extra_block_wrapper_attributes ) ); ?>
	data-wp-interactive="a8csp/mega-menu"
	<?php
		echo wp_kses_data(
			wp_interactivity_data_wp_context(
				array(
					'id'     => $mega_menu_blocks_unique_id,
					'button' => $mega_menu_blocks_unique_button,
				)
			)
		);
		?>
	<?php if ( $mega_menu_open_on_hover ) : ?>
	data-wp-on--mouseenter="actions.openOnHover"
	data-wp-on--mouseleave="actions.closeOnHover"
	<?php endif; ?>
>
	<button
		data-wp-on--click="actions.toggleMenu"
		data-wp-bind--aria-expanded="state.isOpen"
		id="<?php echo esc_attr( $mega_menu_blocks_unique_button ); ?>"
		aria-haspopup="menu"
		role="button"
		aria-controls="<?php echo esc_attr( $mega_menu_blocks_unique_id ); ?>"
		data-wp-class--active="state.isOpen"
		class="<?php echo esc_attr( implode( ' ', $mega_menu_button_classes ) ); ?>"
		data-wp-on-async-document--click="callbacks.handleModalOutsideClick"
		data-wp-on-async-document--keydown="actions.handleMenuKeydown"
	>
		<?php echo esc_html( $mega_menu_blocks_label ); ?>
	</button>
	<div
		class="<?php echo esc_attr( implode( ' ', $mega_menu_container_classes ) ); ?>"
		id="<?php echo esc_attr( $mega_menu_blocks_unique_id ); ?>"
		aria-labelledby="<?php echo esc_attr( $mega_menu_blocks_unique_button ); ?>"
	>
		<?php echo $mega_menu_panel; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered block HTML. ?>
	</div>
</li>
