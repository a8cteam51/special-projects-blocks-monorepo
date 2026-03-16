<?php

/**
 * Replaces the add-to-cart button with the add-to-cart overlay and a button that opens the overlay.
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

	// skip overlay if in the single product form
	$wptp = new WP_HTML_Tag_Processor( $block_content );
	if ( $wptp->next_tag( array( 'tag_name' => 'button', 'class_name' => 'single_add_to_cart_button' ) ) ) {
		$should_skip = true;
	}

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
	 * @param string     $add_to_cart_button_text Add-to-cart button text. Default `$product->single_add_to_cart_text`.
	 * @param WC_Product $product The product object.
	 * @param mixed[]    $block The full block, including name and attributes.
	 * @param WP_Block   $instance The block instance.
	 */
	$add_to_cart_button_text = apply_filters( 'a8csp_watco_add_to_cart_button_text', $product->single_add_to_cart_text(), $product, $block, $instance );

	$wptp = new WP_HTML_Tag_Processor( $block_content );

	// copy classes and styles from the button wrapper
	$button_wrapper_attrs   = '';
	$button_wrapper_classes = '';
	$button_wrapper_style   = '';
	if ( $wptp->next_tag( array( 'class_name' => 'wc-block-components-product-button' ) ) ) {
		$button_wrapper_classes = $wptp->get_attribute( 'class' );
		$button_wrapper_style   = $wptp->get_attribute( 'style' );
	}
	if ( '' !== $button_wrapper_classes ) {
		$button_wrapper_attrs .= ' class="' . esc_attr( $button_wrapper_classes ) . '"';
	}
	if ( '' !== $button_wrapper_style ) {
		$button_wrapper_attrs .= ' style="' . esc_attr( $button_wrapper_style ) . '"';
	}

	// copy classes and styles from the button
	$button_attrs   = '';
	$button_classes = 'watco-add-to-cart-button ';
	$button_style   = '';
	if ( $wptp->next_tag( array( 'class_name' => 'wc-block-components-product-button__button' ) ) ) {
		$button_classes .= $wptp->get_attribute( 'class' );
		$button_style    = $wptp->get_attribute( 'style' );
	}
	if ( '' !== $button_classes ) {
		$button_attrs .= ' class="' . esc_attr( $button_classes ) . '"';
	}
	if ( '' !== $button_style ) {
		$button_attrs .= ' style="' . esc_attr( $button_style ) . '"';
	}

	// get overlay HTML
	$overlay_content = a8csp_watco_blocks_render_add_to_cart_form( $product_id );

	//build container with overlay and button
	$form = sprintf(
		'<div class="watco" data-product-id="%1$d">%2$s<div %3$s><button %4$s>%5$s</button></div></div>',
		$product->get_id(),
		$overlay_content,
		$button_wrapper_attrs,
		$button_attrs,
		esc_html( $add_to_cart_button_text ),
	);

	/**
	 * Allows the user to keep the original add-to-cart button for this product.
	 *
	 * @param boolean    $should_keep_button True to keep the button. Default false.
	 * @param WC_Product $product The product object.
	 * @param mixed[]    $block The full block, including name and attributes.
	 * @param WP_Block   $instance The block instance.
	 */
	$should_keep_button = apply_filters( 'a8csp_watco_should_keep_button', false, $product, $block, $instance );

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

	// add scripts to enqueue - Back in stock notification
	add_filter( 'woocommerce_bis_should_enqueue_scripts', '__return_true' );

	// before rendering add-to-cart form
	do_action( 'a8csp_watco_before_add_to_cart_form' );

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
	 * Allows the user to add CSS classes to the overlay for this product.
	 *
	 * @param string     $overlay_classes CSS classes.
	 * @param WC_Product $product The product object.
	 */
	$overlay_classes = apply_filters( 'a8csp_watco_overlay_classes', '', $product );

	$wrapper_attributes = 'class="watco__overlay ' . esc_attr( $overlay_classes ) . '"';

	// reset global product
	//phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$product = $original_product;

	/**
	 * Allows the user to overwrite or skip the link to the single product in the overlay for this product.
	 * Set to null|false to skip adding the link.
	 *
	 * @param string|false $link_text The text of the link to the product page or false or an empty string to skip adding the link.
	 * @param WC_Product   $product The product object.
	 */
	$link_text = apply_filters( 'a8csp_watco_single_product_link_text', esc_html__( 'View Full Details', 'a8csp-watco' ), $product );

	$product_link = '';

	if ( is_string( $link_text ) && strlen( $link_text ) ) {
		$product_link = sprintf(
			'<a class="watco__product-link" href="%1$s">%2$s</a>',
			get_permalink( $product->get_id() ),
			$link_text,
		);
	}

	return sprintf(
		'<div %1$s inert><div class="watco__content">%2$s<button class="watco__close" aria-label="%3$s"></button>%4$s</div></div>',
		$wrapper_attributes,
		$product_link,
		esc_html__( 'Close this overlay', 'a8csp-watco' ),
		$content
	);
}
