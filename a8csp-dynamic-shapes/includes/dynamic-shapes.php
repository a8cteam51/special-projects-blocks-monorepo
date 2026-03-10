<?php
/**
 * Manages dynamic shape asset loading and filtering.
 *
 * @package a8csp-dynamic-shapes
 */

declare( strict_types=1 );

namespace A8CSPDynamicShapes;

defined( 'ABSPATH' ) || exit;

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_block_editor_assets' );
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_assets' );
add_filter( 'render_block', __NAMESPACE__ . '\filter_dynamic_shape_block', 10, 2 );

/**
 * Returns the blocks that support the dynamic shape feature.
 *
 * @return array<string> The blocks that support the dynamic shape feature.
 */
function get_dynamic_shapes_blocks(): array {
	$default_supported_blocks = array(
		'core/cover',
		'core/group',
		'core/image',
		'core/post-featured-image',
	);

	/**
	 * Filters the blocks that support the dynamic shape feature.
	 *
	 * @param array<string> $blocks The blocks that support the dynamic shape feature.
	 *
	 * @return array<string> The blocks that support the dynamic shape feature.
	 */
	return apply_filters( 'a8csp_dynamic_shapes_blocks', $default_supported_blocks );
}

/**
 * Checks if a value is a preset value.
 *
 * @param string $value The value to check.
 *
 * @return bool True if the value is a preset.
 */
function is_preset_value( string $value ): bool {
	return '' !== $value && str_contains( $value, 'var:preset|' );
}

/**
 * Parses a preset value and extracts its type and slug.
 *
 * @param string $preset_value The preset value (e.g., "var:preset|spacing|40").
 *
 * @return array{type: string, slug: string}|null Array with 'type' and 'slug' keys, or null if not a valid preset.
 */
function parse_preset_value( string $preset_value ): ?array {
	if ( '' === $preset_value ) {
		return null;
	}

	// Match the pattern: var:preset|{type}|{value}. phpcs:ignore Squiz.PHP.CommentedOutCode.Found
	if ( 1 === preg_match( '/^var:preset\|([^|]+)\|(.+)$/', $preset_value, $matches ) ) {
		return array(
			'type' => $matches[1],
			'slug' => $matches[2],
		);
	}

	return null;
}

/**
 * Converts a preset value to a CSS variable.
 *
 * Supports any preset type (e.g., spacing, shadow, color, etc.).
 *
 * @param string $preset_value The preset value (e.g., "var:preset|spacing|40" or "var:preset|shadow|small").
 *
 * @return string The CSS variable (e.g., "var(--wp--preset--spacing--40)" or "var(--wp--preset--shadow--small)").
 */
function preset_to_css_var( string $preset_value ): string {
	$parsed = parse_preset_value( $preset_value );

	if ( null !== $parsed ) {
		return "var(--wp--preset--{$parsed['type']}--{$parsed['slug']})";
	}

	// If it doesn't match the pattern, return as-is (might already be a CSS variable or invalid).
	return $preset_value;
}

/**
 * Gets the larger of two dynamic shape values, preserving the original format.
 *
 * @param string $left_value The left value.
 * @param string $right_value The right value.
 *
 * @return string The larger value in its original format (preset or pixel).
 */
function get_larger_dynamic_shape_value( string $left_value, string $right_value ): string {
	$left_pixels  = get_computed_pixel_value( $left_value );
	$right_pixels = get_computed_pixel_value( $right_value );

	return $left_pixels >= $right_pixels ? $left_value : $right_value;
}

/**
 * Parses a size value (from preset) and returns pixel value.
 *
 * @param string $size The size value to parse.
 *
 * @return int The pixel value.
 */
