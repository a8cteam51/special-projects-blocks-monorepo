<?php

namespace A8CAP\BP_MEMBERS;

defined( 'ABSPATH' ) || exit;

/**
 * Class responsible for registering block bindings for BuddyPress members.
 *
 * @package A8CAP\BP_MEMBERS
 */
class Block_Bindings {
	/**
	 * Registers block bindings for BuddyPress members.
	 *
	 * @return void
	 */
	public static function member_block_bindings(): void {
		if ( ! bp_disable_avatar_uploads() ) {
			register_block_bindings_source(
				'bp-members/member-avatar',
				array(
					'label'              => __( 'Member Avatar', 'bp-members-blocks' ),
					'get_value_callback' => array( __CLASS__, 'member_avatar' ),
					'uses_context'       => array( 'postId', 'postType' ),
				),
			);
		}

		if ( ! bp_disable_cover_image_uploads() ) {
			register_block_bindings_source(
				'bp-members/member-cover-image',
				array(
					'label'              => __( 'Member Cover Image', 'bp-members-blocks' ),
					'get_value_callback' => array( __CLASS__, 'member_cover_image' ),
					'uses_context'       => array( 'postId', 'postType' ),
				),
			);
		}

		register_block_bindings_source(
			'bp-members/member-heading',
			array(
				'label'              => __( 'Member Name', 'bp-members-blocks' ),
				'get_value_callback' => array( __CLASS__, 'member_heading' ),
				'uses_context'       => array( 'postId', 'postType' ),
			),
		);

		register_block_bindings_source(
			'bp-members/member-x-profile',
			array(
				'label'              => __( 'Member X Profile Data', 'bp-members-blocks' ),
				'get_value_callback' => array( __CLASS__, 'member_x_profile' ),
				'uses_context'       => array( 'postId', 'postType' ),
			),
		);
	}

	/**
	 * Retrieves the member avatar URL for block bindings.
	 *
	 * @param array<mixed> $source_args    The block binding source arguments.
	 * @param \WP_Block    $block_instance The block instance for which the value is being retrieved.
	 *
	 * @return string The URL of the member avatar.
	 */
	public static function member_avatar( array $source_args, $block_instance ): string {
		$avatar_url = bp_core_fetch_avatar(
			array(
				'item_id' => self::get_member_id( $block_instance->context ),
				'type'    => 'full',
				'html'    => false,
			)
		);

		return esc_url( $avatar_url );
	}

	/**
	 * Retrieves the member cover image URL for block bindings.
	 *
	 * @param array<mixed> $source_args    The block binding source arguments.
	 * @param \WP_Block    $block_instance The block instance for which the value is being retrieved.
	 *
	 * @return string The URL of the member cover image, or an empty string if not available.
	 */
	public static function member_cover_image( array $source_args, $block_instance ): string {
		$member_id = self::get_member_id( $block_instance->context );

		if ( 0 === $member_id ) {
			return '';
		}

		$url = bp_attachments_get_attachment(
			'url',
			array(
				'object_dir' => 'members',
				'item_id'    => $member_id,
			)
		);

		if ( false === $url || '' === $url ) {
			return '';
		}

		return esc_url( $url );
	}

	/**
	 * Retrieves the member heading for block bindings.
	 *
	 * @param array<mixed> $source_args    The block binding source arguments.
	 * @param \WP_Block    $block_instance The block instance for which the value is being retrieved.
	 *
	 * @return string The member heading, potentially wrapped in a link to the member's profile.
	 */
	public static function member_heading( array $source_args, $block_instance ): string {

		$heading = bp_core_get_user_displayname( self::get_member_id( $block_instance->context ) );
		$url     = bp_members_get_user_url( self::get_member_id( $block_instance->context ) );

		if ( '' !== $url && ! bp_is_user() ) {
			$heading = sprintf( '<a href="%s">%s</a>', esc_url( $url ), esc_html( $heading ) );
		} else {
			$heading = esc_html( $heading );
		}

		return $heading;
	}

