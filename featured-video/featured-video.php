<?php
/**
 * Plugin Name: Featured Video
 * Description: Add the ability to use Featured Video inplace of Featured Image. <strong>Supported Block:</strong> core/post-featured-image
 * Version: 0.3.0
 * Author: Automattic Special Projects Team
 * Author URI: https://specialprojects.automattic.com/
 * Update URI: https://opsoasis.wpspecialprojects.com/featured-video/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: featured-video
 * Requires at least: 6.6
 * Tested up to: 6.8.2
 * Requires PHP: 7.4
 * Network: false
 *
 * @package Wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	WPCOMSP_Blocks_Self_Update::get_instance()->hooks();
}

/**
 * Allowed keys for the featured video options meta.
 *
 * @return array<string, string> Map of option key to type ("bool" or "int").
 */
function wpcomsp_featured_video_option_schema() {
	return array(
		'autoplay'     => 'bool',
		'loop'         => 'bool',
		'muted'        => 'bool',
		'playsinline'  => 'bool',
		'controls'     => 'bool',
		'showPlayIcon' => 'bool',
		'posterId'     => 'int',
	);
}

/**
 * Sanitize the featured video options object.
 *
 * @param mixed $value Raw value from the REST request.
 * @return array Sanitized, allowlist-filtered options.
 */
function wpcomsp_featured_video_sanitize_options( $value ) {
	$value  = (array) $value;
	$schema = wpcomsp_featured_video_option_schema();
	$out    = array();

	foreach ( $schema as $key => $type ) {
		if ( ! array_key_exists( $key, $value ) ) {
			continue;
		}
		if ( 'bool' === $type ) {
			$out[ $key ] = (bool) $value[ $key ];
		} elseif ( 'int' === $type ) {
			$out[ $key ] = absint( $value[ $key ] );
		}
	}

	return $out;
}

/**
 * Sanitize the featured video ID/URL meta value.
 *
 * @param mixed $value Raw value from the REST request.
 * @return string Either a stringified integer attachment ID, or an esc_url_raw'd URL, or ''.
 */
function wpcomsp_featured_video_sanitize_id( $value ) {
	if ( '' === $value || null === $value ) {
		return '';
	}
	if ( is_numeric( $value ) ) {
		return (string) (int) $value;
	}
	return esc_url_raw( (string) $value );
}

/**
 * Enqueues the editor script for the block editor.
 *
 * @return void
 */
