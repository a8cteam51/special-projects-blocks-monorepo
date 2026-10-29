<?php
/**
 * Server-side render for the Photo Carousel block.
 *
 * Thin wrapper around newspack_photo_carousel_render_block(); the logic lives
 * in includes/render-helpers.php, which is loaded once, so its functions are
 * never redeclared when several carousels render on one page.
 *
 * @package wpcomsp
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block markup (unused; the render reads each image block).
 * @var WP_Block $block      Block instance.
 */

echo newspack_photo_carousel_render_block( $attributes, $content, $block ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped as it is built.
