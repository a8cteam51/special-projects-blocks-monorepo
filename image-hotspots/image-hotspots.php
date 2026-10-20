<?php
/**
 * Plugin Name:       Image Hotspots
 * Description:       Places hotspot markers on an image from the media library. Each marker is a button at a point on the image, stored as a percentage so it stays put at every width, and it opens a card of any blocks, such as an image, a heading with a link and a button. In the editor, markers are added by clicking the image, moved by dragging or with the arrow keys, and listed by name in List View. On the front end, built with the Interactivity API, cards open on click, tap or hover, close with Escape, an outside click or when focus leaves, and stay inside the image where they fit, or extend past it into the content around it when allowed.
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       image-hotspots
 *
 * @package           wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the Image Hotspots block and its Hotspot child block from the
 * `blocks-manifest.php` that the build writes, along with their assets.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 *
 * @return void
 */
function a8csp_image_hotspots_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'a8csp_image_hotspots_block_init' );

/**
 * Turns an array of HTML attributes into an escaped attribute string.
 *
 * A `true` value prints the attribute's name alone, as for `hidden`; `false`
 * and `null` leave the attribute out. Every other value is escaped with
 * `esc_attr()`. Names are reduced to the characters an attribute name may
 * use, so that a filter cannot break out of the tag.
 *
 * @param array $attributes Attribute names and values.
 *
 * @return string The attributes, each preceded by a space.
 */
function a8csp_image_hotspots_attributes_string( array $attributes ) {
	$html = '';

	foreach ( $attributes as $name => $value ) {
		$name = strtolower( preg_replace( '/[^a-zA-Z0-9_:.-]/', '', (string) $name ) );

		if ( '' === $name || false === $value || null === $value ) {
			continue;
		}

		if ( true === $value ) {
			$html .= ' ' . $name;
			continue;
		}

		if ( is_array( $value ) ) {
			$value = implode( ' ', array_map( 'strval', $value ) );
		}

		$html .= sprintf( ' %s="%s"', $name, esc_attr( (string) $value ) );
	}

	return $html;
}

/**
 * The HTML allowed for the Image Hotspots image.
 *
 * The post allowlist, plus the responsive and loading attributes that
 * `wp_get_attachment_image()` prints and the post allowlist leaves out.
 *
 * @return array The allowed HTML, in the `wp_kses()` format.
 */
function a8csp_image_hotspots_image_allowed_html() {
	$allowed = wp_kses_allowed_html( 'post' );

	$allowed['img'] = array_merge(
		isset( $allowed['img'] ) ? $allowed['img'] : array(),
		array(
			'srcset'        => true,
			'sizes'         => true,
			'decoding'      => true,
			'fetchpriority' => true,
			'loading'       => true,
			'width'         => true,
			'height'        => true,
			'draggable'     => true,
		)
	);

	$allowed['picture'] = array();
	$allowed['source']  = array(
		'srcset' => true,
		'sizes'  => true,
		'media'  => true,
		'type'   => true,
		'width'  => true,
		'height' => true,
	);

	/**
	 * Filters the HTML allowed for the Image Hotspots image.
	 *
	 * @param array $allowed The allowed HTML, in the `wp_kses()` format.
	 */
	return apply_filters( 'a8csp_image_hotspots_image_allowed_html', $allowed );
}

/**
 * The HTML allowed inside a marker button.
 *
 * The post allowlist, plus enough inline SVG for an icon, since a project
 * may put one in the marker with the `a8csp_image_hotspots_marker_content`
 * filter.
 *
 * @return array The allowed HTML, in the `wp_kses()` format.
 */
function a8csp_image_hotspots_marker_allowed_html() {
	$svg_attributes = array(
		'class'               => true,
		'aria-hidden'         => true,
		'focusable'           => true,
		'role'                => true,
		'xmlns'               => true,
		'width'               => true,
		'height'              => true,
		'viewbox'             => true,
		'fill'                => true,
		'stroke'              => true,
		'stroke-width'        => true,
		'stroke-linecap'      => true,
		'stroke-linejoin'     => true,
		'd'                   => true,
		'cx'                  => true,
		'cy'                  => true,
		'r'                   => true,
		'x'                   => true,
		'y'                   => true,
		'rx'                  => true,
		'ry'                  => true,
		'points'              => true,
		'transform'           => true,
		'fill-rule'           => true,
		'clip-rule'           => true,
		'preserveaspectratio' => true,
	);

	$allowed = wp_kses_allowed_html( 'post' );

	foreach ( array( 'svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'line', 'title', 'use' ) as $tag ) {
		$allowed[ $tag ] = $svg_attributes;
	}

	$allowed['use']['href'] = true;

	/**
	 * Filters the HTML allowed inside a hotspot's marker button.
	 *
	 * @param array $allowed The allowed HTML, in the `wp_kses()` format.
	 */
	return apply_filters( 'a8csp_image_hotspots_marker_allowed_html', $allowed );
}
