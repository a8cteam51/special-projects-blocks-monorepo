<?php
/**
 * Renders the Image Hotspots block: the image, and the hotspots over it.
 *
 * The block is the Interactivity API region `a8csp/image-hotspots`. Its
 * context holds `openOn` ("click" or "hover") and `closeDelay` (milliseconds
 * before a card opened by hover closes once the pointer leaves). Which card
 * is open lives in the store's state, `state.openId`, so only one card on
 * the page is open at a time.
 *
 * Variables exposed by `render_block()`:
 *
 * @var array    $attributes The block attributes.
 * @var string   $content    The rendered Hotspot blocks.
 * @var WP_Block $block      The block instance.
 *
 * @package wpcomsp
 */

$a8csp_ih_image_id = isset( $attributes['id'] ) ? absint( $attributes['id'] ) : 0;
$a8csp_ih_url      = isset( $attributes['url'] ) ? (string) $attributes['url'] : '';
$a8csp_ih_alt      = isset( $attributes['alt'] ) ? (string) $attributes['alt'] : '';
$a8csp_ih_size     = ! empty( $attributes['sizeSlug'] ) ? sanitize_key( $attributes['sizeSlug'] ) : 'large';
$a8csp_ih_open_on  = ( isset( $attributes['openOn'] ) && 'hover' === $attributes['openOn'] ) ? 'hover' : 'click';

/**
 * Filters the attributes of the Image Hotspots image.
 *
 * With an attachment, these are passed to `wp_get_attachment_image()`, which
 * adds `src`, `srcset`, `sizes`, `width`, `height` and loading attributes.
 *
 * @param array    $image_attributes The image's attributes.
 * @param array    $attributes       The block attributes.
 * @param WP_Block $block            The block instance.
 */
$a8csp_ih_image_attributes = apply_filters(
	'a8csp_image_hotspots_image_attributes',
	array(
		'class' => 'wp-block-a8csp-image-hotspots__image',
		'alt'   => $a8csp_ih_alt,
	),
	$attributes,
	$block
);

$a8csp_ih_image = '';

if ( $a8csp_ih_image_id && wp_attachment_is_image( $a8csp_ih_image_id ) ) {
	$a8csp_ih_image = wp_get_attachment_image( $a8csp_ih_image_id, $a8csp_ih_size, false, $a8csp_ih_image_attributes );
}

if ( '' === $a8csp_ih_image && '' !== $a8csp_ih_url ) {
	// An image by URL has no known size, so it is not lazy-loaded: the
	// browser could not reserve its space.
	$a8csp_ih_image = sprintf(
		'<img src="%1$s"%2$s />',
		esc_url( $a8csp_ih_url ),
		a8csp_image_hotspots_attributes_string(
			array_merge(
				array( 'decoding' => 'async' ),
				$a8csp_ih_image_attributes
			)
		)
	);
}

/**
 * Filters the markup of the Image Hotspots image.
 *
 * @param string   $image      The image's `<img>` markup.
 * @param array    $attributes The block attributes.
 * @param WP_Block $block      The block instance.
 */
$a8csp_ih_image = apply_filters( 'a8csp_image_hotspots_image_html', $a8csp_ih_image, $attributes, $block );

if ( '' === trim( (string) $a8csp_ih_image ) ) {
	// Nothing to show without an image.
	return;
}

/**
 * Filters the Interactivity API context of an Image Hotspots block.
 *
 * The context holds `openOn` ("click" or "hover") and `closeDelay`, the
 * milliseconds before a card opened by hover closes once the pointer has
 * left it.
 *
 * @param array    $context    The context.
 * @param array    $attributes The block attributes.
 * @param WP_Block $block      The block instance.
 */
$a8csp_ih_context = apply_filters(
	'a8csp_image_hotspots_context',
	array(
		'openOn'     => $a8csp_ih_open_on,
		'closeDelay' => 300,
	),
	$attributes,
	$block
);

wp_interactivity_state(
	'a8csp/image-hotspots',
	array(
		'openId'   => '',
		'openedBy' => '',
		'isOpen'   => false,
	)
);

$a8csp_ih_wrapper = get_block_wrapper_attributes(
	array(
		'class' => 'is-open-on-' . $a8csp_ih_open_on,
	)
);

$a8csp_ih_has_hotspots = '' !== trim( (string) $content );
?>
<div
	<?php echo wp_kses_data( $a8csp_ih_wrapper ); ?>
	data-wp-interactive="a8csp/image-hotspots"
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $a8csp_ih_context ) ); ?>
	data-wp-on-document--pointerdown="callbacks.closeOnOutsidePointer"
	data-wp-on-document--keydown="callbacks.closeOnEscape"
>
	<div class="wp-block-a8csp-image-hotspots__canvas">
		<?php echo wp_kses( $a8csp_ih_image, a8csp_image_hotspots_image_allowed_html() ); ?>
		<?php if ( $a8csp_ih_has_hotspots ) : ?>
			<ul class="wp-block-a8csp-image-hotspots__markers" role="list">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered inner blocks, each escaped by its own block. ?>
			</ul>
		<?php endif; ?>
	</div>
</div>
