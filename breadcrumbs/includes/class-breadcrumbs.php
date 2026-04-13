<?php

namespace A8CSP;

/**
 * Class Breadcrumbs
 *
 * Handles the generation and rendering of breadcrumbs for the site.
 *
 * @package A8CSP
 */
class Breadcrumbs {

	/**
	 * Array of breadcrumb items.
	 *
	 * @var array
	 */
	protected static $crumbs = array();

	/**
	 * HTML output of the breadcrumbs.
	 *
	 * @var string
	 */
	protected static $crumbs_html = '';

	/**
	 * Flag to track if breadcrumbs have been built.
	 *
	 * @var bool
	 */
	protected static $is_built = false;

	/**
	 * Get the HTML for the breadcrumbs.
	 *
	 * This method builds the breadcrumbs and returns the generated HTML.
	 *
	 * @param boolean $hide_home_link Whether to hide the home link in the breadcrumbs.
	 *
	 * @return string Breadcrumbs HTML.
	 */
	public static function get_crumbs_html( $hide_home_link = false ): string {
		$skip_breadcrumbs = apply_filters( 'audreycapital_features_skip_breadcrumbs', false );

		if ( $skip_breadcrumbs ) {
			return '';
		}

		// Build the breadcrumbs if they haven't been built yet.
		self::build_crumbs( $hide_home_link );

		self::build_crumbs_html();
		return self::$crumbs_html;
	}

	/**
	 * Build the breadcrumbs for the current context.
	 *
	 * @param boolean $hide_home_link Whether to hide the home link in the breadcrumbs.
	 *
	 * @return void
	 */
	public static function build_crumbs( $hide_home_link ): void {

		if ( self::$is_built ) {
			return;
		}

		self::$crumbs = array();

		if ( ! $hide_home_link ) {
			self::add_home();
		}

		if ( class_exists( \bbPress::class ) ) {
			self::build_bbpress();
		}

		if ( class_exists( \BuddyPress::class ) ) {
			self::build_buddypress();
		}

		if ( is_archive() ) {
			self::build_archive();
		}

		if ( is_singular() ) {
			self::build_single_hierarchy();
			self::build_singular();
		}

		// Allow filtering of the breadcrumb items.
		self::$crumbs = apply_filters( 'a8csp_breadcrumbs_items', self::$crumbs );

		self::$is_built = true;
	}

	/**
	 * Add a breadcrumb item to the list.
	 *
	 * @param string  $link    The URL of the breadcrumb.
	 * @param string  $label   The label of the breadcrumb.
	 * @param boolean $current Whether the breadcrumb is the current page. Default false.
	 *
	 * @return void
	 */
	public static function add_crumb( string $link, string $label, bool $current = false ): void {
		self::$crumbs[] = array(
			'link'    => esc_url_raw( untrailingslashit( $link ) ),
			'label'   => sanitize_text_field( $label ),
			'current' => $current,
		);
	}

	/**
	 * Build breadcrumbs for bbPress.
	 *
	 * Uses the bbPress breadcrumb function to generate the breadcrumb HTML.
	 *
	 * @return void
	 */
	protected static function build_bbpress(): void {
		if ( function_exists( bbp_get_breadcrumb ) ) {
			add_filter( 'bbp_breadcrumbs', array( self::class, 'capture_bbp_breadcrumbs' ), 20 );
			add_filter( 'bbp_no_breadcrumb', '__return_false' );
			self::$crumbs_html = bbp_get_breadcrumb();
			remove_filter( 'bbp_no_breadcrumb', '__return_false' );
		}
	}

	/**
	 * Capture the breadcrumbs from bbPress.
	 *
	 * @param array $crumbs Array of breadcrumb items.
	 *
	 * @return array The array of breadcrumb items.
	 */
	public static function capture_bbp_breadcrumbs( array $crumbs ): array {
		self::$crumbs = $crumbs;
		return $crumbs;
	}

	/**
	 * Build breadcrumbs for BuddyPress.
	 *
	 * Retrieves breadcrumbs from the BuddyPress_Breadcrumbs class and generates the HTML.
	 *
	 * @return void
	 */
	private static function build_buddypress(): void {
		$crumbs = BuddyPress_Breadcrumbs::get_crumbs();

		if ( empty( $crumbs ) ) {
			return;
		}

		self::$crumbs = $crumbs;
	}

	/**
	 * Add the home breadcrumb item.
	 *
	 * @return void
	 */
	private static function add_home(): void {
		$home_url   = apply_filters( 'a8csp_breadcrumbs_home_url', get_home_url() );
		$home_label = apply_filters( 'a8csp_breadcrumbs_home_label', __( 'Home', 'breadcrumbs' ) );

		self::add_crumb( $home_url, $home_label );
	}

	/**
	 * Build the breadcrumb for singular posts and pages.
	 *
	 * This method adds the current post or page as the last breadcrumb item.
	 *
	 * @return void
	 */
	private static function build_singular(): void {
		$post_id = get_the_id();

		if ( 0 < $post_id ) {
			self::add_crumb( get_permalink( $post_id ), get_the_title( $post_id ), true );
		}
	}

