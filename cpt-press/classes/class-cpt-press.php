<?php
/**
 * Registers Press custom post-type and functions.
 *
 * @package A8CSP/CPTPress
 */

namespace A8CSP\CPTPress;

use WP_Post;

/**
 * Class CPT_Press
 *
 * Registers Press custom post-type and functions.
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @package A8CSP\CPTPress
 */
class CPT_Press {

	// region PROPERTIES

	/**
	 * Post Type name.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var string $post_type The post-type name.
	 */
	private string $post_type = 'press';

	/**
	 * Plugin Path.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var string $plugin_path The path to the plugin.
	 */
	private string $plugin_path;

	// endregion

	// region CONSTRUCTOR

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->plugin_path = plugin_dir_path( __DIR__ );

		// Register post-type for press items.
		add_action( 'init', array( $this, 'register_press_items_post_type' ) );

		// Register taxonomies for the post-type.
		add_action( 'init', array( $this, 'register_press_type_taxonomy' ) );

		// Register post meta for press.
		add_action( 'init', array( $this, 'register_press_meta' ) );

		// Register the press fields block.
		add_action( 'init', array( $this, 'register_press_fields_block' ) );

		// Register block patterns.
		add_action( 'init', array( $this, 'register_block_pattern' ) );

		// Register cpt single template.
		add_action( 'init', array( $this, 'register_press_item_template' ) );

		// Do not allow a single press view.
		add_action( 'template_redirect', array( $this, 'redirect_single_to_article' ) );

