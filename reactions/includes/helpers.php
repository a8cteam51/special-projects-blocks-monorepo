<?php
/**
 * Get all prepared reactions data.
 *
 * @return array
 */
function wpcomsp_reactions_get_reactions_data(): array {
	global $wpdb;

	$results = $wpdb->get_results(
		$wpdb->prepare(
			// Get all rows from the reactions table.
			'SELECT * FROM %i',
			$wpdb->prefix . WPCOMSP_REACTIONS_TABLE_NAME
		)
	);

	foreach ( $results as $key => $result ) {
		// Only show reactions for existing posts.
		if ( ! get_post_status( $result->post_id ) ) {
			unset( $results[ $key ] );
			continue;
		}

		// Format the date.
		$result->created_at_formatted = date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), strtotime( $result->created_at ) );

		// Set the user name.
		if ( empty( $result->user_id ) ) {
			$result->display_name = esc_html__( 'Guest', 'reactions' );
		} else {
			$user                 = get_user_by( 'id', $result->user_id );
			$result->display_name = $user ? $user->display_name : esc_html__( 'Unknown ID', 'reactions' );
		}

		// Set the reaction attributes.
		$reaction               = wpcomsp_reactions_get_reaction_attributes( $result->reaction_type );
		$result->reaction_label = $reaction['label'];
		$result->reaction_icon  = rawurlencode( $reaction['iconsets']['default'] );

		// Set post title and permalink.
		$result->post_title     = get_the_title( $result->post_id );
		$result->post_permalink = get_permalink( $result->post_id );
	}

	return $results;
}

/**
 * Check if the reactions table exists.
 *
 * @return boolean
 */
function wpcomsp_reactions_table_exists(): bool {
	global $wpdb;

	$table_name = $wpdb->prefix . WPCOMSP_REACTIONS_TABLE_NAME;

	if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) ) === $table_name ) {
		return true;
	}

	return false;
}

/**
 * Get all reactions of a post.
 *
 * @param integer $pid The post ID.
 *
 * @return array
 */
function wpcomsp_reactions_get_by_postid( int $pid ): array {
	global $wpdb;

	$reactions = array();
	$results   = $wpdb->get_results(
		$wpdb->prepare(
			'SELECT reaction_type, COUNT(*) as count FROM %i WHERE post_id = %d GROUP BY reaction_type',
			$wpdb->prefix . WPCOMSP_REACTIONS_TABLE_NAME,
			$pid
		),
		OBJECT_K
	);

	if ( $results ) {
		foreach ( $results as $reaction_type => $data ) {
			$reactions[ $reaction_type ] = (int) $data->count;
		}
	}

	return $reactions;
}

/**
 * Get user reaction of a post using post ID and token.
 *
 * @param string  $token   The user's session token.
 * @param integer $post_id The post ID.
 *
 * @return string
 */
function wpcomsp_reactions_get_user_reaction( string $token, int $post_id ): string {
	global $wpdb;

	$reaction = $wpdb->get_row(
		$wpdb->prepare(
			'SELECT reaction_type FROM %i WHERE session_token = %s AND post_id = %d',
			$wpdb->prefix . WPCOMSP_REACTIONS_TABLE_NAME,
			$token,
			$post_id,
		)
	);

	return $reaction ? $reaction->reaction_type : '';
}

/**
 * Update user reaction.
 *
 * @param integer $post_id  The post ID.
 * @param string  $reaction The reaction type.
 * @param string  $token    The user's session token.
 *
 * @return array
 */