function parse_size_to_pixels( string $size ): int {
	if ( '' === $size ) {
		return 0;
	}

	// Handle clamp() values by extracting the minimum value.
	if ( str_contains( $size, 'clamp(' ) ) {
		// Extract the first value from clamp(min, preferred, max).
		preg_match( '/clamp\(\s*(\d+(?:\.\d+)?)px/', $size, $matches );
		return isset( $matches[1] ) ? (int) $matches[1] : 0;
	}

	// Handle rem values (convert to approximate pixels).
	if ( str_contains( $size, 'rem' ) ) {
		$rem_value = (float) $size;
		return (int) ( $rem_value * 16 ); // Approximate 1rem = 16px.
	}

	// Fallback to numeric value.
	return (int) $size;
}

/**
 * Gets the CSS size value for a spacing preset slug.
 *
 * @param string $slug The spacing preset slug.
 *
 * @return string The CSS size value, or empty string if not found.
 */
function get_spacing_preset_size( string $slug ): string {
	$theme_settings  = wp_get_global_settings();
	$spacing_presets = $theme_settings['spacing']['spacingSizes'] ?? array();
	$preset_sources  = $spacing_presets['theme'] ?? $spacing_presets['default'] ?? array();

	if ( ! is_array( $preset_sources ) ) {
		return '';
	}

	foreach ( $preset_sources as $preset ) {
		if ( isset( $preset['slug'] ) && $preset['slug'] === $slug ) {
			return $preset['size'] ?? '';
		}
	}

	return '';
}

/**
 * Gets the computed pixel value of a preset or regular value.
 *
 * @param string $value The value to compute.
 *
 * @return int The computed pixel value.
 */
function get_computed_pixel_value( string $value ): int {
	if ( '' === $value ) {
		return 0;
	}

	if ( is_numeric( $value ) || str_ends_with( $value, 'px' ) ) {
		return (int) $value;
	}

	$parsed = parse_preset_value( $value );
	if ( null === $parsed || 'spacing' !== $parsed['type'] ) {
		return 0;
	}

	return parse_size_to_pixels( get_spacing_preset_size( $parsed['slug'] ) );
}

/**
 * Gets a theme palette color.
 *
 * Browsers don't recognize CSS variables when applied inline on an SVG
 * set as an inline `background` property, so the hex value needs to be
 * parsed from the theme settings.
 *
 * @param string $slug Slug.
 *
 * @return string Color.
 */
function get_theme_palette_color( string $slug ): string {
	$theme_settings = wp_get_global_settings();
	$palette        = $theme_settings['color']['palette']['theme']
					?? $theme_settings['color']['palette']['default']
					?? array();

	foreach ( $palette as $color ) {
		if ( isset( $color['slug'] ) && $color['slug'] === $slug ) {
			return rawurlencode( $color['color'] );
		}
	}

	return rawurlencode( '#000000' );
}

/**
 * Normalizes and appends styles to existing inline styles.
 *
 * @param string|true|null $existing_styles Existing inline styles.
 * @param string           $new_style       New style to append.
 *
 * @return string Normalized combined styles.
 */
function append_inline_style( string|true|null $existing_styles, string $new_style ): string {
	// Normalize existing styles to always end with semicolon.
	$normalized = ( is_string( $existing_styles ) && '' !== $existing_styles )
		? rtrim( $existing_styles, ';' ) . ';'
		: '';

	return $normalized . $new_style;
}

/**
 * Updates block shadow output.
 *
 * The `filter` property can be leveraged to apply a drop shadow on the block
 * that follows the clipped path shape of the inner image.
 *
 * This works for all but the `outlined` style drop shadow,
 * perhaps owing to its use of two layers.
 *
 * @see https://css-tricks.com/using-box-shadows-and-clip-path-together/
 *
 * @param string $block_content Block content.
 * @param string $shadow        Shadow style.
 *
 * @return string Modified block content.
 */
function update_block_shadow( string $block_content, string $shadow ): string {
	$html = new \WP_HTML_Tag_Processor( $block_content );

	$html->next_tag();

	$shadow    = preset_to_css_var( $shadow );
	$new_style = append_inline_style( $html->get_attribute( 'style' ), "filter: drop-shadow($shadow);" );

	$html->set_attribute( 'style', $new_style );

	return $html->get_updated_html();
}

