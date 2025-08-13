<?php
/**
 * Register REST routes for reactions.
 *
 * @return void
 */
function wpcomsp_reactions_register_rest_routes(): void {
	register_rest_route(
		'wpcomsp-reactions/v1',
		'/react',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'wpcomsp_reactions_rest_update_reaction',
			'permission_callback' => 'wpcomsp_reactions_permissions_check',
		)
	);

	register_rest_route(
		'wpcomsp-reactions/v1',
		'/get-reaction',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'wpcomsp_reactions_rest_get_reaction',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'wpcomsp_reactions_register_rest_routes' );

/**
 * Check if user has permission to perform the action.
 *
 * @return boolean|WP_Error
 */
function wpcomsp_reactions_permissions_check(): bool|WP_Error {
	$nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';

	if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
		return new WP_Error(
			'invalid_nonce',
			esc_html__( 'Permission denied', 'reactions' ),
			array( 'status' => 403 )
		);
	}

	return true;
}

/**
 * Get reaction type for a post and token.
 *
 * @param WP_REST_Request $request The REST request.
 *
 * @return WP_REST_Response|WP_Error
 */
function wpcomsp_reactions_rest_get_reaction( WP_REST_Request $request ): WP_REST_Response|WP_Error {
	$post_id = (int) $request->get_param( 'postId' );
	$token   = sanitize_text_field( $request->get_param( 'token' ) );

	$response = wpcomsp_reactions_get_user_reaction( $token, $post_id );

	return rest_ensure_response( $response );
}

/**
 * Handle updating user reaction.
 *
 * @param WP_REST_Request $request The REST request.
 *
 * @return WP_REST_Response|WP_Error
 */
function wpcomsp_reactions_rest_update_reaction( $request ): WP_REST_Response|WP_Error {
	$post_id      = (int) $request->get_param( 'postId' );
	$new_reaction = sanitize_text_field( $request->get_param( 'reaction' ) );
	$token        = sanitize_text_field( $request->get_param( 'token' ) );

	$reactions = wpcomsp_reactions_update_reaction( $post_id, $new_reaction, $token );

	return rest_ensure_response( $reactions );
}
