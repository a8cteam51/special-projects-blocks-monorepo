<?php

/**
 * Replaces the add to cart button with the add to cart over lay and a button that opens the overlay.
 *
 * @param string   $block_content The block content.
 * @param mixed[]  $block         The full block, including name and attributes.
 * @param WP_Block $instance      The full block, including name and attributes.
 *
 * @return string
 */
function a8csp_watco_render_add_to_cart_button( $block_content, $block, $instance ) {

	$product_id = $instance->context['postId'];

	if ( ! $product_id ) {
		return $block_content;
	}

	$product = wc_get_product( $product_id );

	if ( ! ( $product instanceof WC_Product ) ) {
		return $block_content;
	}

	$should_skip = ! $product->is_in_stock();

	/**
	 * Allows the user to skip adding the add-to-cart-overlay for this product.
	 *
	 * @param boolean    $should_skip True to skip adding the overlay, false otherwise.
	 * @param WC_Product $product The product object.
	 * @param mixed[]    $block The full block, including name and attributes.
	 * @param WP_Block   $instance The block instance.
	 */
	$should_skip = apply_filters( 'a8csp_watco_should_skip', $should_skip, $product, $block, $instance );

	if ( true === $should_skip ) {
		return $block_content;
	}

	/**
	 * Overwrite the text of the button that opens the add to cart overlay for this product.
	 *
	 * @param string     $add_to_cart_button_text Add to cart button text. Default `$product->single_add_to_cart_text`.
	 * @param WC_Product $product The product object.
	 * @param mixed[]    $block The full block, including name and attributes.
	 * @param WP_Block   $instance The block instance.
	 */
	$add_to_cart_button_text = apply_filters( 'a8csp_watco_add_to_cart_button_text', $product->single_add_to_cart_text(), $product, $block, $instance );

	$form  = '<div class="watco" data-product-id="' . $product->get_id() . '">';
	$form .= a8csp_watco_blocks_render_add_to_cart_form( $product_id );
	$form .= '<button class="watco-add-to-cart-button wp-element-button">' . esc_html( $add_to_cart_button_text ) . '</button>';
	$form .= '</div>';

	/**
	 * Allows the user to keep the original add to cart button for this product.
	 *
	 * @param boolean    $should_keep_button True to skip adding the overlay, false otherwise.
	 * @param WC_Product $product The product object.
	 * @param mixed[]    $block The full block, including name and attributes.
	 * @param WP_Block   $instance The block instance.
	 */
	$should_keep_button = apply_filters( 'a8csp_watco_should_skip', true, $product, $block, $instance );

	return $form . ( $should_keep_button ? $block_content : '' );
}
add_filter( 'render_block_woocommerce/product-button', 'a8csp_watco_render_add_to_cart_button', 20, 3 );

/**
 * Render add to cart form for variable products.
 *
 * @param integer $product_id Product id.
 *
 * @return string
 */
function a8csp_watco_blocks_render_add_to_cart_form( $product_id ) {

	//phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	global $product;

	$original_product = $product;

	//phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$product = wc_get_product( $product_id );

	if ( ! $product instanceof \WC_Product ) {
		//phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
		$product = $original_product;

		return '';
	}

	// before rendering add-to-cart form
	do_action( 'a8csp_watco_before_add_to_cart_form' );

	// add scripts to enqueue - Back in stock notification
	add_filter( 'woocommerce_bis_should_enqueue_scripts', '__return_true' );

	ob_start();

	/**
	 * Trigger the single product add to cart action for each product type.
	 *
	 * @since 9.7.0
	 */
	//phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	do_action( 'woocommerce_' . $product->get_type() . '_add_to_cart' );

	$content = ob_get_clean();

	// after rendering add-to-cart-form
	do_action( 'a8csp_watco_after_add_to_cart_form' );

	/**
	 * Allows the user to overwrite or skip the link to the single product in the overlay for this product.
	 * Set to null|false to skip adding the link.
	 *
	 * @param string     $overlay_classes CSS classes.
	 * @param WC_Product $product The product object.
	 */
	$overlay_classes = apply_filters( 'a8csp_watco_overlay_classes', 'watco-overlay watco-overlay-' . $product->get_type(), $product );

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $overlay_classes ) );

	// reset global product
	//phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$product = $original_product;

	/**
	 * Allows the user to overwrite or skip the link to the single product in the overlay for this product.
	 * Set to null|false to skip adding the link.
	 *
	 * @param string|boolean|null $link_text True to skip adding the overlay, false otherwise.
	 * @param WC_Product          $product The product object.
	 */
	$link_text = apply_filters( 'a8csp_watco_single_product_link_text', esc_html__( 'View Full Details', 'a8csp-watco' ), $product );

	$product_link = '';

	if ( null !== $link_text && false !== $link_text ) {
		$product_link = sprintf(
			'<a class="watco__product-link" href="%1$s">%2$s</a>',
			get_permalink( $product->get_id() ),
			$link_text,
		);
	}

	return sprintf(
		'<div %1$s inert><div class="watco-overlay__content">%2$s<button class="watco__close" aria-label="%3$s"></button>%4$s</div></div>',
		$wrapper_attributes,
		$product_link,
		esc_html__( 'Close this overlay', 'a8csp-watco' ),
		$content
	);
}
