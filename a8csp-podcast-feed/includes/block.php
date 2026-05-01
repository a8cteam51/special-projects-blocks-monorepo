<?php
/**
 * Registers the Podcast Feed block, its REST endpoints, and the
 * cron job that keeps the locally cached episodes in sync.
 *
 * @package Wpcomsp
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', 'a8csp_podcast_feed_register_block' );
add_action( 'rest_api_init', 'a8csp_podcast_feed_register_rest_routes' );
add_action( 'init', 'a8csp_podcast_feed_schedule_cron' );
add_action( 'a8csp_podcast_feed_refresh', 'a8csp_podcast_feed_refresh_all_feeds' );
add_action( 'a8csp_podcast_feed_prune', 'a8csp_podcast_feed_prune_all_feeds' );

/**
 * Registers the block.
 *
 * @return void
 */
function a8csp_podcast_feed_register_block(): void {
	register_block_type(
		dirname( __DIR__ ) . '/build',
		array(
			'render_callback' => 'a8csp_podcast_feed_render_block',
		)
	);
}

/**
 * Convert a WordPress spacing value to a CSS value.
 *
 * Handles preset references like "var:preset|spacing|30" and plain values.
 *
 * @param string $value The spacing value.
 *
 * @return string CSS-ready value.
 */
function a8csp_podcast_feed_get_gap_css_value( string $value ): string {
	if ( str_starts_with( $value, 'var:' ) ) {
		$path = str_replace( array( 'var:', '|' ), array( '', '--' ), $value );
		return 'var(--wp--' . $path . ')';
	}
	return $value;
}

/**
 * Build an inline style string for individual episode elements
 * from the block's border and background color attributes.
 *
 * @param array $attributes Block attributes.
 *
 * @return string HTML style attribute string (e.g. ' style="..."') or empty.
 */
function a8csp_podcast_feed_get_episode_inline_styles( array $attributes ): string {
	$styles = array();

	// Background color.
	if ( ! empty( $attributes['backgroundColor'] ) ) {
		$styles[] = 'background-color: var(--wp--preset--color--' . $attributes['backgroundColor'] . ')';
	} elseif ( ! empty( $attributes['style']['color']['background'] ) ) {
		$styles[] = 'background-color: ' . $attributes['style']['color']['background'];
	}

	// Text color.
	if ( ! empty( $attributes['textColor'] ) ) {
		$styles[] = 'color: var(--wp--preset--color--' . $attributes['textColor'] . ')';
	} elseif ( ! empty( $attributes['style']['color']['text'] ) ) {
		$styles[] = 'color: ' . $attributes['style']['color']['text'];
	}

	// Border styles.
	$border = $attributes['style']['border'] ?? array();

	// Border color from preset or custom.
	if ( ! empty( $attributes['borderColor'] ) ) {
		$styles[] = 'border-color: var(--wp--preset--color--' . $attributes['borderColor'] . ')';
	} elseif ( ! empty( $border['color'] ) ) {
		$styles[] = 'border-color: ' . $border['color'];
	}
	if ( ! empty( $border['width'] ) ) {
		$styles[] = 'border-width: ' . $border['width'];
	}
	if ( ! empty( $attributes['borderColor'] ) || ! empty( $border['color'] ) || ! empty( $border['width'] ) ) {
		$styles[] = 'border-style: ' . ( ! empty( $border['style'] ) ? $border['style'] : 'solid' );
	} elseif ( ! empty( $border['style'] ) ) {
		$styles[] = 'border-style: ' . $border['style'];
	}
	if ( ! empty( $border['radius'] ) ) {
		if ( is_array( $border['radius'] ) ) {
			$styles[] = sprintf(
				'border-radius: %s %s %s %s',
				$border['radius']['topLeft'] ?? '0',
				$border['radius']['topRight'] ?? '0',
				$border['radius']['bottomRight'] ?? '0',
				$border['radius']['bottomLeft'] ?? '0'
			);
		} else {
			$styles[] = 'border-radius: ' . $border['radius'];
		}
	}

	// Per-side borders.
	foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
		if ( ! empty( $border[ $side ] ) ) {
			$side_border = $border[ $side ];
			if ( ! empty( $side_border['color'] ) ) {
				$styles[] = 'border-' . $side . '-color: ' . $side_border['color'];
			}
			if ( ! empty( $side_border['width'] ) ) {
				$styles[] = 'border-' . $side . '-width: ' . $side_border['width'];
			}
			if ( ! empty( $side_border['style'] ) ) {
				$styles[] = 'border-' . $side . '-style: ' . $side_border['style'];
			}
		}
	}

	if ( empty( $styles ) ) {
		return '';
	}

	return ' style="' . esc_attr( implode( '; ', $styles ) ) . '"';
}

