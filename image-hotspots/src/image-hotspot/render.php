<?php
/**
 * Renders one Hotspot: a list item at the marker's point, holding the marker
 * button and the card it opens.
 *
 * The list item carries the block's wrapper attributes, so its colour and
 * typography settings reach the card. Its context holds the hotspot's `id`,
 * which the store compares with `state.openId`.
 *
 * Variables exposed by `render_block()`:
 *
 * @var array    $attributes The block attributes.
 * @var string   $content    The card's rendered inner blocks.
 * @var WP_Block $block      The block instance.
 *
 * @package wpcomsp
 */

$a8csp_ihs_label = isset( $attributes['label'] ) ? trim( wp_strip_all_tags( (string) $attributes['label'] ) ) : '';
if ( '' === $a8csp_ihs_label ) {
	$a8csp_ihs_label = __( 'Hotspot', 'image-hotspots' );
}

$a8csp_ihs_x        = isset( $attributes['x'] ) ? max( 0, min( 100, round( (float) $attributes['x'], 1 ) ) ) : 50;
$a8csp_ihs_y        = isset( $attributes['y'] ) ? max( 0, min( 100, round( (float) $attributes['y'], 1 ) ) ) : 50;
$a8csp_ihs_anchor   = ( isset( $attributes['anchorPoint'] ) && 'bottom' === $attributes['anchorPoint'] ) ? 'bottom' : 'center';
$a8csp_ihs_position = ( isset( $attributes['cardPosition'] ) && in_array( $attributes['cardPosition'], array( 'auto', 'above', 'below', 'left', 'right' ), true ) ) ? $attributes['cardPosition'] : 'auto';

$a8csp_ihs_id        = wp_unique_id( 'a8csp-image-hotspot-' );
$a8csp_ihs_marker_id = $a8csp_ihs_id . '-marker';
$a8csp_ihs_card_id   = $a8csp_ihs_id . '-card';

/**
 * Filters the attributes of a hotspot's marker button.
 *
 * The defaults make it a disclosure button: `aria-expanded` follows the
 * card, and `aria-controls` points at it. The `data-wp-*` attributes are the
 * Interactivity API directives that open and close the card.
 *
 * @param array    $marker_attributes The button's attributes.
 * @param array    $attributes        The block attributes.
 * @param WP_Block $block             The block instance.
 */
$a8csp_ihs_marker_attributes = apply_filters(
	'a8csp_image_hotspots_marker_attributes',
	array(
		'type'                        => 'button',
		'id'                          => $a8csp_ihs_marker_id,
		'class'                       => 'wp-block-a8csp-image-hotspots__marker',
		'aria-expanded'               => 'false',
		'aria-controls'               => $a8csp_ihs_card_id,
		'data-wp-on--click'           => 'actions.toggle',
		'data-wp-bind--aria-expanded' => 'state.isOpen',
	),
	$attributes,
	$block
);

/**
 * Filters what is inside a hotspot's marker button.
 *
 * By default, an empty icon element for the theme to style and the label,
 * visually hidden, which names the button. Keep the label, or give the
 * button an `aria-label` with the `a8csp_image_hotspots_marker_attributes`
 * filter. The result is passed through `wp_kses()` with the post allowlist
 * plus inline SVG.
 *
 * @param string   $marker_content The button's inner HTML.
 * @param string   $label          The hotspot's label.
 * @param array    $attributes     The block attributes.
 * @param WP_Block $block          The block instance.
 */
$a8csp_ihs_marker_content = apply_filters(
	'a8csp_image_hotspots_marker_content',
	sprintf(
		'<span class="wp-block-a8csp-image-hotspots__marker-icon" aria-hidden="true"></span><span class="wp-block-a8csp-image-hotspots__marker-label">%s</span>',
		esc_html( $a8csp_ihs_label )
	),
	$a8csp_ihs_label,
	$attributes,
	$block
);

/**
 * Filters the attributes of a hotspot's card.
 *
 * The card is `hidden` until its marker opens it. `data-wp-watch` places it
 * next to the marker while it is open.
 *
 * @param array    $card_attributes The card's attributes.
 * @param array    $attributes      The block attributes.
 * @param WP_Block $block           The block instance.
 */
$a8csp_ihs_card_attributes = apply_filters(
	'a8csp_image_hotspots_card_attributes',
	array(
		'id'                   => $a8csp_ihs_card_id,
		'class'                => 'wp-block-a8csp-image-hotspots__card',
		'hidden'               => true,
		'data-wp-bind--hidden' => '!state.isOpen',
		'data-wp-watch'        => 'callbacks.placeCard',
	),
	$attributes,
	$block
);

$a8csp_ihs_wrapper = get_block_wrapper_attributes(
	array(
		'class'              => 'is-anchor-' . $a8csp_ihs_anchor,
		// number_format(): a locale's decimal comma would break the CSS.
		'style'              => sprintf( '--a8csp-image-hotspots-x:%1$s%%;--a8csp-image-hotspots-y:%2$s%%;', number_format( $a8csp_ihs_x, 1, '.', '' ), number_format( $a8csp_ihs_y, 1, '.', '' ) ),
		'data-card-position' => $a8csp_ihs_position,
	)
);

ob_start();
?>
<li
	<?php echo wp_kses_data( $a8csp_ihs_wrapper ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'id' => $a8csp_ihs_id ) ) ); ?>
	data-wp-class--is-open="state.isOpen"
	data-wp-on--pointerenter="actions.openOnHover"
	data-wp-on--pointerleave="actions.closeOnLeave"
	data-wp-on--focusout="actions.closeOnFocusOut"
>
	<button<?php echo a8csp_image_hotspots_attributes_string( $a8csp_ihs_marker_attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Every value is escaped by the helper. ?>><?php echo wp_kses( $a8csp_ihs_marker_content, a8csp_image_hotspots_marker_allowed_html() ); ?></button>
	<div<?php echo a8csp_image_hotspots_attributes_string( $a8csp_ihs_card_attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Every value is escaped by the helper. ?>>
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered inner blocks, each escaped by its own block. ?>
	</div>
</li>
<?php
$a8csp_ihs_html = (string) ob_get_clean();

/**
 * Filters the whole markup of one hotspot: the list item, its marker and
 * its card.
 *
 * @param string   $html       The hotspot's markup.
 * @param array    $attributes The block attributes.
 * @param WP_Block $block      The block instance.
 */
echo apply_filters( 'a8csp_image_hotspots_hotspot_html', $a8csp_ihs_html, $attributes, $block ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built and escaped above; a filter returns trusted markup.
