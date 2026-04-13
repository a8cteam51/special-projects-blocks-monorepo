<?php

namespace A8CSP\BP_GROUPS;

defined( 'ABSPATH' ) || exit;

/**
 * Class Groups_Block_Bindings
 *
 * Code to change the BuddyPress groups component.
 *
 * @package A8CSP\BP_GROUPS
 */
class Groups_Block_Bindings {
	/**
	 * Registers block bindings for BuddyPress groups.
	 *
	 * @return void
	 */
	public static function group_block_bindings(): void {

		register_block_bindings_source(
			'bp-groups/group-heading',
			array(
				'label'              => __( 'Group Name', 'bp-groups' ),
				'get_value_callback' => array( __CLASS__, 'group_heading' ),
				'uses_context'       => array( 'postId', 'postType' ),
			),
		);

		register_block_bindings_source(
			'bp-groups/group-description',
			array(
				'label'              => __( 'Group Description', 'bp-groups' ),
				'get_value_callback' => array( __CLASS__, 'group_description' ),
				'uses_context'       => array( 'postId', 'postType' ),
			),
		);

		if ( \bp_is_active( 'groups', 'cover_image' ) ) {
			register_block_bindings_source(
				'bp-groups/group-cover-image',
				array(
					'label'              => __( 'Group Cover Image', 'bp-groups' ),
					'get_value_callback' => array( __CLASS__, 'group_cover_image' ),
					'uses_context'       => array( 'postId', 'postType' ),
				),
			);
		}

		if ( ! bp_disable_group_avatar_uploads() ) {
			register_block_bindings_source(
				'bp-groups/group-avatar',
				array(
					'label'              => __( 'Group Avatar', 'bp-groups' ),
					'get_value_callback' => array( __CLASS__, 'group_avatar' ),
					'uses_context'       => array( 'postId', 'postType' ),
				),
			);
		}
	}

	/**
	 * Retrieves the cover image URL of the current BuddyPress group.
	 *
	 * @param array<mixed> $source_args    The block binding source arguments.
	 * @param \WP_Block    $block_instance The block instance for which the value is being retrieved.
	 *
	 * @return string The group cover image URL, or an empty string if not in a group context.
	 */
	public static function group_cover_image( $source_args, $block_instance ): string {
		$group = self::get_current_group( $block_instance->context );

		if ( ! $group instanceof \BP_Groups_Group ) {
			return '';
		}

		return bp_get_group_cover_url( $group );
	}

	/**
	 * Retrieves the avatar URL of the current BuddyPress group.
	 *
	 * @param array<mixed> $source_args    The block binding source arguments.
	 * @param \WP_Block    $block_instance The block instance for which the value is being retrieved.
	 *
	 * @return string The group avatar URL, or an empty string if not in a group context.
	 */
	public static function group_avatar( $source_args, $block_instance ): string {
		$group = self::get_current_group( $block_instance->context );

		if ( ! $group instanceof \BP_Groups_Group ) {
			return '';
		}

		return bp_core_fetch_avatar(
			array(
				'item_id' => $group->id,
				'object'  => 'group',
				'type'    => 'full',
				'html'    => false,
			)
		);
	}

	/**
	 * Retrieves the group heading for block bindings.
	 *
	 * @param array<mixed> $source_args    The block binding source arguments.
	 * @param \WP_Block    $block_instance The block instance for which the value is being retrieved.
	 *
	 * @return string The group heading, potentially wrapped in a link to the group's page.
	 */
	public static function group_heading( array $source_args, $block_instance ): string {

		$group   = self::get_current_group( $block_instance->context );
		$heading = $group instanceof \BP_Groups_Group ? $group->name : '';
		$url     = $group instanceof \BP_Groups_Group ? bp_get_group_url( $group ) : '';

		if ( '' !== $url ) {
			$heading = sprintf( '<a href="%s">%s</a>', esc_url( $url ), esc_html( $heading ) );
		} else {
			$heading = esc_html( $heading );
		}

		return $heading;
	}

	/**
	 * Retrieves the group description for block bindings.
	 *
	 * @param array<mixed> $source_args    The block binding source arguments.
	 * @param \WP_Block    $block_instance The block instance for which the value is being retrieved.
	 *
	 * @return string The group description, or an empty string if not in a group context.
	 */
	public static function group_description( array $source_args, $block_instance ): string {
		$group = self::get_current_group( $block_instance->context );

		if ( ! $group instanceof \BP_Groups_Group ) {
			return '';
		}

		return esc_html( $group->description );
	}

	/**
	 * Retrieves the current BuddyPress group object.
	 *
	 * @param array<mixed> $context The block context which may contain 'postId' and 'postType' for group blocks.
	 *
	 * @return \BP_Groups_Group|int The current group object, or 0 if not in a group context.
	 */
	public static function get_current_group( array $context = array() ) {

		$group     = 0;
		$post_id   = isset( $context['postId'] ) ? $context['postId'] : 0;
		$post_type = isset( $context['postType'] ) ? $context['postType'] : '';

		switch ( true ) {
			case ( 'bp_group' === $post_type && 0 < $post_id ):
				$group = groups_get_group( $post_id );
				break;
			case ( 0 < groups_get_current_group() ):
				$group = groups_get_current_group();
				break;

			case ( 0 < bp_get_group() ):
				$group = bp_get_group();
				break;
		}

		if ( ! $group instanceof \BP_Groups_Group ) {
			return 0;
		}

		return $group;
	}
}