/**
 * Render callback for the podcast feed block.
 *
 * @param array $attributes Block attributes.
 *
 * @return string Rendered block HTML.
 */
function a8csp_podcast_feed_render_block( array $attributes ): string {
	$feed_url = $attributes['feedUrl'] ?? '';

	if ( empty( $feed_url ) ) {
		return '';
	}

	$number_of_episodes  = (int) ( $attributes['numberOfEpisodes'] ?? 10 );
	$show_title          = $attributes['showTitle'] ?? true;
	$show_cover_art      = $attributes['showCoverArt'] ?? true;
	$show_player         = $attributes['showPlayer'] ?? true;
	$show_description    = $attributes['showDescription'] ?? true;
	$show_duration       = $attributes['showDuration'] ?? true;
	$show_publish_date   = $attributes['showPublishDate'] ?? true;
	$show_episode_number = $attributes['showEpisodeNumber'] ?? false;
	$layout_type         = $attributes['layoutType'] ?? 'list';
	$columns             = (int) ( $attributes['columns'] ?? 3 );
	$season              = $attributes['season'] ?? '';
	$no_episodes_message = $attributes['noEpisodesMessage'] ?? '';

	$episodes = a8csp_podcast_feed_get_episodes_from_posts( $feed_url, $season );
	$episodes = array_slice( $episodes, 0, $number_of_episodes );

	$wrapper_attributes = get_block_wrapper_attributes();

	if ( empty( $episodes ) ) {
		if ( ! empty( $no_episodes_message ) ) {
			return '<div ' . $wrapper_attributes . '><div class="podcast-feed"><p class="podcast-feed__no-episodes">' . esc_html( $no_episodes_message ) . '</p></div></div>';
		}
		return '';
	}

	$episodes_style_parts = array();

	if ( 'grid' === $layout_type ) {
		$episodes_style_parts[] = 'grid-template-columns: repeat(' . $columns . ', 1fr)';
	}

	$block_gap = $attributes['style']['spacing']['blockGap'] ?? '';
	if ( ! empty( $block_gap ) ) {
		$episodes_style_parts[] = 'gap: ' . a8csp_podcast_feed_get_gap_css_value( $block_gap );
	}

	$episodes_style = ! empty( $episodes_style_parts )
		? ' style="' . esc_attr( implode( '; ', $episodes_style_parts ) ) . '"'
		: '';

	$episode_inline_styles = a8csp_podcast_feed_get_episode_inline_styles( $attributes );

	ob_start();
	?>
	<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<div class="podcast-feed">
			<div class="podcast-feed__episodes podcast-feed__episodes--<?php echo esc_attr( $layout_type ); ?>"<?php echo $episodes_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
				<?php foreach ( $episodes as $episode ) : ?>
					<div class="podcast-feed__episode"<?php echo $episode_inline_styles; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
						<?php if ( $show_cover_art && ! empty( $episode['coverArt'] ) ) : ?>
							<div class="podcast-feed__episode-cover">
								<img src="<?php echo esc_url( $episode['coverArt'] ); ?>" alt="<?php echo esc_attr( $episode['title'] ); ?>" />
							</div>
						<?php endif; ?>
						<div class="podcast-feed__episode-content">
							<?php if ( $show_title && ! empty( $episode['title'] ) ) : ?>
								<h3 class="podcast-feed__episode-title">
									<?php echo esc_html( $episode['title'] ); ?>
								</h3>
							<?php endif; ?>
							<div class="podcast-feed__episode-meta">
								<?php if ( $show_episode_number && ! empty( $episode['episodeNumber'] ) ) : ?>
									<span class="podcast-feed__episode-number">
										<?php
										/* translators: %s: episode number */
										printf( esc_html__( 'Episode %s', 'a8csp-podcast-feed' ), esc_html( $episode['episodeNumber'] ) );
										?>
									</span>
								<?php endif; ?>
								<?php if ( $show_publish_date && ! empty( $episode['pubDate'] ) ) : ?>
									<span class="podcast-feed__episode-date">
										<?php echo esc_html( date_i18n( get_option( 'date_format' ), strtotime( $episode['pubDate'] ) ) ); ?>
									</span>
								<?php endif; ?>
								<?php if ( $show_duration && ! empty( $episode['duration'] ) ) : ?>
									<span class="podcast-feed__episode-duration">
										<?php echo esc_html( $episode['duration'] ); ?>
									</span>
								<?php endif; ?>
							</div>
							<?php if ( $show_description && ! empty( $episode['description'] ) ) : ?>
								<div class="podcast-feed__episode-description">
									<div class="podcast-feed__episode-description-content">
										<?php echo wp_kses_post( $episode['description'] ); ?>
									</div>
									<button
										class="podcast-feed__episode-read-more"
										aria-expanded="false"
										data-read-more="<?php esc_attr_e( 'Read more', 'a8csp-podcast-feed' ); ?>"
										data-read-less="<?php esc_attr_e( 'Read less', 'a8csp-podcast-feed' ); ?>"
									>
										<?php esc_html_e( 'Read more', 'a8csp-podcast-feed' ); ?>
									</button>
								</div>
							<?php endif; ?>
							<?php if ( $show_player && ! empty( $episode['audioUrl'] ) ) : ?>
								<div class="podcast-feed__episode-player">
									<audio controls src="<?php echo esc_url( $episode['audioUrl'] ); ?>">
										<?php esc_html_e( 'Your browser does not support the audio element.', 'a8csp-podcast-feed' ); ?>
									</audio>
								</div>
							<?php endif; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Fetch and parse an RSS feed, returning structured episode data.
 *
 * @param string $feed_url The RSS feed URL to fetch.
 *
 * @return array|\WP_Error Array of episodes or WP_Error on failure.
 */
function a8csp_podcast_feed_fetch_and_parse_feed( string $feed_url ) {
	$response = wp_remote_get(
		$feed_url,
		array(
			'timeout' => 30,
		)
	);

	if ( is_wp_error( $response ) ) {
		return new \WP_Error(
			'feed_fetch_error',
			__( 'Failed to fetch the RSS feed.', 'a8csp-podcast-feed' ),
			array( 'status' => 500 )
		);
	}

	$status_code = wp_remote_retrieve_response_code( $response );

	if ( 200 !== $status_code ) {
		return new \WP_Error(
			'feed_fetch_error',
			__( 'RSS feed returned an error.', 'a8csp-podcast-feed' ),
			array( 'status' => $status_code )
		);
	}

	$body = wp_remote_retrieve_body( $response );

	$use_errors = libxml_use_internal_errors( true );

	$xml = simplexml_load_string( $body );

	if ( false === $xml ) {
		libxml_clear_errors();
		libxml_use_internal_errors( $use_errors );

		return new \WP_Error(
			'feed_parse_error',
			__( 'Failed to parse RSS feed XML.', 'a8csp-podcast-feed' )
		);
	}

	$xml->registerXPathNamespace( 'itunes', 'http://www.itunes.com/dtds/podcast-1.0.dtd' );
	$xml->registerXPathNamespace( 'content', 'http://purl.org/rss/1.0/modules/content/' );

	$episodes = array();

	// Get channel-level cover art as fallback.
	$channel_image = '';

	if ( isset( $xml->channel->image->url ) ) {
		$channel_image = (string) $xml->channel->image->url;
	}

	if ( empty( $channel_image ) ) {
		$itunes_image = $xml->channel->xpath( 'itunes:image' );

		if ( ! empty( $itunes_image[0] ) && isset( $itunes_image[0]['href'] ) ) {
			$channel_image = (string) $itunes_image[0]['href'];
		}
	}

	foreach ( $xml->channel->item as $item ) {
		$title = isset( $item->title ) ? (string) $item->title : '';

		// Prefer content:encoded, fall back to description.
		$description     = '';
		$content_encoded = $item->xpath( 'content:encoded' );

		if ( ! empty( $content_encoded[0] ) ) {
			$description = (string) $content_encoded[0];
		} elseif ( isset( $item->description ) ) {
			$description = (string) $item->description;
		}

		$description = trim( $description );

		$audio_url = '';

		if ( isset( $item->enclosure['url'] ) ) {
			$audio_url = (string) $item->enclosure['url'];
		}

		$cover_art    = $channel_image;
		$itunes_image = $item->xpath( 'itunes:image' );

		if ( ! empty( $itunes_image[0] ) && isset( $itunes_image[0]['href'] ) ) {
			$cover_art = (string) $itunes_image[0]['href'];
		}

		$duration        = '';
		$itunes_duration = $item->xpath( 'itunes:duration' );

		if ( ! empty( $itunes_duration[0] ) ) {
			$duration = (string) $itunes_duration[0];
		}

		$pub_date = isset( $item->pubDate ) ? (string) $item->pubDate : ''; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

		$episode_number = '';
		$itunes_episode = $item->xpath( 'itunes:episode' );

		if ( ! empty( $itunes_episode[0] ) ) {
			$episode_number = (string) $itunes_episode[0];
		}

		$season_number = '';
		$itunes_season = $item->xpath( 'itunes:season' );

		if ( ! empty( $itunes_season[0] ) ) {
			$season_number = (string) $itunes_season[0];
		}

		$guid = isset( $item->guid ) ? (string) $item->guid : '';

		$episodes[] = array(
			'title'         => $title,
			'description'   => $description,
			'audioUrl'      => $audio_url,
			'coverArt'      => $cover_art,
			'duration'      => $duration,
			'pubDate'       => $pub_date,
			'episodeNumber' => $episode_number,
			'seasonNumber'  => $season_number,
			'guid'          => $guid,
		);
	}

	libxml_clear_errors();
	libxml_use_internal_errors( $use_errors );

	return $episodes;
}

/**
 * Register the REST API endpoints used by the editor.
 *
 * @return void
 */
function a8csp_podcast_feed_register_rest_routes(): void {
	$shared_args = array(
		'url'    => array(
			'required'          => true,
			'validate_callback' => function ( $param ) {
				return filter_var( $param, FILTER_VALIDATE_URL );
			},
			'sanitize_callback' => 'esc_url_raw',
		),
		'season' => array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		),
	);

	register_rest_route(
		'a8csp/v1',
		'/podcast-feed/episodes',
		array(
			'methods'             => 'GET',
			'callback'            => 'a8csp_podcast_feed_rest_get_episodes',
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => $shared_args,
		)
	);

	register_rest_route(
		'a8csp/v1',
		'/podcast-feed/refresh',
		array(
			'methods'             => 'POST',
			'callback'            => 'a8csp_podcast_feed_rest_refresh_feed',
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => $shared_args,
		)
	);
}

