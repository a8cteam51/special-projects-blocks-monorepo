<?php
/**
 * Plugin Name:       Override Post Links
 * Description:       Add a panel in the WP Admin allowing the user to enter a link which overrides the post links to the new link.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       override-post-links
 *
 * @package Wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Setup auto-updates for this plugin from our monorepo.
 * Done in an anonymous function for simplicity in making this a drop-in snippet.
 *
 * @param array $blocks Array of plugin files.
 *
 * @return array
 */
add_filter(
	'wpcomsp_installed_blocks',
	function ( $blocks ) {
		// Add the plugin slug here to enable autoupdates.
		$blocks[] = 'override-post-links';

		return $blocks;
	}
);

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 *
 * @return void
 */
function wpcomsp_override_post_links_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build/block.json' );
}

add_action( 'init', 'wpcomsp_override_post_links_block_init' );

/**
 * Post types that support the override post links feature.
 *
 * @return array
 */
function wpcomsp_supported_post_types() {
	$supported_post_types = apply_filters( 'wpcomsp_override_post_links_post_types', array( 'post' ) );

	return $supported_post_types;
}

/**
 * Add variable for the JS for the supported post types for the block.
 *
 * @return void
 */
function wpcomsp_inline_supported_post_types() {
	wp_add_inline_script(
		'wpcomsp-override-post-links-editor-script',
		'const override_post_links_post_types =' . wp_json_encode( wpcomsp_supported_post_types() ),
		'before'
	);
}

add_action( 'admin_enqueue_scripts', 'wpcomsp_inline_supported_post_types' );

/**
 * Registers post meta for the block.
 *
 * @return void
 */
function wpcomsp_register_post_meta(): void {

	$supported_post_types = wpcomsp_supported_post_types();

	foreach ( $supported_post_types as $post_type ) {
		register_post_meta(
			$post_type,
			'wpcomsp_news_data',
			array(
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
				'sanitize_callback' => function ( $value ) {
					return array(
						'source' => sanitize_text_field( $value['source'] ),
						'url'    => esc_url_raw( $value['url'] ),
					);
				},
				'show_in_rest'      => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'source' => array(
								'type'              => 'string',
								'sanitize_callback' => 'sanitize_text_field',
							),
							'url'    => array(
								'type'              => 'string',
								'sanitize_callback' => 'esc_url_raw',
							),
						),
					),
				),
				'single'            => true,
				'type'              => 'object',
			),
		);
	}
}

add_action( 'init', 'wpcomsp_register_post_meta' );

/**
 * Get the post meta value.
 *
 * @param string  $key The key value to retrieve.
 * @param integer $id  The post ID.
 *
 * @return string
 */
function wpcomsp_get_news_data_value( $key, $id ): string {
	$news_data = get_post_meta( $id, 'wpcomsp_news_data', true );

	if ( ! empty( $news_data ) && isset( $news_data[ $key ] ) ) {
		return $news_data[ $key ];
	}

	return '';
}

/**
 * Hijack the post title block to change the post url & in new tab if the URL is set.
 *
 * @param string $block_content The outputted block HTML.
 * @param array  $block         The block data.
 * @param object $instance      The block instance.
 *
 * @return string
 */
function wpcomsp_maybe_modify_post_link( $block_content, $block, $instance ) {
	$id       = isset( $instance->context['postId'] ) ? $instance->context['postId'] : 0;
	$news_url = wpcomsp_get_news_data_value( 'url', $id );

	// If news URL is set, open this post title in new tab.
	if ( ! empty( $news_url ) ) {
		$p = new WP_HTML_Tag_Processor( $block_content );
		$p->next_tag( 'A' );
		$p->set_attribute( 'target', '_blank' );
		$p->set_attribute( 'href', $news_url );
		$block_content = $p->get_updated_html();
	}

	return $block_content;
}

add_filter( 'render_block_core/post-title', 'wpcomsp_maybe_modify_post_link', 10, 3 );
add_filter( 'render_block_core/post-featured-image', 'wpcomsp_maybe_modify_post_link', 10, 3 );
add_filter( 'render_block_core/read-more', 'wpcomsp_maybe_modify_post_link', 10, 3 );
add_filter( 'render_block_core/post-excerpt', 'wpcomsp_maybe_modify_post_link', 10, 3 );

/**
 * Exit the post if the news URL is set.
 *
 * @return void
 */
function wpcomsp_exit_post_if_external_link() {
	if ( ! is_single() ) {
		return;
	}

	$post_type            = get_post_type();
	$supported_post_types = wpcomsp_supported_post_types();

	if ( ! in_array( $post_type, $supported_post_types, true ) ) {
		return;
	}

	$news_url = wpcomsp_get_news_data_value( 'url', get_the_ID() );

	if ( empty( $news_url ) ) {
		return;
	}

	$redirect_url = apply_filters(
		'wpcomsp_override_post_links_redirect_url',
		get_post_type_archive_link( 'post' ),
		$news_url
	);

	if ( empty( $redirect_url ) ) {
		return;
	}

	wp_safe_redirect( $redirect_url );
	exit;
}

/**
 * Register Block Bindings for the External News Link Source.
 *
 * @return void
 */
function wpcomsp_block_bindings() {
	register_block_bindings_source(
		'wpcomsp/news-link-source',
		array(
			'label'              => __( 'External News Link Source', 'override-post-links' ),
			'get_value_callback' => function ( array $source_args, $block_instance ) {
				$post_id = $block_instance->context['postId'];
				$value = wpcomsp_get_news_data_value( 'source', $post_id );

				if ( $value ) {
					return $value;
				} else {
					return '';
				}
			},
			'uses_context'       => array( 'postId' ),
		)
	);
}

add_action( 'init', 'wpcomsp_block_bindings' );