		// Filter the permalink to conditionally use post meta as permalink.
		add_filter( 'post_type_link', array( $this, 'modify_press_item_permalink' ), 10, 2 );
	}

	// endregion

	// region HOOKS

	/**
	 * Modifies the single post's permalink based on whether custom meta is set for this.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 * @access public
	 *
	 * @param string $post_link The post's permalink.
	 * @param WP_Post $post The post in question.
	 *
	 * @return string  The filtered permalink.
	 */
	public function modify_press_item_permalink( string $post_link, WP_Post $post ): string {

		// Get the custom permalink post meta.
		$custom_permalink = get_post_meta( $post->ID, '_press_permalink', 1 );

		// If post_meta was found, check it's longer than nothing and then use that as a permalink.
		if ( is_string( $custom_permalink ) && strlen( $custom_permalink ) > 0 ) {
			return $custom_permalink;
		}

		return $post_link;
	}

	/**
	 * Redirects the single press item to the original article URL.
	 * Press items are not meant to have a single view, so we redirect to the original article.
	 *
	 * @return void
	 * @version 1.0.0
	 * @access public
	 * @hook template_redirect
	 *
	 * @since 1.0.0
	 */
	public function redirect_single_to_article(): void {

		// Check we're on a press single view.
		if ( is_singular( 'press' ) ) {

			// Get the original article URL.
			$article_url = get_post_meta( get_the_ID(), '_press_permalink', 1 );

			// Ensure we actually return a URL to send the user to before redirecting.
			if ( ! empty( $article_url ) ) {
				wp_safe_redirect( esc_url_raw( $article_url ), 301 );
				exit;
			}
		}
	}

	/**
	 * Add the press query pattern.
	 *
	 * @return void
	 * @version 1.0.0
	 * @access public
	 * @hook init
	 *
	 * @since 1.0.0
	 */
	public function register_block_pattern(): void {

		// Register the CPT Press Release category.
		register_block_pattern_category(
			'cpt-press',
			array(
				'label'       => __( 'CPT Press Release', 'cpt-press' ),
				'description' => __( 'CPT Press Release included pattern', 'cpt-press' ),
			)
		);

		// Register the pattern.
		register_block_pattern(
			'cpt-press/press-query',
			array(
				'title'       => __( 'Press Query', 'cpt-press' ),
				'description' => __( 'Display a query of press items.', 'cpt-press' ),
				'filePath'    => $this->plugin_path . '/includes/pattern-press-query.html',
				'categories'  => array( 'cpt-press' ),
				'keywords'    => array( 'press release', 'press release query' ),
				'inserter'    => true,
			)
		);
	}

	/**
	 * Register the press release fields block.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 * @access public
	 * @hook   init
	 *
	 * @return void
	 */
	public function register_press_fields_block(): void {
		register_block_type(
			$this->plugin_path . 'build',
			array( 'render_callback' => array( $this, 'render_press_fields_block' ) )
		);
	}

	/**
	 * Register the press custom post type.
	 *
	 * @return void
	 * @version 1.0.0
	 * @access public
	 * @hook init
	 *
	 * @since 1.0.0
	 */
	public function register_press_items_post_type(): void {

		$labels = array(
			'name'                  => _x( 'Press Items', 'Post type general name', 'cpt-press' ),
			'singular_name'         => _x( 'Press Item', 'Post type singular name', 'cpt-press' ),
			'menu_name'             => _x( 'Press Items', 'Admin Menu text', 'cpt-press' ),
			'name_admin_bar'        => _x( 'Press Item', 'Add New on Toolbar', 'cpt-press' ),
			'add_new'               => __( 'Add New', 'cpt-press' ),
			'add_new_item'          => __( 'Add New Press Item', 'cpt-press' ),
			'new_item'              => __( 'New Press Item', 'cpt-press' ),
			'edit_item'             => __( 'Edit Press Item', 'cpt-press' ),
			'view_item'             => __( 'View Press Item', 'cpt-press' ),
			'all_items'             => __( 'All Press Items', 'cpt-press' ),
			'search_items'          => __( 'Search Press Items', 'cpt-press' ),
			'parent_item_colon'     => __( 'Parent Press Items:', 'cpt-press' ),
			'not_found'             => __( 'No Press Items found.', 'cpt-press' ),
			'not_found_in_trash'    => __( 'No Press Items found in Trash.', 'cpt-press' ),
			'featured_image'        => _x( 'Press Item Cover Image', 'Overrides the “Featured Image” phrase for this post type.', 'cpt-press' ),
			'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type.', 'cpt-press' ),
			'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type.', 'cpt-press' ),
			'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type.', 'cpt-press' ),
			'archives'              => _x( 'Press Item archives', 'The post type archive label used in nav menus. Default “Post Archives”.', 'cpt-press' ),
			'insert_into_item'      => _x( 'Insert in Press Item', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post).', 'cpt-press' ),
			'uploaded_to_this_item' => _x( 'Uploaded to this Press Item', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post).', 'cpt-press' ),
			'filter_items_list'     => _x( 'Filter Press Items list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”.', 'cpt-press' ),
			'items_list_navigation' => _x( 'Press Items list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”.', 'cpt-press' ),
			'items_list'            => _x( 'Press Items list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”.', 'cpt-press' ),
		);

		$args = array(
			'labels'             => $labels,
			'description'        => 'Press Item custom post type.',
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'press' ),
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => 20,
			'supports'           => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
			'show_in_rest'       => true,
			'menu_icon'          => 'dashicons-media-document',
		);

		register_post_type( $this->post_type, $args );
	}

	/**
	 * Register press item template.
	 *
	 * @return void
	 * @version 1.0.0
	 * @access public
	 * @hook init
	 *
	 * @since 1.0.0
	 */
	public function register_press_item_template(): void {

		// phpcs:ignore -- Get the template content.
		$template_content = file_get_contents( $this->plugin_path . '/includes/template-press-single.html' );

		register_block_template(
			'cpt-press//single-press',
			array(
				'title'       => __( 'Single Press', 'cpt-press' ),
				'description' => __( 'A custom template for the press single view.', 'cpt-press' ),
				'content'     => $template_content,
				'post_types'  => array( $this->post_type ),
			)
		);
	}

	/**
	 * Registers the custom post-type meta_items in Gutenberg.
	 */
	public function register_press_meta(): void {

		// Press outlet name meta.
		register_post_meta(
			'press',
			'_press_outlet',
			array(
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
				'sanitize_callback' => function ( $value ) {
					return esc_html( $value );
				},
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
			)
		);

		// Press author meta.
		register_post_meta(
			'press',
			'_press_author',
			array(
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
				'sanitize_callback' => function ( $value ) {
					return esc_html( $value );
				},
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
			)
		);

		// Press permalink meta.
		register_post_meta(
			'press',
			'_press_permalink',
			array(
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
				'sanitize_callback' => function ( $value ) {
					return esc_url( $value );
				},
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
			)
		);
	}

	/**
	 * Register a custom taxonomy for the "press" post-type
	 *
	 * @since 1.0.0
	 * @see get_post_type_labels() for label keys.
	 */
	public function register_press_type_taxonomy(): void {

		$labels = array(
			'name'              => esc_html_x( 'Press Types', 'taxonomy general name', 'cpt-press' ),
			'singular_name'     => esc_html_x( 'Press Type', 'taxonomy singular name', 'cpt-press' ),
			'search_items'      => esc_html__( 'Search Press Types', 'cpt-press' ),
			'all_items'         => esc_html__( 'All Press Types', 'cpt-press' ),
			'parent_item'       => esc_html__( 'Parent Press Type', 'cpt-press' ),
			'parent_item_colon' => esc_html__( 'Parent Press Type:', 'cpt-press' ),
			'edit_item'         => esc_html__( 'Edit Press Type', 'cpt-press' ),
			'update_item'       => esc_html__( 'Update Press Type', 'cpt-press' ),
			'add_new_item'      => esc_html__( 'Add New Press Type', 'cpt-press' ),
			'new_item_name'     => esc_html__( 'New Press Type Name', 'cpt-press' ),
			'menu_name'         => esc_html__( 'Press Type', 'cpt-press' ),
		);

		$args = array(
			'hierarchical'       => true,
			'labels'             => $labels,
			'show_ui'            => true,
			'show_admin_column'  => true,
			'publicly_queryable' => true,
			'rewrite'            => array(
				'slug' => 'press/type',
			),
			'show_in_rest'       => true,
		);

		register_taxonomy( 'press-type', array( 'press' ), $args );
	}

	// endregion

	// region CALLBACKS

	/**
	 * Render the press fields block.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 * @access public
	 *
	 * @param array $attributes The block's attributes.
	 * @param string $content The block's content.
	 *
	 * @return string The rendered block.
	 */
	public function render_press_fields_block( array $attributes, string $content ): string {

		// Don't render for admin, when doing rest request, nor when doing auto save.
		if (
			is_admin() ||
			( defined( 'REST_REQUEST' ) && REST_REQUEST ) ||
			( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
		) {
			return $content;
		}

		// Get the post_meta value
		$meta_key   = $attributes['metaKey'] ?? '_press_outlet';
		$meta_value = get_post_meta( get_the_ID(), $meta_key, 1 );

		// If we have a value, return it.
		if ( is_string( $meta_value ) && strlen( $meta_value ) > 0 ) {
			return sprintf(
				'<div %s><span class="prefix">%s</span><span class="meta-value">%s</span><span class="suffix">%s</span></div>',
				get_block_wrapper_attributes(), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in `get_block_wrapper_attributes`.
				esc_html( $attributes['prefix'] ?? '' ),
				esc_html( $meta_value ),
				esc_html( $attributes['suffix'] ?? '' )
			);
		}

		// If no value, return nothing.
		return '';
	}

	// endregion
}

// Initialise the class.
new CPT_Press();
