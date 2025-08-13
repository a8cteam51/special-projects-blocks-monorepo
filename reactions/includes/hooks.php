<?php
/**
 * Show notice if the reactions table is missing.
 *
 * @return void
 */
function wpcomsp_reactions_table_missing_notice(): void {
	if ( wpcomsp_reactions_table_exists() ) {
		return;
	}

	$nonce = wp_create_nonce( 'wpcomsp_reactions_create_table_nonce' );
	?>
	<div class="notice notice-error" style="display:flex;align-items:center;gap:1rem;">
		<p><?php esc_html_e( 'The Reactions table is missing.', 'reactions' ); ?></p>
		<form method="post">
			<input type="hidden" name="_wpnonce" value="<?php echo esc_attr( $nonce ); ?>" />
			<input type="submit" class="button-primary" name="wpcomsp_create_table" value="<?php esc_attr_e( 'Create Table', 'reactions' ); ?>" />
		</form>
	</div>
	<?php
}
add_action( 'admin_notices', 'wpcomsp_reactions_table_missing_notice' );

/**
 * Filter the reactions block to add the interactive API attributes.
 *
 * @param string   $block_content The block content.
 * @param array    $block         The block name and attributes.
 * @param WP_Block $instance      The block instance.
 *
 * @return string The updated block content.
 */
function wpcomsp_reactions_block_prepend_interactive_directives( string $block_content, array $block, WP_Block $instance ): string {
	$pid  = (int) $instance->context['postId'];
	$mode = $block['attrs']['mode'] ?? 'default';
	$uid  = 'u-' . wp_generate_password( 8, false );

	// Set the interactive API init state.
	wp_interactivity_state(
		'wpcomsp/reactions',
		array(
			'nonce'  => wp_create_nonce( 'wp_rest' ),
			'root'   => esc_url_raw( rest_url() ),
			'errors' => array(
				'invalidToken' => esc_html__( 'Invalid Token', 'reactions' ),
			),
			'srv'    => array(
				'reactions' => array(
					$pid => wpcomsp_reactions_get_by_postid( $pid ),
				),
			),
			'usr'    => array(
				'reactions' => array(),
			),
		)
	);

	// Set the interactive API directives.
	$tags = new WP_HTML_Tag_Processor( $block_content );
	$tags->next_tag();
	$tags->set_attribute( 'data-wp-interactive', 'wpcomsp/reactions' );
	$tags->set_attribute( 'data-wp-init', 'callbacks.init' );
	$tags->set_attribute( 'data-wp-context', '{"postId":' . $pid . ', "uid":"' . $uid . '"}' );
	$tags->set_attribute( 'data-wp-class--wp-block-wpcomsp-reactions--has-reaction', 'state.hasAnyReaction' );

	if ( 'popover' === $mode ) {
		$tags->next_tag( 'button' );
		$tags->set_attribute( 'popovertarget', 'wp-block-wpcomsp-reactions__popover-' . $uid );

		$tags->next_tag( 'ul' );
		$tags->set_attribute( 'popover', '' );
		$tags->set_attribute( 'id', 'wp-block-wpcomsp-reactions__popover-' . $uid );
		$tags->set_attribute( 'data-wp-style--top', 'state.popoverTop' );
		$tags->set_attribute( 'data-wp-style--left', 'state.popoverLeft' );
		$tags->set_attribute( 'data-wp-on-window--resize', 'callbacks.positionPopover' );
		$tags->set_attribute( 'data-wp-run', 'callbacks.positionPopover' );
	}

	return $tags->get_updated_html();
}
add_filter( 'render_block_wpcomsp/reactions', 'wpcomsp_reactions_block_prepend_interactive_directives', 10, 3 );

/**
 * Add the reactions count column to the admin post and notes CPT list.
 *
 * @param array $columns The post list columns.
 *
 * @return array The updated post list columns.
 */
function wpcomsp_reactions_admin_add_reactions_count_column( array $columns ): array {
	$columns['reactions_count'] = esc_html__( 'Reactions Count', 'reactions' );
	return $columns;
}
add_filter( 'manage_post_posts_columns', 'wpcomsp_reactions_admin_add_reactions_count_column' );
add_filter( 'manage_note_posts_columns', 'wpcomsp_reactions_admin_add_reactions_count_column' );

/**
 * Display the reactions count in the admin post and notes CPT list.
 *
 * @param string  $column  The column name.
 * @param integer $post_id The post ID.
 *
 * @return void
 */
function wpcomsp_reactions_admin_reactions_counts( string $column, int $post_id ): void {
	if ( 'reactions_count' === $column ) {
		$reactions = wpcomsp_reactions_get_by_postid( $post_id );
		echo count( $reactions );
	}
}
add_action( 'manage_post_posts_custom_column', 'wpcomsp_reactions_admin_reactions_counts', 10, 2 );
add_action( 'manage_note_posts_custom_column', 'wpcomsp_reactions_admin_reactions_counts', 10, 2 );

/**
 * Adds Reactions Data submenu to the Posts menu.
 *
 * @return void
 */
function wpcomsp_reactions_admin_menu(): void {
	add_submenu_page(
		'edit.php',
		esc_html__( 'Reactions Data', 'reactions' ),
		esc_html__( 'Reactions Data', 'reactions' ),
		'manage_options',
		'wpcomsp-reactions-dataviews',
		function () {
			printf(
				'<h1>%s</h1><div id="wpcomsp-reactions-dataviews"></div>',
				esc_html__( 'Reactions Data', 'reactions' )
			);
		}
	);
}
add_action( 'admin_menu', 'wpcomsp_reactions_admin_menu' );

/**
 * Enqueues admin scripts for dataviews.
 *
 * @param string $hook_suffix The current admin page.
 *
 * @return void
 */
function wpcomsp_reactions_admin_scripts( string $hook_suffix ): void {
	if ( 'posts_page_wpcomsp-reactions-dataviews' !== $hook_suffix ) {
		return;
	}

	$asset_file = WPCOMSP_REACTIONS_DIR . 'build/reactions-dataviews/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		'wpcomsp-reactions-dataviews',
		WPCOMSP_REACTIONS_URL . 'build/reactions-dataviews/index.js',
		$asset['dependencies'],
		$asset['version'],
		array(
			'in_footer' => true,
		)
	);

	wp_localize_script(
		'wpcomsp-reactions-dataviews',
		'wpcomspReactionsDataViews',
		array(
			'data' => wpcomsp_reactions_get_reactions_data(),
		)
	);

	wp_enqueue_style(
		'wpcomsp-reactions-dataviews',
		WPCOMSP_REACTIONS_URL . 'build/reactions-dataviews/style-index.css',
		array( 'wp-components' ),
		$asset['version'],
	);
}
add_action( 'admin_enqueue_scripts', 'wpcomsp_reactions_admin_scripts' );
