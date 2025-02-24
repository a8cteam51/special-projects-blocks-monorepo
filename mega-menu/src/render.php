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

$mega_menu_extra_block_wrapper_attributes = apply_filters( 'a8csp_mega_menu_extra_block_wrapper_attributes', array() );
$mega_menu_button_classes                 = apply_filters( 'a8csp_mega_menu_button_classes', array() );
$mega_menu_container_classes              = apply_filters( 'a8csp_mega_menu_container_classes', array( 'wp-block-a8csp-mega-menu__menu-container' ) );

wp_interactivity_state(
	'a8csp/mega-menu',
	array(
		'selected' => null,
	)
);

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
>
	<button
		data-wp-on--click="actions.toggleMenu"
		data-wp-bind--aria-expanded="state.isOpen"
		data-wp-on--keydown="actions.handleMenuKeydown"
		id="<?php echo esc_attr( $mega_menu_blocks_unique_button ); ?>"
		aria-haspopup="menu"
		role="button"
		aria-controls="<?php echo esc_attr( $mega_menu_blocks_unique_id ); ?>"
		data-wp-class--active="state.isOpen"
		class="<?php echo esc_attr( implode( ' ', $mega_menu_button_classes ) ); ?>"
	>
		<?php echo esc_html( $mega_menu_blocks_label ); ?>
	</button>
	<div
		class="<?php echo esc_attr( implode( ' ', $mega_menu_container_classes ) ); ?>"
		id="<?php echo esc_attr( $mega_menu_blocks_unique_id ); ?>"
		data-wp-on--keydown="actions.handleMenuKeydown"
		aria-labelledby="<?php echo esc_attr( $mega_menu_blocks_unique_button ); ?>"
	>
		<?php block_template_part( $mega_menu_blocks_menu_slug ); ?>
	</div>
</li>
