<?php

defined( 'ABSPATH' ) || exit;

$a8csp_bp_members_args = array(
	'custom_query'    => true,
	'populate_extras' => false,
);

if ( isset( $attributes['memberType'] ) && ! empty( $attributes['memberType'] ) ) {
	$a8csp_bp_members_args['member_type__in'] = $attributes['memberType'];
}

if ( isset( $attributes['memberOrder'] ) && ! empty( $attributes['memberOrder'] ) ) {
	$a8csp_bp_members_args['type'] = $attributes['memberOrder'];
}

if ( isset( $attributes['perPage'] ) && ! empty( $attributes['perPage'] ) ) {
	$a8csp_bp_members_args['per_page'] = (int) $attributes['perPage'];
}

// Use BP_User_Query directly to avoid template conflicts
$a8csp_bp_members_user_query = new BP_User_Query( $a8csp_bp_members_args );

if ( ! empty( $a8csp_bp_members_user_query->results ) ) {
	?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	foreach ( $a8csp_bp_members_user_query->results as $a8csp_bp_members_user ) {
		// Set up member ID
		$a8csp_bp_members_member_id = $a8csp_bp_members_user->ID;
		?>
		<div class="bp-member-item">
			<?php
			// Render inner blocks with member context
			$block_instance = $block->parsed_block;

			// Set context for inner blocks
			$block_instance['context'] = array(
				'postId'   => $a8csp_bp_members_member_id,
				'postType' => 'bp_user',
			);

			$block_instance['blockName'] = 'core/null';

			$filter_block_context = static function ( $context ) use ( $a8csp_bp_members_member_id ) {
				$context['postType'] = 'bp_user';
				$context['postId']   = $a8csp_bp_members_member_id;
				return $context;
			};

			add_filter( 'render_block_context', $filter_block_context, 1 );

			$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );

			remove_filter( 'render_block_context', $filter_block_context, 1 );

			echo wp_kses_post( $block_content );
		?>
		</div>
		<?php
	}
	?>
</div>
	<?php
}
