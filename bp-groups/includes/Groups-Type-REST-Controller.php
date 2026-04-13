<?php

namespace A8CSP\BP_GROUPS;

defined( 'ABSPATH' ) || exit;

/**
 * REST API controller for BuddyPress Group Types.
 *
 * Provides endpoints to retrieve group type information.
 *
 * @package A8CSP\BP_GROUPS
 */
class Groups_Type_REST_Controller extends \WP_REST_Controller {

	/**
	 * The namespace for the REST API.
	 *
	 * @var string
	 */
	protected $namespace = 'buddypress/v1';

	/**
	 * The base path for the REST API.
	 *
	 * @var string
	 */
	protected $rest_base = 'group-types';

	/**
	 * Initializes the class by registering the REST API routes.
	 *
	 * @return void
	 */
	public static function init(): void {
		$controller = new self();
		add_action( 'rest_api_init', array( $controller, 'register_routes' ) );
	}

	/**
	 * Registers the REST API routes for group types.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		// Get all group types.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => $this->get_collection_params(),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);

		// Get a single group type.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<type>[\w-]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'type' => array(
							'description' => __( 'Unique identifier for the group type.', 'a8csp-bp-groups' ),
							'type'        => 'string',
							'required'    => true,
						),
					),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Retrieves a collection of group types.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return \WP_REST_Response|\WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$group_types = \bp_groups_get_group_types( array(), 'objects' );

		if ( empty( $group_types ) ) {
			return new \WP_REST_Response( array(), 200 );
		}

		$data = array();
		foreach ( $group_types as $type_object ) {
			$item   = $this->prepare_item_for_response( $type_object, $request );
			$data[] = $this->prepare_response_for_collection( $item );
		}

		$response = rest_ensure_response( $data );
		$response->header( 'X-WP-Total', count( $group_types ) );
		$response->header( 'X-WP-TotalPages', 1 );

		return $response;
	}

	/**
	 * Retrieves a single group type.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return \WP_REST_Response|\WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $request ) {
		$type_name = $request->get_param( 'type' );
		$type      = \bp_groups_get_group_type_object( $type_name );

		if ( ! $type ) {
			return new \WP_Error(
				'rest_group_type_invalid',
				__( 'Invalid group type.', 'a8csp-bp-groups' ),
				array( 'status' => 404 )
			);
		}

		$data     = $this->prepare_item_for_response( $type, $request );
		$response = rest_ensure_response( $data );

		return $response;
	}

	/**
	 * Checks if a given request has access to read group types.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return true|\WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return true;
	}

	/**
	 * Checks if a given request has access to read a group type.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return true|\WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		if ( current_user_can( 'edit_pages' ) ) {
			return true;
		}
		return new \WP_Error(
			'rest_forbidden',
			__( 'You do not have permissions to view group types.', 'a8csp-bp-groups' ),
			array( 'status' => 403 )
		);
	}

	/**
	 * Prepares a group type object for serialization.
	 *
	 * @param object           $item    Group type object.
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return \WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $item, $request ) {
		$name = get_term_meta( $item->db_id, 'bp_type_singular_name', true );
		$data = array(
			'name'          => $name ? $name : $item->name,
			'slug'          => $item->name,
			'singular_name' => isset( $item->labels['singular_name'] ) ? $item->labels['singular_name'] : $item->name,
			'plural_name'   => isset( $item->labels['name'] ) ? $item->labels['name'] : $item->name,
			'has_directory' => isset( $item->has_directory ) ? $item->has_directory : false,
		);

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->filter_response_by_context( $data, $context );

		$response = rest_ensure_response( $data );
		$response->add_links( $this->prepare_links( $item ) );

		/**
		 * Filters the group type data for a REST API response.
		 *
		 * @param \WP_REST_Response $response The response object.
		 * @param object            $item     The group type object.
		 * @param \WP_REST_Request  $request  The request object.
		 */
		return apply_filters( 'a8csp_bp_rest_prepare_group_type', $response, $item, $request );
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param object $item Group type object.
	 *
	 * @return array<string,mixed> Links for the given group type.
	 */
	protected function prepare_links( $item ) {
		$links = array(
			'self'       => array(
				'href' => rest_url( sprintf( '%s/%s/%s', $this->namespace, $this->rest_base, $item->name ) ),
			),
			'collection' => array(
				'href' => rest_url( sprintf( '%s/%s', $this->namespace, $this->rest_base ) ),
			),
		);

		return $links;
	}

	/**
	 * Retrieves the group type schema, conforming to JSON Schema.
	 *
	 * @return array<string,mixed> Item schema data.
	 */
	public function get_item_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'group-type',
			'type'       => 'object',
			'properties' => array(
				'name'          => array(
					'description' => __( 'The unique identifier for the group type.', 'a8csp-bp-groups' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'slug'          => array(
					'description' => __( 'The slug for the group type.', 'a8csp-bp-groups' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'singular_name' => array(
					'description' => __( 'The singular name for the group type.', 'a8csp-bp-groups' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'plural_name'   => array(
					'description' => __( 'The plural name for the group type.', 'a8csp-bp-groups' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'has_directory' => array(
					'description' => __( 'Whether the group type has a directory.', 'a8csp-bp-groups' ),
					'type'        => 'boolean',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
			),
		);

		return $schema;
	}

	/**
	 * Retrieves the query params for collections.
	 *
	 * @return array<string,mixed> Collection parameters.
	 */
	public function get_collection_params() {
		return array(
			'context' => $this->get_context_param( array( 'default' => 'view' ) ),
		);
	}
}
