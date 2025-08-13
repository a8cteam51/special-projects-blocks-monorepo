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

$a8csp_blocks_modal_label = isset( $attributes['label'] ) ? esc_html( $attributes['label'] ) : null;
$a8csp_blocks_modal_slug  = isset( $attributes['modalSlug'] ) ? esc_attr( $attributes['modalSlug'] ) : null;

if ( ! $a8csp_blocks_modal_label || ! $a8csp_blocks_modal_slug ) {
	return null;
}

$a8csp_blocks_modal_button_classes = apply_filters( 'a8csp_blocks_modal_button_classes', array() );
$a8csp_blocks_modal_button_id      = wp_unique_id( '-button-' );
$a8csp_blocks_modal_button         = $a8csp_blocks_modal_slug . $a8csp_blocks_modal_button_id;

wp_interactivity_state(
	'a8csp/modal',
	array(
		'selected' => null,
	)
);

?>
<button
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => $a8csp_blocks_modal_button_classes ) ) ); ?>
	data-wp-interactive="a8csp/modal"
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'id'     => $a8csp_blocks_modal_slug,
				'button' => $a8csp_blocks_modal_button,
			)
		)
	);
	?>
	data-wp-on--click="actions.openModal"
	data-wp-bind--aria-expanded="state.isModalOpen"
	data-wp-on--keydown="actions.handleMenuKeydown"
	data-wp-on-async-document--click="callbacks.handleModalOutsideClick"
	id="<?php echo esc_attr( $a8csp_blocks_modal_button ); ?>"
	aria-haspopup="menu"
>
	<?php echo esc_html( $a8csp_blocks_modal_label ); ?>
</button>
