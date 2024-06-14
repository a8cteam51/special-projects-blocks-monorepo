<?php
$unique_id = wp_unique_id( 'p-' );
$heading_tag_opening = $attributes['level'] ? '<h' . esc_attr( $attributes['level'] ) . '>' : '<h3>';
$heading_tag_closing = $attributes['level'] ? '</h' . esc_attr( $attributes['level'] ) . '>' : '</h3>';
?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="wpsp-accordion"
	<?php echo wp_interactivity_data_wp_context( array( 'isOpen' => false ) ); ?>
	data-wp-watch="callbacks.logIsOpen"
>
    <?php echo $heading_tag_opening; ?>
        <button
            class="wpsp-accordion__button"
            data-wp-on--click="actions.toggle"
            data-wp-bind--aria-expanded="context.isOpen"
            aria-controls="<?php echo esc_attr( $unique_id ); ?>"
        >
            <span class="wpsp-accordion__title">
                <?php esc_html_e( $attributes['title'], 'wpsp-accordion-block' ); ?>
            </span>
        </button>
    <?php echo $heading_tag_closing; ?>

	<div
		id="<?php echo esc_attr( $unique_id ); ?>"
		data-wp-bind--hidden="!context.isOpen"
	>
        <?php echo $content ?>
	</div>
</div>
