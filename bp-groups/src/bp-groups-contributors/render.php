<?php
use A8CSP\BP_GROUPS\Groups_Block_Bindings;

defined( 'ABSPATH' ) || exit;

$group = Groups_Block_Bindings::get_current_group( $block->context );

if ( 0 === $group ) {
	return '';
}

$args = array(
	'group_id'   => $group->id,
	'group_role' => array( 'admin', 'mod', 'member' ),
);

$members = groups_get_group_members( $args );

if ( false === $members ) {
	return '';
}

$members_count    = $members['count'];
$members_per_page = $attributes['perPage'] ?? 5;
$count_text       = $attributes['countText'] ?? __( 'members', 'bp-groups-blocks' );
$all_members_text = $attributes['allMembersText'] ?? __( 'View All', 'bp-groups-blocks' );
$size             = $attributes['avatarSize'] ?? 50;
$img_size         = $size < 50 ? 'thumb' : 'full';
$i                = 1;
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	printf(
		'<p class="bp-groups-contributors__count">%d %s %s</p>',
		intval( $members_count ),
		esc_html( $count_text ),
		$members_count > $members_per_page ? '<button class="bp-groups-contributors__view-all" tabindex="0">' . esc_html( $all_members_text ) . '</button>' : ''
	);
	?>

	<ul class="bp-groups-contributors__avatars">
		<?php
		if ( bp_group_has_members( $args ) ) {
			while ( bp_group_members() ) {
				bp_group_the_member();
				?>
					<li
						class="bp-groups-contributors__avatar"
						<?php echo $i > $members_per_page ? 'hidden' : ''; ?>
					>
						<?php
						echo wp_kses_post(
							bp_get_group_member_avatar(
								array(
									'type'   => $img_size,
									'width'  => $size,
									'height' => $size,
								)
							)
						);
						?>
					</li>
				<?php
				++$i;
			}
		}
		?>
	</ul>
</div>
