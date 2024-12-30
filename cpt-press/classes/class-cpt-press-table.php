<?php
/**
 * Class CPT_Press_Table
 *
 * Adds custom columns to the press post-type table in the WordPress dashboard.
 *
 * @package A8CSP/CPTPress
 */

namespace A8CSP\CPTPress;

use WP_Query;

/**
 * Class CPT_Press_Table
 *
 * Adds custom columns to the press post-type table in the WordPress dashboard.
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @package A8CSP/CPTPress
 */
class CPT_Press_Table {

	// region CONSTRUCTOR

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Add custom columns to the press post-type table.
		add_filter( 'manage_press_posts_columns', array( $this, 'add_press_meta_columns' ) );

		// Populate the custom columns with the meta-data.
		add_action( 'manage_press_posts_custom_column', array( $this, 'populate_press_meta_columns' ), 10, 2 );

		// Make the custom columns sortable.
		add_filter( 'manage_edit-press_sortable_columns', array( $this, 'make_press_meta_columns_sortable' ) );

		// Modify the query to sort by the custom meta-fields.
		add_action( 'pre_get_posts', array( $this, 'sort_press_meta_columns' ) );
	}

	// endregion

	// region HOOKS

	/**
	 * Add custom columns to the press post-type.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 * @access public
	 *
	 * @param array $columns Existing columns.
	 *
	 * @return array Modified columns.
	 */
	public function add_press_meta_columns( array $columns ): array {
		// Insert the new columns after the first column.
		return array_merge(
			array_slice( $columns, 0, 2, true ),
			array(
				'press_outlet' => __( 'Press Outlet', 'cpt-press' ),
				'press_author' => __( 'Press Author', 'cpt-press' ),
				'external_url' => __( 'External URL', 'cpt-press' ),
			),
			array_slice( $columns, 2, null, true )
		);
	}

	/**
	 * Populate the custom columns with the meta-data.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 * @access public
	 *
	 * @param string $column Column name.
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	public function populate_press_meta_columns( string $column, int $post_id ): void {
		$colum_value = '';
		switch ( $column ) {
			case 'press_outlet':
				$colum_value = esc_html( get_post_meta( $post_id, '_press_outlet', true ) );
				break;
			case 'press_author':
				$colum_value = esc_html( get_post_meta( $post_id, '_press_author', true ) );
				break;
			case 'external_url':
				$permalink   = get_post_meta( $post_id, '_press_permalink', true );
				$colum_value = empty( $permalink ) ? __( 'No', 'cpt-press' ) : __( 'Yes', 'cpt-press' );
				$filter_url  = add_query_arg( 'external_url', $colum_value, admin_url( 'edit.php?post_type=press' ) );
				$colum_value = sprintf( '<a href="%s">%s</a>', esc_url( $filter_url ), esc_html( $colum_value ) );
				break;
		}

		echo $colum_value; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in the switch statement.
	}

	/**
	 * Make the custom columns sortable.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 * @access public
	 *
	 * @param array $columns Existing sortable columns.
	 *
	 * @return array Modified sortable columns.
	 */
	public function make_press_meta_columns_sortable( array $columns ): array {
		$columns['press_outlet'] = 'press_outlet';
		$columns['press_author'] = 'press_author';
		return $columns;
	}

	/**
	 * Modify the query to sort by the custom meta-fields.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 * @access public
	 *
	 * @param WP_Query $query The current query.
	 *
	 * @return void
	 */
	public function sort_press_meta_columns( WP_Query $query ): void {

		// Only modify the main query on the admin dashboard.
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}

		// Only modify the query for the press post-type.
		if ( 'press' !== $query->get( 'post_type' ) ) {
			return;
		}

		// Sort by the custom meta-fields.
		switch ( $query->get( 'orderby' ) ) {
			case 'press_outlet':
				$query->set( 'meta_key', '_press_outlet' );
				$query->set( 'orderby', 'meta_value' );
				break;
			case 'press_author':
				$query->set( 'meta_key', '_press_author' );
				$query->set( 'orderby', 'meta_value' );
				break;
		}

		// Filter by external_url.
		$external_url = $_REQUEST['external_url'] ?? false; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( false !== $external_url ) {

			if ( 'yes' === strtolower( $external_url ) ) {
				$meta_query = array(
					array(
						'key'     => '_press_permalink',
						'compare' => '!=',
						'value'   => '',
					),
				);
			} elseif ( 'no' === strtolower( $external_url ) ) {
				$meta_query = array(
					'relation' => 'OR',
					array(
						'key'     => '_press_permalink',
						'compare' => 'NOT EXISTS',
					),
					array(
						'key'     => '_press_permalink',
						'compare' => '=',
						'value'   => '',
					),
				);
			}

			isset( $meta_query ) && $query->set( 'meta_query', $meta_query );
		}
	}

	// endregion
}

// Instantiate the class.
new CPT_Press_Table();
