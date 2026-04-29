<?php

defined( 'ABSPATH' ) || exit;

$a8csp_bp_groups_args = array(
	'custom_query'    => true,
	'populate_extras' => false,
);

if ( isset( $attributes['groupType'] ) && ! empty( $attributes['groupType'] ) ) {
	if ( 'active' === $attributes['groupType'] ) {
		$group_types = \bp_groups_get_group_types( array(), 'names' );
		if ( 0 < count( $group_types ) ) {
			$a8csp_bp_groups_args['group_type__not_in'] = $group_types;
		}
	} else {
		$a8csp_bp_groups_args['group_type__in'] = $attributes['groupType'];
	}
}

if ( isset( $attributes['groupOrder'] ) && ! empty( $attributes['groupOrder'] ) ) {
	$a8csp_bp_groups_args['type'] = $attributes['groupOrder'];
}

if ( isset( $attributes['perPage'] ) && ! empty( $attributes['perPage'] ) ) {
	$a8csp_bp_groups_args['per_page'] = (int) $attributes['perPage'];
}

$groups = groups_get_groups( $a8csp_bp_groups_args );

if ( 0 === $groups['total'] ) {
	return;
}

?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>

	<?php
	foreach ( $groups['groups'] as $group ) {
		?>
		<div class="bp-group-item">
			<?php
			// Render inner blocks with group context
			$block_instance = $block->parsed_block;

			// Set context for inner blocks
			$block_instance['context'] = array(
				'postId'   => $group->id,
				'postType' => 'bp_group',
			);

			$block_instance['blockName'] = 'core/null';

			$filter_block_context = static function ( $context ) use ( $group ) {
				$context['postType'] = 'bp_group';
				$context['postId']   = $group->id;
				return $context;
			};

			add_filter( 'render_block_context', $filter_block_context, 1 );

			$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );

			remove_filter( 'render_block_context', $filter_block_context, 1 );

			echo wp_kses_post( $block_content );
		?>
		</div>
	<?php } ?>
</div>