	/**
	 * Build the breadcrumb hierarchy for single posts and pages.
	 *
	 * For single posts, this includes the post type archive or blog page. For pages, this includes parent pages.
	 *
	 * @return void
	 */
	private static function build_single_hierarchy(): void {
		switch ( true ) {
			case is_single():
				$post_id = get_the_id();
				if ( 0 < $post_id ) {
					$post_type      = get_post_type( $post_id );
					$page_for_posts = get_option( 'page_for_posts' );
					if ( false !== $page_for_posts && 'post' === $post_type ) {
						self::add_crumb( get_permalink( $page_for_posts ), get_the_title( $page_for_posts ), false );
					} else {
						$post_object    = get_post_type_object( $post_type );
						$post_type_name = isset( $post_object->labels->name ) ? $post_object->labels->name : 'archive';
						self::add_crumb( get_post_type_archive_link( $post_type ), $post_type_name, false );
					}
				}
				break;
			case is_page():
				$page_id = get_the_id();
				$page    = get_post( $page_id );

				if ( 0 < $page && $page->post_parent ) {
					$ancestors = get_post_ancestors( $page_id );
					foreach ( array_reverse( $ancestors ) as $ancestor_id ) {
						$ancestor = get_post( $ancestor_id );
						if ( $ancestor ) {
							self::add_crumb( get_permalink( $ancestor_id ), get_the_title( $ancestor_id ) );
						}
					}
				}
				break;
		}
	}

	/**
	 * Build the breadcrumbs for archive pages.
	 *
	 * This includes category, tag, taxonomy, author, date, and post type archives.
	 *
	 * @return void
	 */
	private static function build_archive(): void {
		switch ( true ) {
			case is_category():
				$category = get_queried_object();
				self::add_crumb( get_category_link( $category->term_id ), single_cat_title( '', false ), true );
				break;
			case is_tag():
				$tag = get_queried_object();
				self::add_crumb( get_tag_link( $tag->term_id ), single_tag_title( '', false ), true );
				break;
			case is_tax():
				$term = get_queried_object();
				self::add_crumb( get_term_link( $term->term_id, $term->taxonomy ), single_term_title( '', false ), true );
				break;
			case is_author():
				$author = get_queried_object();
				self::add_crumb( get_author_posts_url( $author->ID ), get_the_author_meta( 'display_name', $author->ID ), true );
				break;
			case is_day():
				self::add_crumb( get_day_link( get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) ), get_the_time( 'F j, Y' ), true );
				break;
			case is_month():
				self::add_crumb( get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) ), get_the_time( 'F Y' ), true );
				break;
			case is_year():
				self::add_crumb( get_year_link( get_query_var( 'year' ) ), get_the_time( 'Y' ), true );
				break;
			case is_post_type_archive():
				$post_type = get_queried_object();
				self::add_crumb( get_post_type_archive_link( $post_type->name ), post_type_archive_title( '', false ), true );
				break;
		}
	}

	/**
	 * Generate the HTML for the breadcrumbs.
	 *
	 * Iterates through the breadcrumb items and constructs the HTML output.
	 *
	 * @return void
	 */
	private static function build_crumbs_html(): void {

		if ( empty( self::$crumbs ) ) {
			return;
		}

		$crumbs_html = '<div class="community-breadcrumb"><p class="breadcrumbs">';

		foreach ( self::$crumbs as $crumb ) {
			$label = esc_html( $crumb['label'] );
			$link  = esc_url( $crumb['link'] );

			if ( $crumb['current'] ) {
				$crumbs_html .= '<span class="breadcrumb-item current">' . $label . '</span>';
				continue;
			}

			if ( ! empty( $link ) ) {
				$crumbs_html .= '<a href="' . $link . '" rel="bookmark" class="breadcrumb-item">' . $label . '</a>';
			} else {
				$crumbs_html .= '<span class="breadcrumb-item">' . $label . '</span>';
			}

			$sep = apply_filters(
				'a8csp_breadcrumbs_separator',
				'<svg xmlns="http://www.w3.org/2000/svg" width="5" height="8" viewBox="0 0 5 8" fill="none">
                    <path d="M0.636231 7L3.36351 3.99999L0.63623 1" stroke="#767676"/>
                </svg>'
			);

			$crumbs_html .= sprintf( ' <span class="bp-breadcrumb-sep">%s</span> ', $sep );
		}

		$crumbs_html .= '</p></div>';

		self::$crumbs_html = $crumbs_html;
	}

	/**
	 * Get the array of breadcrumb items.
	 *
	 * @param boolean $hide_home_link Whether to hide the home link in the breadcrumbs.
	 *
	 * @return array Array of breadcrumb items.
	 */
	public static function get_crumbs( $hide_home_link ): array {
		self::build_crumbs( $hide_home_link );
		return self::$crumbs;
	}
}
