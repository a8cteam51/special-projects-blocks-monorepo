<?php
if ( ! bp_is_group() ) {
	return '';
}

$group = groups_get_current_group();

if ( ! $group ) {
	return '';
}

$args = array(
    'group_id' => $group->id,
	'group_role' => ['admin', 'mod', 'member'],
);

$members = groups_get_group_members( $args );

if ( false === $members ) {
	return '';
}

$members_count = $members['count'];
$per_page = $attributes['perPage'] ?? 5;
$count_text = $attributes['countText'] ?? __('members', 'bp-groups-contributors');
$all_members_text = $attributes['allMembersText'] ?? __('View All', 'bp-groups-contributors');
$size = $attributes['avatarSize'] ?? 50;
$img_size = $size < 50 ? 'thumb' : 'full';
$i = 1;
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php printf(
		'<p class="bp-groups-contributors__count">%d %s %s</p>',
		intval( $members_count ),
		esc_html( $count_text ),
		$members_count > $per_page ? '<button class="bp-groups-contributors__view-all" tabindex="0">' . esc_html( $all_members_text ) . '</button>' : ''
	); ?>

	<ul class="bp-groups-contributors__avatars">
		<?php if ( bp_group_has_members( $args ) ) {
			while ( bp_group_members() ) { bp_group_the_member(); ?>
					<li
						class="bp-groups-contributors__avatar"
						<?php echo $i > $per_page ? 'hidden' : ''; ?>
					>
						<?php echo bp_get_group_member_avatar(array(
							'type' => $img_size,
							'width' => $size,
							'height' => $size,
						)); ?>
					</li>
			<?php $i++;
			}
		} ?>
	</ul>
</div>