/**
 * Applies border color attributes to an HTML tag processor.
 *
 * @param \WP_HTML_Tag_Processor $html              The HTML tag processor.
 * @param string                 $border_color      The border color slug.
 * @param string                 $custom_border_color The custom border color value.
 *
 * @return void
 */
function apply_border_color_attributes( \WP_HTML_Tag_Processor $html, string $border_color, string $custom_border_color ): void {
	if ( '' !== $border_color ) {
		$html->remove_class( 'has-border-color' );
		$html->remove_class( "has-{$border_color}-border-color" );
		$html->set_attribute( 'data-border-color', get_theme_palette_color( $border_color ) );
	} elseif ( '' !== $custom_border_color ) {
		$html->remove_class( 'has-border-color' );
		$html->set_attribute( 'data-border-color', rawurlencode( $custom_border_color ) );
	} else {
		$html->set_attribute( 'data-border-color', 'currentcolor' );
	}
}

/**
 * Updates block border output.
 *
 * @param string               $block_content Block content.
 * @param array<string, mixed> $attrs         Block attributes.
 *
 * @return string Modified block content.
 */
function update_block_border( string $block_content, array $attrs ): string {
	$border_data = $attrs['style']['border'] ?? array();

	// Extract border widths.
	$border_width_keys = array( 'width', 'top', 'right', 'bottom', 'left' );
	$border_widths     = array_intersect_key( $border_data, array_flip( $border_width_keys ) );
	$border_widths     = array_filter(
		$border_widths,
		function ( mixed $value ): bool {
			return '' !== $value;
		}
	);

	if ( array() === $border_widths ) {
		return $block_content;
	}

	$html = new \WP_HTML_Tag_Processor( $block_content );
	$html->next_tag();

	// Handle border color.
	$border_color        = $attrs['borderColor'] ?? '';
	$custom_border_color = $border_data['color'] ?? '';
	apply_border_color_attributes( $html, $border_color, $custom_border_color );

	// Calculate border width (use 'width' if set, otherwise use 'top' width,
	// as SVG stroke can't accommodate different widths per side).
	$top_width = $border_widths['top'] ?? null;
	if ( isset( $border_widths['width'] ) ) {
		$border_width = $border_widths['width'];
	} elseif ( is_array( $top_width ) && isset( $top_width['width'] ) ) {
		$border_width = $top_width['width'];
	} elseif ( is_string( $top_width ) ) {
		$border_width = $top_width;
	} else {
		$border_width = '';
	}

	if ( '' === $border_width ) {
		return $block_content;
	}

	$html->set_attribute( 'data-border-width', $border_width );
	$html->add_class( 'dynamic-shape-has-border' );

	// Strip border styles from the current inline styles, preserving
	// non-border styles (e.g., filter from shadow processing), and
	// append the stroke-width custom property.
	$border_styles = wp_style_engine_get_styles( array( 'border' => $border_widths ) )['css'];
	$current_style = $html->get_attribute( 'style' );
	$style         = is_string( $current_style ) && '' !== $current_style
		? str_replace( $border_styles, '', $current_style )
		: '';
	$html->set_attribute( 'style', append_inline_style( $style, "--stroke-width: {$border_width};" ) );

	return $html->get_updated_html();
}

/**
 * Converts a dynamic shape value to a CSS value for padding calculation.
 *
 * @param string $value The dynamic shape value.
 *
 * @return string|null The CSS value or null if value is 0 or empty.
 */
function get_dynamic_shape_padding_value( string $value ): ?string {
	if ( '' === $value ) {
		return null;
	}

	$pixels = get_computed_pixel_value( $value );

	if ( $pixels <= 0 ) {
		return null;
	}

	return is_preset_value( $value )
		? preset_to_css_var( $value )
		: "{$pixels}px";
}

/**
 * Updates group block padding to account for dynamic shape and border.
 *
 * @param string               $block_content Block content.
 * @param array<string, mixed> $attrs         Block attributes.
 *
 * @return string Modified block content.
 */