/**
 * REST API callback to manually refresh a podcast feed.
 *
 * Fetches the live RSS feed, syncs episodes to the CPT cache,
 * and returns the updated episode list.
 *
 * @param \WP_REST_Request $request The REST request object.
 *
 * @return \WP_REST_Response|\WP_Error Response object or error.
 */
function a8csp_podcast_feed_rest_refresh_feed( \WP_REST_Request $request ) {
	$feed_url = $request->get_param( 'url' );
	$season   = $request->get_param( 'season' );

	$parsed = a8csp_podcast_feed_fetch_and_parse_feed( $feed_url );

	if ( is_wp_error( $parsed ) ) {
		return $parsed;
	}

	a8csp_podcast_feed_sync_episodes( $feed_url, $parsed );

	$episodes = a8csp_podcast_feed_get_episodes_from_posts( $feed_url, $season );

	return new \WP_REST_Response(
		array(
			'episodes' => $episodes,
		),
		200
	);
}

/**
 * REST API callback for fetching episodes.
 *
 * When episodes don't yet exist in the CPT (e.g. a new feed URL),
 * falls back to a live fetch and sync before returning results.
 *
 * @param \WP_REST_Request $request The REST request object.
 *
 * @return \WP_REST_Response|\WP_Error Response object or error.
 */
