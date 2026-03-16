=== WooCommerce Add To Cart Overlay ===
Contributors:      wpspecialprojects
Tags:              woo, woocommerce, add to cart, overlay
Tested up to:      6.9.1
Stable tag:        0.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.8
Requires PHP:      8.1

Replaces the default add-to-cart button with a button that opens an overlay showing the add-to-cart form.

== Description ==

The **WooCommerce Add To Cart Overlay** plugin extends WordPress functionality to add a 'quick buy' overlay when clicking on the add-to-cart button.

== Installation ==

1. Upload the `woo-add-to-cart-overlay` folder to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress


**How It Works:**

- When the plugin is activated, the WooCommerce add-to-cart button is replaced with a button that opens an overlay showing the add-to-cart form.
- The plugin replicates the appearance of the default add-to-cart button. Edit the button in the editor to change the button's appearance.
- The overlay opens at the bottom of the screen for mobile views and above the add-to-cart button for larger screens.
- The overlay has a close button that closes the overlay and a link to the product page.

**Notes:**

##Actions

Before the add-to-cart-form in the overlay is rendered.
```php
do_action( 'a8csp_watco_before_add_to_cart_form' );
```

Before the add-to-cart-form in the overlay is rendered.
```php
do_action( 'a8csp_watco_after_add_to_cart_form' );
````

== Filters ==

Skip adding the overlay.
```php
/**
 * Allows the user to skip adding the add-to-cart-overlay for this product.
 *
 * @param boolean    $should_skip True to skip adding the overlay, false otherwise.
 * @param WC_Product $product The product object.
 * @param mixed[]    $block The full block, including name and attributes.
 * @param WP_Block   $instance The block instance.
 */
$should_skip = apply_filters( 'a8csp_watco_should_skip', $should_skip, $product, $block, $instance );
````

Change the text of the add-to-cart button.
```php
/**
 * Overwrite the text of the button that opens the add to cart overlay for this product.
 *
 * @param string     $add_to_cart_button_text Add-to-cart button text. Default `$product->single_add_to_cart_text`.
 * @param WC_Product $product The product object.
 * @param mixed[]    $block The full block, including name and attributes.
 * @param WP_Block   $instance The block instance.
 */
$add_to_cart_button_text = apply_filters( 'a8csp_watco_add_to_cart_button_text', $product->single_add_to_cart_text(), $product, $block, $instance );
```

Keep the original add-to-cart button. Placed after the overlay button.
```php
/**
 * Allows the user to keep the original add-to-cart button for this product.
 *
 * @param boolean    $should_keep_button True to keep the button. Default false.
 * @param WC_Product $product The product object.
 * @param mixed[]    $block The full block, including name and attributes.
 * @param WP_Block   $instance The block instance.
 */
$should_keep_button = apply_filters( 'a8csp_watco_should_keep_button', false, $product, $block, $instance );
```

Add CSS classes to the overlay.
```php
/**
 * Allows the user to add CSS classes to the overlay for this product.
 *
 * @param string     $overlay_classes CSS classes.
 * @param WC_Product $product The product object.
 */
$overlay_classes = apply_filters( 'a8csp_watco_overlay_classes', '', $product );
```

Change or remove the text of the link to the single product in the overlay.
```php
/**
 * Allows the user to overwrite or skip the link to the single product in the overlay for this product.
 * Set to null|false to skip adding the link.
 *
 * @param string|false $link_text The text of the link to the product page or false or an empty string to skip adding the link.
 * @param WC_Product   $product The product object.
 */
$link_text = apply_filters( 'a8csp_watco_single_product_link_text', esc_html__( 'View Full Details', 'a8csp-watco' ), $product );
```

== CSS styles and classes ==

The plugin includes basic styles to toggle and position the overlay and the close button.

The HTML structure is as follows:

```
- watco
  - watco__overlay
    - watco__close
    - watco__content
    - cart
  - wp-block-woocommerce-product-button
    - watco-add-to-cart-button wc-block-components-product-button__button
```

By default, the overlay opens at the bottom of the screen for mobile views and above the add-to-cart button for larger screens.
By default, the overlay opens at the bottom of the screen for mobile views and above the add-to-cart button for larger screens.

By adding the class `watco--style-modal` to the overlay, it will open as a modal.


== Changelog ==

= 0.1.0 =
* Initial release