function update_block_padding( string $block_content, array $attrs ): string {
	$html = new \WP_HTML_Tag_Processor( $block_content );
	$html->next_tag();

	$inline_styles = append_inline_style( $html->get_attribute( 'style' ), '' );
	$has_border    = str_contains( $inline_styles, '--stroke-width' );
	$padding       = $attrs['style']['spacing']['padding'] ?? array();
	$dynamic_shape = $attrs['dynamicShape'] ?? array();

	// Map sides to their dynamic shape keys.
	$side_shape_keys = array(
		'top'    => array( 'vtl', 'vtr' ),
		'bottom' => array( 'vbl', 'vbr' ),
		'left'   => array( 'htl', 'hbl' ),
		'right'  => array( 'htr', 'hbr' ),
	);

	$padding_style = '';

	foreach ( $side_shape_keys as $side => $shape_keys ) {
		$side_padding = array();

		// Add padding value if set.
		$side_padding_value = $padding[ $side ] ?? '';
		if ( ! in_array( $side_padding_value, array( '', '0', 0 ), true ) ) {
			$side_padding[] = preset_to_css_var( $side_padding_value );
		}

		// Add border width if present.
		if ( $has_border ) {
			$side_padding[] = 'var(--stroke-width, 0px)';
		}

		// Add dynamic shape offset value.
		$shape_value_1 = $dynamic_shape[ $shape_keys[0] ] ?? '';
		$shape_value_2 = $dynamic_shape[ $shape_keys[1] ] ?? '';
		$larger_value  = get_larger_dynamic_shape_value( $shape_value_1, $shape_value_2 );
		$shape_padding = get_dynamic_shape_padding_value( $larger_value );

		if ( null !== $shape_padding ) {
			$side_padding[] = $shape_padding;
		}

		// Build CSS calc() if we have any padding values.
		if ( array() !== $side_padding ) {
			$padding_style .= sprintf(
				'padding-%s: calc(%s);',
				$side,
				implode( ' + ', $side_padding )
			);
		}
	}

	if ( '' !== $padding_style ) {
		$html->set_attribute( 'style', $inline_styles . $padding_style );
		return $html->get_updated_html();
	}

	return $block_content;
}

/**
 * Enqueues block editor assets.
 *
 * @return void
 */
function enqueue_block_editor_assets(): void {
	Functions\enqueue_script( 'extend-blocks' );

	wp_add_inline_script(
		Functions\get_slug() . '-extend-blocks',
		'const a8cspDynamicShapeBlocks = ' . wp_json_encode(
			get_dynamic_shapes_blocks()
		) . ';',
		'before'
	);

	Functions\enqueue_style( 'dynamic-shape-controls' );
}

/**
 * Enqueues editor styles for the dynamic shape block.
 *
 * @return void
 */
function enqueue_block_assets(): void {
	if ( is_admin() ) {
		Functions\enqueue_style( 'dynamic-shape-blocks' );
	}
}

/**
 * Adds clip-path to image block visual children (img, overlay).
 *
 * Applied individually so filter: drop-shadow() on the figure
 * can follow the clipped shape.
 *
 * @param string $block_content Block content.
 *
 * @return string Modified block content.
 */
function clip_image_block_children( string $block_content ): string {
	$html = new \WP_HTML_Tag_Processor( $block_content );
	while ( $html->next_tag() ) {
		if (
			'IMG' === $html->get_tag() ||
			true === $html->has_class( 'wp-block-post-featured-image__overlay' )
		) {
			$current_style = $html->get_attribute( 'style' ) ?? '';
			$html->set_attribute( 'style', append_inline_style( $current_style, 'clip-path:var(--clip-path)' ) );
		}
	}

	return $html->get_updated_html();
}

/**
 * Injects a border overlay span before the block's closing tag.
 *
 * Renders the border SVG (set as --border-svg by JS) above
 * the block's content layers.
 *
 * @param string $block_content Block content.
 * @param bool   $is_image      Whether this is an image block.
 *
 * @return string Modified block content.
 */