function a8csp_podcast_feed_rest_get_episodes( \WP_REST_Request $request ) {
	$feed_url = $request->get_param( 'url' );
	$season   = $request->get_param( 'season' );

	$episodes = a8csp_podcast_feed_get_episodes_from_posts( $feed_url, $season );

	// If no episodes exist yet, do an initial sync.
	if ( empty( $episodes ) ) {
		$parsed = a8csp_podcast_feed_fetch_and_parse_feed( $feed_url );

		if ( is_wp_error( $parsed ) ) {
			return $parsed;
		}

		a8csp_podcast_feed_sync_episodes( $feed_url, $parsed );
		$episodes = a8csp_podcast_feed_get_episodes_from_posts( $feed_url, $season );
	}

	return new \WP_REST_Response(
		array(
			'episodes' => $episodes,
		),
		200
	);
}

/**
 * Schedule the cron events for refreshing and pruning podcast feeds.
 *
 * @return void
 */
function a8csp_podcast_feed_schedule_cron(): void {
	if ( ! wp_next_scheduled( 'a8csp_podcast_feed_refresh' ) ) {
		wp_schedule_event( time(), 'hourly', 'a8csp_podcast_feed_refresh' );
	}

	if ( ! wp_next_scheduled( 'a8csp_podcast_feed_prune' ) ) {
		wp_schedule_event( time(), 'daily', 'a8csp_podcast_feed_prune' );
	}
}