function wpcomsp_featured_video_enqueue_editor_assets() {

	if ( ! is_readable( __DIR__ . '/build/editor/editor.asset.php' ) || ! is_readable( __DIR__ . '/build/editor/editor.js' ) ) {
		return;
	}

	$asset_meta = include __DIR__ . '/build/editor/editor.asset.php';

	wp_enqueue_script(
		'featured-video-editor-script',
		plugin_dir_url( __FILE__ ) . 'build/editor/editor.js',
		$asset_meta['dependencies'] ?? array(),
		$asset_meta['version'] ?? filemtime( __DIR__ . '/build/editor/editor.js' ),
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'wpcomsp_featured_video_enqueue_editor_assets' );

/**
 * Enqueue the frontend view script and styles for the play-icon overlay.
 *
 * @return void
 */
function wpcomsp_featured_video_enqueue_view_assets() {

	if ( ! is_readable( __DIR__ . '/build/view/view.asset.php' ) || ! is_readable( __DIR__ . '/build/view/view.js' ) ) {
		return;
	}

	$asset_meta = include __DIR__ . '/build/view/view.asset.php';

	wp_enqueue_script(
		'featured-video-view-script',
		plugin_dir_url( __FILE__ ) . 'build/view/view.js',
		$asset_meta['dependencies'] ?? array(),
		$asset_meta['version'] ?? filemtime( __DIR__ . '/build/view/view.js' ),
		true
	);

	if ( is_readable( __DIR__ . '/build/view/style-view.css' ) ) {
		wp_enqueue_style(
			'featured-video-view-style',
			plugin_dir_url( __FILE__ ) . 'build/view/style-view.css',
			array(),
			filemtime( __DIR__ . '/build/view/style-view.css' )
		);
	}
}
add_action( 'wp_enqueue_scripts', 'wpcomsp_featured_video_enqueue_view_assets' );

/**
 * Register the featured video post metas on every post type that supports thumbnails.
 *
 * Priority 11 to run after CPTs registered at the default `init` priority 10.
 *
 * @return void
 */
function wpcomsp_featured_video_register_post_meta() {

	$post_types = get_post_types_by_support( 'thumbnail' );

	foreach ( $post_types as $post_type ) {

		register_post_meta(
			$post_type,
			'_wpcomsp_featured_video_id',
			array(
				'sanitize_callback' => 'wpcomsp_featured_video_sanitize_id',
				'show_in_rest'      => true,
				'type'              => 'string',
				'single'            => true,
				'auth_callback'     => static function (): bool {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_post_meta(
			$post_type,
			'_wpcomsp_featured_video_options',
			array(
				'sanitize_callback' => 'wpcomsp_featured_video_sanitize_options',
				'show_in_rest'      => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'autoplay'     => array( 'type' => 'boolean' ),
							'loop'         => array( 'type' => 'boolean' ),
							'muted'        => array( 'type' => 'boolean' ),
							'playsinline'  => array( 'type' => 'boolean' ),
							'controls'     => array( 'type' => 'boolean' ),
							'showPlayIcon' => array( 'type' => 'boolean' ),
							'posterId'     => array( 'type' => 'integer' ),
						),
					),
				),
				'type'              => 'object',
				'single'            => true,
				'auth_callback'     => static function (): bool {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'wpcomsp_featured_video_register_post_meta', 11 );

/**
 * Determine if a URL points to a direct video file we can render inside <video>.
 *
 * Defers to `wp_check_filetype()` so the detection stays in sync with
 * WordPress's mime-type registry (and any site-level filters on it).
 *
 * @param string $url Candidate URL.
 * @return bool True if the URL resolves to a video/* mime type.
 */
function wpcomsp_featured_video_is_direct_video_url( $url ) {
	// `wp_check_filetype()` anchors on `$`, so query strings or fragments would
	// otherwise prevent a match. Strip everything past the path before checking.
	$path = (string) wp_parse_url( (string) $url, PHP_URL_PATH );
	if ( '' === $path ) {
		return false;
	}

	$check = wp_check_filetype( $path );
	return ! empty( $check['type'] ) && 0 === strpos( $check['type'], 'video/' );
}

/**
 * Build the inline <video> markup for a given source URL and options.
 *
 * @param string $video_url  Source URL of the video file.
 * @param array  $options    Sanitized options array.
 * @return string HTML markup for the <video> element (no wrapping <figure>).
 */
function wpcomsp_featured_video_build_video_tag( $video_url, $options ) {

	$boolean_attrs = array( 'autoplay', 'loop', 'muted', 'playsinline', 'controls' );
	$attrs         = '';

	foreach ( $boolean_attrs as $name ) {
		if ( ! empty( $options[ $name ] ) ) {
			$attrs .= ' ' . esc_attr( $name );
		}
	}

	$poster_attr = '';
	if ( ! empty( $options['posterId'] ) ) {
		$poster_url = wp_get_attachment_image_url( (int) $options['posterId'], 'full' );
		if ( $poster_url ) {
			$poster_attr = sprintf( ' poster="%s"', esc_url( $poster_url ) );
		}
	}

	return sprintf(
		'<video class="wp-post-image wp-post-video" src="%s" preload="metadata"%s%s><p>%s</p></video>',
		esc_url( $video_url ),
		$poster_attr,
		$attrs,
		esc_html__( 'Your browser does not support the video tag.', 'featured-video' )
	);
}

/**
 * Copy class / style / id from the original block's outer <figure> onto a new wrapper.
 *
 * @param string $block_content      Original rendered block content from core.
 * @param bool   $strip_aspect_ratio When true, the `aspect-ratio` declaration is removed from the
 *                                   copied style. Used for embeds, where the provider iframe drives
 *                                   the natural aspect ratio and an inherited image-shaped ratio
 *                                   would crop or letterbox the video unexpectedly.
 * @return array{class:string,style:string,id:string} Map of attribute strings, empty if none found.
 */
function wpcomsp_featured_video_extract_wrapper_attrs( $block_content, $strip_aspect_ratio = false ) {

	$out = array(
		'class' => '',
		'style' => '',
		'id'    => '',
	);

	if ( empty( $block_content ) ) {
		return $out;
	}

	$p = new WP_HTML_Tag_Processor( $block_content );
	if ( ! $p->next_tag( 'figure' ) ) {
		return $out;
	}

	$class = $p->get_attribute( 'class' );
	$style = $p->get_attribute( 'style' );
	$id    = $p->get_attribute( 'id' );

	$out['class'] = is_string( $class ) ? $class : '';
	$out['style'] = is_string( $style ) ? $style : '';
	$out['id']    = is_string( $id ) ? $id : '';

	if ( $strip_aspect_ratio && '' !== $out['style'] ) {
		$out['style'] = trim( preg_replace( '/\s*aspect-ratio\s*:\s*[^;]+;?/i', '', $out['style'] ) );
	}

	return $out;
}

/**
 * Merge class / style / id from the original featured-image figure onto another figure
 * already present in the supplied HTML.
 *
 * @param string $target_html HTML containing a <figure> as its first tag.
 * @param array  $extra       Map with optional keys class/style/id to merge in.
 * @return string Updated HTML, or the original if no <figure> was found.
 */
function wpcomsp_featured_video_merge_figure_attrs( $target_html, $extra ) {
	$p = new WP_HTML_Tag_Processor( $target_html );
	if ( ! $p->next_tag( 'figure' ) ) {
		return $target_html;
	}

	if ( ! empty( $extra['class'] ) ) {
		foreach ( preg_split( '/\s+/', (string) $extra['class'] ) as $class_name ) {
			if ( '' !== $class_name ) {
				$p->add_class( $class_name );
			}
		}
	}
	if ( ! empty( $extra['style'] ) ) {
		$existing = (string) $p->get_attribute( 'style' );
		$merged   = trim( $existing . ( '' !== $existing ? ';' : '' ) . $extra['style'] );
		$p->set_attribute( 'style', $merged );
	}
	if ( ! empty( $extra['id'] ) ) {
		$p->set_attribute( 'id', $extra['id'] );
	}

	return $p->get_updated_html();
}

/**
 * Render the featured video in place of the post featured image.
 *
 * @param string   $block_content The block content.
 * @param array    $block         The block attributes.
 * @param WP_Block $wp_block      The WP_Block instance.
 *
 * @return string The updated block content with the featured video.
 */
function wpcomsp_featured_video_render_post_featured_image( $block_content, $block, $wp_block ) {

	$post_id = $wp_block->context['postId'] ?? get_the_ID();

	if ( empty( $post_id ) ) {
		return $block_content;
	}

	$featured_video_id = get_post_meta( $post_id, '_wpcomsp_featured_video_id', true );

	if ( '' === $featured_video_id || null === $featured_video_id ) {
		return $block_content;
	}

	$raw_options = get_post_meta( $post_id, '_wpcomsp_featured_video_options', true );
	$options     = wpcomsp_featured_video_sanitize_options( is_array( $raw_options ) ? $raw_options : array() );

	$default_options = array(
		'autoplay'     => false,
		'loop'         => false,
		'muted'        => false,
		'playsinline'  => true,
		'controls'     => true,
		'showPlayIcon' => false,
		'posterId'     => 0,
	);
	$options         = array_merge( $default_options, $options );

	// External URL paths.
	if ( ! is_numeric( $featured_video_id ) && ! wpcomsp_featured_video_is_direct_video_url( $featured_video_id ) ) {
		// Hand the URL to the same path `the_content` uses for embed blocks in post
		// content: wrap the URL on its own line inside a wp-block-embed structure, then
		// let WP_Embed::autoembed do the URL → iframe conversion. This goes through the
		// shared oembed_cache and `embed_oembed_html` filter chain, so the output stays
		// in lockstep with however a regular `core/embed` block renders.
		global $wp_embed;
		$markup = sprintf(
			"<figure class=\"wp-block-embed wp-embed-aspect-16-9 wp-has-aspect-ratio\"><div class=\"wp-block-embed__wrapper\">\n%s\n</div></figure>",
			esc_url( $featured_video_id )
		);
		$resolved = $wp_embed->autoembed( $markup );
		if ( false === strpos( $resolved, '<iframe' ) ) {
			return $block_content;
		}

		// Core only enqueues the `wp-block-embed` stylesheet when an embed block is
		// detected on the page. We render embed markup from a different block's filter,
		// so the detection never fires and the responsive-embed CSS never loads. Force it.
		wp_enqueue_style( 'wp-block-embed' );

		$inherited = wpcomsp_featured_video_extract_wrapper_attrs( $block_content, true );
		return wpcomsp_featured_video_merge_figure_attrs( $resolved, $inherited );
	}

	// Inline-video paths (media library attachment or direct video file URL).
	if ( is_numeric( $featured_video_id ) ) {
		$attachment_id = (int) $featured_video_id;
		// Guard against the stored ID no longer pointing at a video — e.g. the
		// attachment was replaced with an image or hand-edited in the database.
		if ( ! wp_attachment_is( 'video', $attachment_id ) ) {
			return $block_content;
		}
		$video_url = wp_get_attachment_url( $attachment_id );
		if ( ! $video_url ) {
			return $block_content;
		}
		$inner = wpcomsp_featured_video_build_video_tag( $video_url, $options );
	} else {
		$inner = wpcomsp_featured_video_build_video_tag( $featured_video_id, $options );
	}

	// Core only auto-enqueues `wp-block-video` when a core/video block is detected on
	// the page. Without it, `<video>` falls back to its intrinsic dimensions (often
	// 1920x1080) instead of `.wp-block-video :where(video) { width: 100% }`. Same fix
	// as the embed branch above.
	wp_enqueue_style( 'wp-block-video' );

	// Strip the inherited `aspect-ratio` style — the post-featured-image block adds one
	// (e.g. 3:2) for cropping the image, but the video's own intrinsic ratio drives the
	// layout. Leaving it on would letterbox/pillarbox the figure around the video.
	$wrapper        = wpcomsp_featured_video_extract_wrapper_attrs( $block_content, true );
	$figure_classes = trim( 'wp-block-video ' . $wrapper['class'] );

	$show_play_overlay = ! empty( $options['showPlayIcon'] );
	if ( $show_play_overlay ) {
		$figure_classes .= ' wpcomsp-has-play-icon';
	}

	$figure_attrs = sprintf( ' class="%s"', esc_attr( $figure_classes ) );
	if ( '' !== $wrapper['style'] ) {
		$figure_attrs .= sprintf( ' style="%s"', esc_attr( $wrapper['style'] ) );
	}
	if ( '' !== $wrapper['id'] ) {
		$figure_attrs .= sprintf( ' id="%s"', esc_attr( $wrapper['id'] ) );
	}

	$play_button = '';
	if ( $show_play_overlay ) {
		$play_button = sprintf(
			'<button type="button" class="wpcomsp-featured-video__play" aria-label="%s"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="48" height="48"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>',
			esc_attr__( 'Play video', 'featured-video' )
		);
	}

	return sprintf( '<figure%s>%s%s</figure>', $figure_attrs, $inner, $play_button );
}
add_filter( 'render_block_core/post-featured-image', 'wpcomsp_featured_video_render_post_featured_image', 10, 3 );