function wpcomsp_reactions_update_reaction( int $post_id, string $reaction, string $token ): array {
	global $wpdb;

	$table_name   = $wpdb->prefix . WPCOMSP_REACTIONS_TABLE_NAME;
	$post_id      = (int) $post_id;
	$new_reaction = sanitize_text_field( $reaction );
	$token        = sanitize_text_field( $token );
	$user_id      = get_current_user_id();

	// Get existing reaction.
	$existing_reaction = $wpdb->get_row(
		$wpdb->prepare(
			'SELECT id, reaction_type FROM %i WHERE session_token = %s AND post_id = %d',
			$table_name,
			$token,
			$post_id
		)
	);

	if ( $existing_reaction ) {
		if ( $existing_reaction->reaction_type === $new_reaction ) {
			// User is undoing their reaction.
			$wpdb->delete(
				$table_name,
				array( 'id' => $existing_reaction->id ),
				array( '%d' )
			);
		} else {
			// Update the reaction type.
			$wpdb->update(
				$table_name,
				array( 'reaction_type' => $new_reaction ),
				array( 'id' => $existing_reaction->id ),
				array( '%s' ),
				array( '%d' )
			);
		}
	} else {
		// Insert a new reaction.
		$wpdb->insert(
			$table_name,
			array(
				'session_token' => $token,
				'post_id'       => $post_id,
				'reaction_type' => $new_reaction,
				'created_at'    => current_time( 'mysql' ),
				'user_id'       => $user_id,
			),
			array( '%s', '%d', '%s', '%s' )
		);
	}

	// Get updated reaction count.
	$results = $wpdb->get_results(
		$wpdb->prepare(
			'SELECT reaction_type, COUNT(*) as total FROM %i WHERE post_id = %d GROUP BY reaction_type',
			$table_name,
			$post_id
		),
		OBJECT_K
	);

	$reactions = array();

	if ( $results ) {
		foreach ( $results as $reaction_type => $data ) {
			$reactions[ $reaction_type ] = (int) $data->total;
		}
	}

	return $reactions;
}

/**
 * Get reaction attributes by name.
 *
 * @param string $name The reaction name.
 *
 * @return array The reaction attributes.
 */
function wpcomsp_reactions_get_reaction_attributes( string $name ): array {
	// Ensure the name is valid.
	if ( ! file_exists( WPCOMSP_REACTIONS_DIR . "includes/icons/$name.php" ) ) {
		return array(
			'label'    => '',
			'iconsets' => array(
				'default' => '',
			),
		);
	}
	// Import the icon markup variable {$icons_NAME}.
	include WPCOMSP_REACTIONS_DIR . "includes/icons/$name.php";

	$iconsets = $reaction['iconsets'];

	$uid = wp_generate_password( 3, false );

	// Append UID to any ID and url(#ID) in the SVG.
	foreach ( $iconsets as $key => $icon ) {
		$iconsets[ $key ] = preg_replace( '/id="([^"]+)"/', 'id="$1-' . $uid . '"', $icon );
		$iconsets[ $key ] = preg_replace( '/url\(#([^)]+)\)/', 'url(#$1-' . $uid . ')', $iconsets[ $key ] );
	}

	return array(
		'label'    => $reaction['label'],
		'iconsets' => $iconsets,
	);
}

/**
 * Request to create the reactions table.
 *
 * @return void
 */
function wpcomsp_reactions_create_table_request(): void {
	if ( ! isset( $_POST['wpcomsp_create_table'] ) ) {
		return;
	}

	if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'], 'wpcomsp_reactions_create_table_nonce' ) ) {
		wp_die( esc_html__( 'Permission Denied', 'reactions' ) );
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Permission Denied', 'reactions' ) );
	}

	wpcomsp_reactions_setup_table();

	wp_safe_redirect( admin_url() );
	exit;
}
add_action( 'admin_init', 'wpcomsp_reactions_create_table_request' );

/**
 * Create the reactions table.
 *
 * @return void
 */
function wpcomsp_reactions_setup_table(): void {
	global $wpdb;

	$table_name      = $wpdb->prefix . 'wpcomsp_reactions';
	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE {$table_name} (
		id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
		post_id BIGINT(20) UNSIGNED NOT NULL,
		reaction_type VARCHAR(32) NOT NULL,
		session_token VARCHAR(32) NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		user_id BIGINT(20) UNSIGNED NOT NULL,
		PRIMARY KEY (id),
		KEY post_id (post_id),
		KEY reaction_type (reaction_type),
		KEY session_token (session_token),
		KEY user_id (user_id)
	) $charset_collate;";

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sql );

	add_option( 'wpcomsp_reactions_db_ver', '1.0.0' );
}