/**
 * Reduce a list of blocks and their inner blocks to a flat
 * list of all blocks.
 *
 * @param array $blocks A list of WordPress blocks.
 *
 * @return array A flattened list of WordPress blocks.
 */
function a8csp_podcast_feed_flatten_blocks( $blocks ) {
	$flattened_blocks = array();

	foreach ( $blocks as $block ) {
		$flattened_blocks[] = $block;

		if ( 0 < count( $block['innerBlocks'] ) ) {
			$inner_blocks = a8csp_podcast_feed_flatten_blocks( $block['innerBlocks'] );

			$flattened_blocks = array_merge( $flattened_blocks, $inner_blocks );
		}
	}

	return $flattened_blocks;
}

/**
 * Find every feed URL referenced by a published Podcast Feed block.
 *
 * @return string[] Unique feed URLs.
 */
function a8csp_podcast_feed_get_active_feed_urls(): array {
	global $wpdb;

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$posts = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT ID, post_content FROM {$wpdb->posts} WHERE post_content LIKE %s AND post_status = 'publish'",
			'%wp:a8csp/podcast-feed%'
		)
	);

	$feed_urls = array();

	foreach ( $posts as $post ) {
		$blocks = parse_blocks( $post->post_content );
		$blocks = a8csp_podcast_feed_flatten_blocks( $blocks );

		foreach ( $blocks as $block ) {
			if ( 'a8csp/podcast-feed' === $block['blockName'] && ! empty( $block['attrs']['feedUrl'] ) ) {
				$feed_urls[] = $block['attrs']['feedUrl'];
			}
		}
	}

	return array_values( array_unique( $feed_urls ) );
}

/**
 * Cron callback to refresh all podcast feeds found in published content.
 *
 * Each feed is parsed and the most recent items (capped via the
 * `a8csp_podcast_feed_max_synced_items` filter) are synced into the CPT cache.
 *
 * @return void
 */
function a8csp_podcast_feed_refresh_all_feeds(): void {
	foreach ( a8csp_podcast_feed_get_active_feed_urls() as $feed_url ) {
		$parsed = a8csp_podcast_feed_fetch_and_parse_feed( $feed_url );

		if ( ! is_wp_error( $parsed ) ) {
			a8csp_podcast_feed_sync_episodes( $feed_url, $parsed );
		}
	}
}

/**
 * Cron callback to remove cached episodes that are no longer present in the
 * live feed.
 *
 * Runs against the full parsed feed (no per-request cap) so older episodes
 * that fall outside the regular sync window are still preserved as long as the
 * source feed continues to list them.
 *
 * @return void
 */
function a8csp_podcast_feed_prune_all_feeds(): void {
	foreach ( a8csp_podcast_feed_get_active_feed_urls() as $feed_url ) {
		$parsed = a8csp_podcast_feed_fetch_and_parse_feed( $feed_url );

		if ( is_wp_error( $parsed ) ) {
			continue;
		}

		$full_guids = array();

		foreach ( $parsed as $episode ) {
			$full_guids[] = a8csp_podcast_feed_generate_episode_guid( $feed_url, $episode );
		}

		if ( empty( $full_guids ) ) {
			continue;
		}

		a8csp_podcast_feed_remove_stale_episodes( $feed_url, $full_guids );
	}
}