	/**
	 * Retrieves the member X profile field value for block bindings.
	 *
	 * @param array<mixed> $source_args    The block binding source arguments, expected to contain 'field_id'.
	 * @param \WP_Block    $block_instance The block instance for which the value is being retrieved.
	 *
	 * @return string The value of the member X profile field, or an empty string if not found.
	 */
	public static function member_x_profile( array $source_args, $block_instance ): string {
		$member_id  = self::get_member_id( $block_instance->context );
		$field_name = isset( $source_args['field_id'] ) ? $source_args['field_id'] : '';
		$field_id   = xprofile_get_field_id_from_name( $field_name );

		if ( 0 === $field_id || null === $field_id ) {
			return '';
		}

		$data = bp_get_profile_field_data(
			array(
				'field'   => $field_id,
				'user_id' => $member_id,
			)
		);

		if ( '' === $data || false === $data ) {
			return '';
		}

		return apply_filters( 'bp_members_member_x_profile_binding', self::return_data_for_field( $data, $field_id, $member_id ), $data, $field_id, $member_id );
	}

	/**
	 * Retrieves the member profile field value for block bindings, specifically for tags.
	 *
	 * @param string|array<mixed> $data      The x-profile field data.
	 * @param integer             $field_id  The ID of the profile field.
	 * @param integer             $member_id The ID of the member.
	 *
	 * @return string The value of the member profile field formatted depending on its type.
	 */
	public static function return_data_for_field( $data, $field_id, $member_id ) {

		$type = \BP_XProfile_Field::get_type( $field_id );

		switch ( $type ) {
			case 'textarea':
				return wp_kses_post( nl2br( $data, true ) );
			case 'checkbox' && is_array( $data ):
			case 'multiselectbox' && is_array( $data ):
			case is_array( $data ):
				return sprintf( '<span>%s</span>', implode( '</span> <span>', $data ) );
			case 'url':
				return esc_url( $data );
			case 'checkbox_acceptance':
				return wp_kses_post( $data );
			case 'telephone':
				$phone_number = \BP_XProfile_ProfileData::get_value_byid( $field_id, $member_id );
				if ( '' === $phone_number || false === $phone_number ) {
					return '';
				}
				return wp_kses_post( $data );
			case 'datebox':
				return esc_html( $data );
			default:
				return esc_html( $data );
		}
	}

	/**
	 * Filter callback to add a link to the member's profile page when the image block is bound to the member avatar.
	 *
	 * @param string $block_content The original block content.
	 * @param array  $block         The block data.
	 * @param object $instance      The block instance containing context information.
	 *
	 * @return string The modified block content with a link to the member's profile page if applicable.
	 */
	public static function render_block_core_image_avatar( $block_content, $block, $instance ) {
		if ( isset( $block['attrs']['metadata']['bindings']['href']['source'] ) && 'bp-members/member-avatar' === $block['attrs']['metadata']['bindings']['href']['source'] ) {
			$member_id = self::get_member_id( $instance->context );
			if ( 0 !== $member_id ) {
				$member_url = bp_members_get_user_url( $member_id );

				if ( '' !== $member_url ) {
					$tags = new \WP_HTML_Tag_Processor( $block_content );
					$tags->next_tag( array( 'tag_name' => 'a' ) );
					$tags->set_attribute( 'href', $member_url );
					$block_content = $tags->get_updated_html();
				}
			}
		}
		return $block_content;
	}

	/**
	 * Retrieves the member ID for the current context.
	 *
	 * @param array<mixed> $context The block context which may contain 'postId' and 'postType' for member blocks.
	 *
	 * @return integer The member ID, or 0 if not in a member context.
	 */
	public static function get_member_id( array $context = array() ): int {

		$member_id = 0;

		$post_id   = isset( $context['postId'] ) ? $context['postId'] : 0;
		$post_type = isset( $context['postType'] ) ? $context['postType'] : '';

		if ( 0 < bp_get_member_user_id() ) {
			$member_id = bp_get_member_user_id();
		} elseif ( 0 < bp_displayed_user_id() ) {
			$member_id = bp_displayed_user_id();
		} elseif ( 'bp_user' === $post_type && 0 < $post_id ) {
			$member_id = $post_id;
		}

		return $member_id;
	}
}
