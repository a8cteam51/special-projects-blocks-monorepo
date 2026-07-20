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

$members_count     = $members['count'];
$show_avatars      = $attributes['showAvatars'] ?? true;
$show_member_count = $attributes['showMemberCount'] ?? true;
$member_link       = $attributes['memberLink'] ?? true;
$all_members_style = $attributes['showAllMembersStyle'] ?? 'button';
$members_per_page  = $attributes['perPage'] ?? 5;
$count_text        = $attributes['countText'] ?? __( 'members', 'bp-groups-blocks' );
$all_members_text  = $attributes['allMembersText'] ?? __( 'View All', 'bp-groups-blocks' );
$size              = $attributes['avatarSize'] ?? 50;
$img_size          = $size < 50 ? 'thumb' : 'full';
$i                 = 1;
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	printf(
		'<p class="bp-groups-contributors__count">%s%s %s</p>',
		$show_member_count ? intval( $members_count ) . ' ' : '',
		esc_html( $count_text ),
		$show_avatars && ( $members_count > $members_per_page ) && 'button' === $all_members_style ? '<button class="bp-groups-contributors__view-all" tabindex="0">' . esc_html( $all_members_text ) . '</button>' : ''
	);
	?>

	<?php if ( $show_avatars ) { ?>
		<ul class="bp-groups-contributors__avatars">
			<?php
			if ( bp_group_has_members( $args ) ) {
				while ( bp_group_members() ) {
					bp_group_the_member();

					$member_avatar = bp_get_group_member_avatar(
						array(
							'type'   => $img_size,
							'width'  => $size,
							'height' => $size,
						)
					);

					$member_domain = $member_link ? bp_get_group_member_domain() : '';
					?>
						<li
							class="bp-groups-contributors__avatar"
							<?php echo $i > $members_per_page ? 'hidden' : ''; ?>
						>
							<?php
							if ( $member_link ) {
								printf(
									'<a href="%s" class="bp-groups-contributors__avatar-link">%s</a>',
									esc_url( $member_domain ),
									wp_kses_post( $member_avatar )
								);
							} else {
								echo wp_kses_post( $member_avatar );
							}
							?>
						</li>
					<?php
					++$i;
				}
				if ( $show_avatars && ( $members_count > $members_per_page ) && 'link' === $all_members_style ) {
					printf(
						'<li class="bp-groups-contributors__avatar bp-groups-contributors__avatar--more" %s><button data-size="%s" class="bp-groups-contributors__view-all" tabindex="0">%s</button></li>',
						( $members_count > $members_per_page ) ? '' : 'hidden',
						esc_attr( $size ),
						esc_html( '+' . ( $members_count - $members_per_page ) )
					);
				}
			}
			?>
		</ul>
	<?php } ?>
</div>
