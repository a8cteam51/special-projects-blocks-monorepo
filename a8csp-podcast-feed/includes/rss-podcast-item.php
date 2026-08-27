<?php
/**
 * Manages the RSS Podcast Item post type used to cache feed episodes locally.
 *
 * @package Wpcomsp
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', 'a8csp_podcast_feed_register_post_type' );

/**
 * Returns the post type slug.
 *
 * Must stay <= 20 characters; longer slugs are silently rejected by
 * register_post_type() and the wp_posts.post_type column.
 *
 * @return string
 */
function a8csp_podcast_feed_get_post_type_slug(): string {
	return 'a8csp_podcast_item';
}

/**
 * Registers the post type and its meta fields.
 *
 * @return void
 */
function a8csp_podcast_feed_register_post_type(): void {
	register_post_type(
		a8csp_podcast_feed_get_post_type_slug(),
		array(
			'label'               => __( 'Podcast Episodes', 'a8csp-podcast-feed' ),
			'public'              => false,
			'publicly_queryable'  => false,
			'show_ui'             => false,
			'show_in_menu'        => false,
			'show_in_rest'        => false,
			'exclude_from_search' => true,
			'has_archive'         => false,
			'supports'            => array( 'title', 'editor', 'custom-fields' ),
		)
	);

	$auth_callback = function () {
		return current_user_can( 'edit_posts' );
	};

	$meta_fields = array(
		'a8csp_podcast_item_audio_url'          => array(
			'type'              => 'string',
			'label'             => __( 'Audio URL', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'esc_url_raw',
		),
		'a8csp_podcast_item_cover_art'          => array(
			'type'              => 'string',
			'label'             => __( 'Cover art URL', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'esc_url_raw',
		),
		'a8csp_podcast_item_duration'           => array(
			'type'              => 'string',
			'label'             => __( 'Duration', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'sanitize_text_field',
		),
		'a8csp_podcast_item_pub_date'           => array(
			'type'              => 'string',
			'label'             => __( 'Publish date', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'sanitize_text_field',
		),
		'a8csp_podcast_item_pub_date_timestamp' => array(
			'type'              => 'integer',
			'label'             => __( 'Publish date timestamp', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'absint',
		),
		'a8csp_podcast_item_episode_number'     => array(
			'type'              => 'string',
			'label'             => __( 'Episode number', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'sanitize_text_field',
		),
		'a8csp_podcast_item_season_number'      => array(
			'type'              => 'string',
			'label'             => __( 'Season number', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'sanitize_text_field',
		),
		'a8csp_podcast_item_feed_url'           => array(
			'type'              => 'string',
			'label'             => __( 'Feed URL', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'esc_url_raw',
		),
		'a8csp_podcast_item_guid'               => array(
			'type'              => 'string',
			'label'             => __( 'Episode GUID hash', 'a8csp-podcast-feed' ),
			'sanitize_callback' => 'sanitize_text_field',
		),
	);

	foreach ( $meta_fields as $meta_key => $args ) {
		register_post_meta(
			a8csp_podcast_feed_get_post_type_slug(),
			$meta_key,
			array(
				'auth_callback'     => $auth_callback,
				'label'             => $args['label'],
				'sanitize_callback' => $args['sanitize_callback'],
				'single'            => true,
				'type'              => $args['type'],
			)
		);
	}
}

/**
 * Sanitizes an episode description to plain text wrapped in paragraph tags.
 *
 * Uses WP_HTML_Tag_Processor to strip attributes (inline styles, classes,
 * etc.) from all tags, then wp_kses() to remove all non-<p> markup.
 *
 * @param string $html Raw episode description HTML.
 *
 * @return string Sanitized HTML containing only <p> tags with text content.
 */
function a8csp_podcast_feed_sanitize_episode_description( string $html ): string {
	if ( empty( $html ) ) {
		return '';
	}

	$processor = new \WP_HTML_Tag_Processor( $html );

	while ( $processor->next_tag() ) {
		$attributes = $processor->get_attribute_names_with_prefix( '' );

		if ( ! $attributes ) {
			continue;
		}

		foreach ( $attributes as $attr ) {
			$processor->remove_attribute( $attr );
		}
	}

	$html = $processor->get_updated_html();

	// Keep only <p> tags, stripping all other markup while preserving text content.
	$html = wp_kses( $html, array( 'p' => array() ) );

	// Remove empty paragraphs.
	$html = preg_replace( '/<p>\s*<\/p>/', '', $html );
	$html = trim( $html );

	// If no <p> tags remain, wrap the text content in a paragraph.
	if ( ! empty( $html ) && false === strpos( $html, '<p>' ) ) {
		$html = '<p>' . $html . '</p>';
	}

	return $html;
}

/**
 * Generates a unique identifier for an episode within a feed.
 *
 * Hashes the RSS <guid> element, namespaced by feed URL.
 *
 * @param string $feed_url The feed URL.
 * @param array  $episode  Episode data with 'guid' from the RSS feed.
 *
 * @return string MD5 hash.
 */
function a8csp_podcast_feed_generate_episode_guid( string $feed_url, array $episode ): string {
	return md5( $feed_url . '|' . $episode['guid'] );
}

/**
 * Finds existing podcast item posts by their GUID hashes.
 *
 * Returns a map of GUID hash => post ID for all matches found.
 *
 * @param array $guid_hashes Array of GUID hashes to look up.
 *
 * @return array Associative array of guid_hash => post_id.
 */
function a8csp_podcast_feed_get_posts_by_guids( array $guid_hashes ): array {
	if ( empty( $guid_hashes ) ) {
		return array();
	}

	global $wpdb;

	$placeholders = implode( ', ', array_fill( 0, count( $guid_hashes ), '%s' ) );

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$results = $wpdb->get_results(
		$wpdb->prepare(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
			"SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = 'a8csp_podcast_item_guid' AND meta_value IN ($placeholders)",
			...$guid_hashes
		)
	);

	$map = array();

	foreach ( $results as $row ) {
		$map[ $row->meta_value ] = (int) $row->post_id;
	}

	return $map;
}

/**
 * Syncs parsed RSS episodes into the custom post type.
 *
 * Creates new posts for new episodes, updates existing ones, and
 * deletes posts for episodes no longer present in the feed.
 *
 * @param string $feed_url The source feed URL.
 * @param array  $episodes Array of parsed episode data.
 *
 * @return void
 */
function a8csp_podcast_feed_sync_episodes( string $feed_url, array $episodes ): void {
	/**
	 * Filters the maximum number of episodes synced into the CPT per request.
	 *
	 * Caps how many of the most recent items are written to the cache to keep
	 * a single REST or cron request from timing out on very large feeds. Stale
	 * removal still runs against the full feed via the daily prune cron, so
	 * older episodes already cached are not affected.
	 *
	 * @param int    $max_items Maximum items to sync per request. Default 200.
	 * @param string $feed_url  The feed URL being synced.
	 */
	$max_items = (int) apply_filters( 'a8csp_podcast_feed_max_synced_items', 200, $feed_url );

	if ( $max_items > 0 && count( $episodes ) > $max_items ) {
		$episodes = array_slice( $episodes, 0, $max_items );
	}

	$current_guids = array();

	foreach ( $episodes as $episode ) {
		$current_guids[] = a8csp_podcast_feed_generate_episode_guid( $feed_url, $episode );
	}

	$existing_posts = a8csp_podcast_feed_get_posts_by_guids( $current_guids );

	foreach ( $episodes as $index => $episode ) {
		$guid_hash        = $current_guids[ $index ];
		$existing_post_id = $existing_posts[ $guid_hash ] ?? 0;

		$post_data = array(
			'post_title'   => sanitize_text_field( $episode['title'] ),
			'post_content' => a8csp_podcast_feed_sanitize_episode_description( $episode['description'] ),
			'post_status'  => 'publish',
			'post_type'    => a8csp_podcast_feed_get_post_type_slug(),
		);

		if ( $existing_post_id ) {
			$post_data['ID'] = $existing_post_id;
			wp_update_post( $post_data );
			$post_id = $existing_post_id;
		} else {
			$post_id = wp_insert_post( $post_data );
		}

		if ( ! $post_id || is_wp_error( $post_id ) ) {
			continue;
		}

		$pub_date_timestamp = $episode['pubDate'] ? strtotime( $episode['pubDate'] ) : 0;

		$meta_map = array(
			'a8csp_podcast_item_audio_url'          => $episode['audioUrl'],
			'a8csp_podcast_item_cover_art'          => $episode['coverArt'],
			'a8csp_podcast_item_duration'           => $episode['duration'],
			'a8csp_podcast_item_pub_date'           => $episode['pubDate'],
			'a8csp_podcast_item_pub_date_timestamp' => $pub_date_timestamp ? (int) $pub_date_timestamp : 0,
			'a8csp_podcast_item_episode_number'     => $episode['episodeNumber'],
			'a8csp_podcast_item_season_number'      => $episode['seasonNumber'],
			'a8csp_podcast_item_feed_url'           => $feed_url,
			'a8csp_podcast_item_guid'               => $guid_hash,
		);

		foreach ( $meta_map as $key => $value ) {
			update_post_meta( $post_id, $key, $value );
		}
	}
}

/**
 * Deletes podcast item posts that are no longer present in the feed.
 *
 * @param string $feed_url      The feed URL.
 * @param array  $current_guids Array of GUID hashes currently in the feed.
 *
 * @return void
 */
function a8csp_podcast_feed_remove_stale_episodes( string $feed_url, array $current_guids ): void {
	if ( empty( $current_guids ) ) {
		return;
	}

	$existing = new \WP_Query(
		array(
			'post_type'      => a8csp_podcast_feed_get_post_type_slug(),
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				array(
					'key'   => 'a8csp_podcast_item_feed_url',
					'value' => $feed_url,
				),
			),
		)
	);

	foreach ( $existing->posts as $post_id ) {
		$guid = get_post_meta( $post_id, 'a8csp_podcast_item_guid', true );

		if ( ! in_array( $guid, $current_guids, true ) ) {
			wp_delete_post( $post_id, true );
		}
	}
}

/**
 * Queries podcast item posts for a given feed URL and optional season.
 *
 * Returns an array of episode data in the same shape as the RSS parser,
 * so downstream rendering code works unchanged.
 *
 * @param string $feed_url The feed URL to filter by.
 * @param string $season   Optional season number to filter by. Empty string for all.
 *
 * @return array Array of episode associative arrays.
 */
function a8csp_podcast_feed_get_episodes_from_posts( string $feed_url, string $season = '' ): array {
	$meta_query = array(
		array(
			'key'   => 'a8csp_podcast_item_feed_url',
			'value' => $feed_url,
		),
	);

	if ( '' !== $season ) {
		$meta_query[] = array(
			'key'   => 'a8csp_podcast_item_season_number',
			'value' => $season,
		);
	}

	$query = new \WP_Query(
		array(
			'post_type'      => a8csp_podcast_feed_get_post_type_slug(),
			'posts_per_page' => -1,
			'meta_query'     => $meta_query, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'meta_key'       => 'a8csp_podcast_item_pub_date_timestamp', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'orderby'        => 'meta_value_num',
			'order'          => 'DESC',
		)
	);

	$episodes = array();

	foreach ( $query->posts as $post ) {
		$episodes[] = array(
			'title'         => $post->post_title,
			'description'   => $post->post_content,
			'audioUrl'      => get_post_meta( $post->ID, 'a8csp_podcast_item_audio_url', true ),
			'coverArt'      => get_post_meta( $post->ID, 'a8csp_podcast_item_cover_art', true ),
			'duration'      => get_post_meta( $post->ID, 'a8csp_podcast_item_duration', true ),
			'pubDate'       => get_post_meta( $post->ID, 'a8csp_podcast_item_pub_date', true ),
			'episodeNumber' => get_post_meta( $post->ID, 'a8csp_podcast_item_episode_number', true ),
			'seasonNumber'  => get_post_meta( $post->ID, 'a8csp_podcast_item_season_number', true ),
		);
	}

	return $episodes;
}