function inject_border_overlay( string $block_content, bool $is_image ): string {
	$overlay     = '<span class="dynamic-shape-border-overlay" aria-hidden="true" style="background:var(--border-svg);clip-path:var(--clip-path);bottom:0;left:0;margin:0;pointer-events:none;position:absolute;right:0;top:0;z-index:2;"></span>';
	$closing_tag = $is_image ? '</figure>' : '</div>';
	$last_pos    = strrpos( $block_content, $closing_tag );

	if ( false !== $last_pos ) {
		$block_content = substr_replace( $block_content, $overlay, $last_pos, 0 );
	}

	return $block_content;
}

/**
 * Applies border-radius inline styles to the figure element.
 *
 * WordPress doesn't output border-radius on the figure for image
 * blocks, so we inject it so the front-end JS can read it via
 * getComputedStyle for clip-path and border SVG calculations.
 *
 * @param \WP_HTML_Tag_Processor $html  Tag processor positioned on the figure.
 * @param array<string, mixed>   $attrs Block attributes.
 *
 * @return void
 */
function apply_figure_border_radius( \WP_HTML_Tag_Processor $html, array $attrs ): void {
	$border_radius = $attrs['style']['border']['radius'] ?? null;
	if ( null === $border_radius ) {
		return;
	}

	$radius_css = wp_style_engine_get_styles( array( 'border' => array( 'radius' => $border_radius ) ) )['css'] ?? '';
	if ( '' === $radius_css ) {
		return;
	}

	$current_style = $html->get_attribute( 'style' ) ?? '';
	$html->set_attribute( 'style', append_inline_style( $current_style, $radius_css ) );
}

/**
 * Enqueues the front-end view script once per page load.
 *
 * @return void
 */
function maybe_enqueue_view_script(): void {
	static $enqueued = false;
	if ( $enqueued ) {
		return;
	}

	add_action(
		'wp_enqueue_scripts',
		function () {
			Functions\enqueue_script( 'view' );
		}
	);
	$enqueued = true;
}

/**
 * Filters dynamic shape style block HTML.
 *
 * @param string               $block_content Block content.
 * @param array<string, mixed> $block         Full block.
 *
 * @return string Modified block content.
 */
function filter_dynamic_shape_block( string $block_content, array $block ): string {
	$block_name = $block['blockName'];

	if ( ! in_array( $block_name, get_dynamic_shapes_blocks(), true ) ) {
		return $block_content;
	}

	$dynamic_shape = $block['attrs']['dynamicShape'] ?? null;
	if ( null === $dynamic_shape || array() === $dynamic_shape ) {
		return $block_content;
	}

	$is_image_block = in_array( $block_name, array( 'core/image', 'core/post-featured-image' ), true );
	$html           = new \WP_HTML_Tag_Processor( $block_content );
	$html->next_tag();
	$html->set_attribute( 'data-dynamic-shape', wp_json_encode( $dynamic_shape ) );

	if ( $is_image_block ) {
		apply_figure_border_radius( $html, $block['attrs'] );
	} else {
		$current_style = $html->get_attribute( 'style' ) ?? '';
		$html->set_attribute( 'style', append_inline_style( $current_style, 'clip-path:var(--clip-path)' ) );
	}

	$block_content = $html->get_updated_html();

	if ( $is_image_block ) {
		$block_content = clip_image_block_children( $block_content );
	}

	if ( '' !== ( $block['attrs']['style']['shadow'] ?? '' ) ) {
		$block_content = update_block_shadow( $block_content, $block['attrs']['style']['shadow'] );
	}

	if ( array() !== ( $block['attrs']['style']['border'] ?? array() ) ) {
		$block_content = update_block_border( $block_content, $block['attrs'] );
		$block_content = inject_border_overlay( $block_content, $is_image_block );
	}

	if ( $is_image_block ) {
		$block_content = (string) preg_replace( '/<figcaption[^>]*>.*?<\/figcaption>/s', '', $block_content );
	} else {
		$block_content = update_block_padding( $block_content, $block['attrs'] );
	}

	maybe_enqueue_view_script();

	return $block_content;
}
