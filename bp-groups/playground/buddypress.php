<?php
// Creates demo BuddyPress members and groups with avatars, cover images and progress.
// Runs after BuddyPress has been installed with the Groups component active.
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$uploads = wp_upload_dir()['basedir'];

/**
 * Copies a Twenty Twenty-Five image into a BuddyPress avatar folder at BuddyPress's avatar sizes.
 *
 * @param string $file Image file name in the theme's assets/images folder.
 * @param string $dir  Avatar folder to write to.
 *
 * @return void
 */
function playground_bp_avatar( $file, $dir ) {
	wp_mkdir_p( $dir );
	$sizes = array(
		'bpfull'  => bp_core_avatar_full_width(),
		'bpthumb' => bp_core_avatar_thumb_width(),
	);
	foreach ( $sizes as $suffix => $size ) {
		$editor = wp_get_image_editor( get_theme_file_path( 'assets/images/' . $file ) );
		$editor->resize( $size, $size, true );
		$editor->save( "$dir/playground-$suffix.webp" );
	}
}

// Members: login => display name, avatar image.
$people = array(
	'maya'  => array( 'Maya Lopez', 'coral-square.webp' ),
	'noah'  => array( 'Noah Patel', 'flower-meadow-square.webp' ),
	'lena'  => array( 'Lena Fischer', 'marshland-birds-square.webp' ),
	'omar'  => array( 'Omar Haddad', 'parthenon-square.webp' ),
	'grace' => array( 'Grace Kim', 'dallas-creek-square.webp' ),
	'tomas' => array( 'Tomas Becker', 'campanula-alliariifolia-flower.webp' ),
	'sofia' => array( 'Sofia Rossi', 'star-thristle-flower.webp' ),
	'ian'   => array( 'Ian Walsh', 'delphinium-flowers.webp' ),
);

xprofile_set_field_data( 1, 1, 'Site Admin' );
bp_update_user_last_activity( 1, bp_core_current_time() );
playground_bp_avatar( 'akaka-falls-state-park-flora.webp', "$uploads/avatars/1" );

$user_ids = array();
foreach ( $people as $login => list( $name, $avatar ) ) {
	$user_id = wp_insert_user(
		array(
			'user_login'   => $login,
			'user_pass'    => wp_generate_password(),
			'user_email'   => "$login@example.com",
			'display_name' => $name,
			'role'         => 'subscriber',
		)
	);
	xprofile_set_field_data( 1, $user_id, $name );
	bp_update_user_last_activity( $user_id, gmdate( 'Y-m-d H:i:s', time() - count( $user_ids ) * HOUR_IN_SECONDS ) );
	playground_bp_avatar( $avatar, "$uploads/avatars/$user_id" );
	$user_ids[] = $user_id;
}

// Groups: name, description, cover image, avatar image, progress (%), members besides the admin.
$groups = array(
	array( 'Community Garden', 'Growing vegetables and flowers together on the shared plot every weekend.', 'botany-flowers-closeup.webp', 'flower-meadow-square.webp', 72, array_slice( $user_ids, 0, 8 ) ),
	array( 'Book Club', 'One novel a month, discussed over coffee on the last Thursday.', 'typewriter.webp', 'book-image.webp', 45, array_slice( $user_ids, 1, 4 ) ),
	array( 'Trail Runners', 'Early morning runs on the river trail, all paces welcome.', 'coming-soon-bg-image.webp', 'dallas-creek-square.webp', 88, array_slice( $user_ids, 2, 6 ) ),
);

foreach ( $groups as $index => list( $name, $description, $cover, $avatar, $progress, $members ) ) {
	// The creator (admin) becomes the first member and group admin.
	$group_id = groups_create_group(
		array(
			'creator_id'  => 1,
			'name'        => $name,
			'description' => $description,
			'slug'        => sanitize_title( $name ),
			'status'      => 'public',
		)
	);
	foreach ( $members as $user_id ) {
		groups_join_group( $group_id, $user_id );
	}
	groups_get_total_member_count( $group_id, true );
	groups_update_groupmeta( $group_id, 'last_activity', gmdate( 'Y-m-d H:i:s', time() - $index * HOUR_IN_SECONDS ) );
	// Read by the Progress Bar block; editable under the group's Manage > Group Progress screen.
	groups_update_groupmeta( $group_id, 'progress', $progress );

	playground_bp_avatar( $avatar, "$uploads/group-avatars/$group_id" );
	wp_mkdir_p( "$uploads/buddypress/groups/$group_id/cover-image" );
	copy( get_theme_file_path( 'assets/images/' . $cover ), "$uploads/buddypress/groups/$group_id/cover-image/playground-cover-image.webp" );
}
