<?php
// Creates demo BuddyPress members with profile fields, avatars and cover images.
// Runs after BuddyPress has been installed (Members and Extended Profiles components active).
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
global $wpdb;

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

// Profile fields in the default "Base" field group (field 1 is the member's name).
$location_id = xprofile_insert_field(
	array(
		'field_group_id' => 1,
		'type'           => 'textbox',
		'name'           => 'Location',
		'field_order'    => 1,
	)
);
$about_id    = xprofile_insert_field(
	array(
		'field_group_id' => 1,
		'type'           => 'textarea',
		'name'           => 'About',
		'field_order'    => 2,
	)
);
$interest_id = xprofile_insert_field(
	array(
		'field_group_id' => 1,
		'type'           => 'checkbox',
		'name'           => 'Interests',
		'field_order'    => 3,
	)
);
$interests   = array( 'Gardening', 'Reading', 'Running', 'Photography', 'Cooking', 'Music' );
foreach ( $interests as $index => $option ) {
	$wpdb->insert(
		buddypress()->profile->table_name_fields,
		array(
			'group_id'     => 1,
			'parent_id'    => $interest_id,
			'type'         => 'option',
			'name'         => $option,
			'description'  => '',
			'option_order' => $index + 1,
		)
	);
}
wp_cache_flush();

// Members: login => name, avatar, cover image, location, about, interests. "admin" is the existing user 1.
$people = array(
	'admin' => array( 'Site Admin', 'akaka-falls-state-park-flora.webp', 'poster-image-background.webp', 'Online', 'Looks after this community site.', array( 'Music', 'Reading' ) ),
	'maya'  => array( 'Maya Lopez', 'coral-square.webp', 'botany-flowers-closeup.webp', 'Lisbon', "Runs the seed library.\nAlways happy to swap tomato seedlings.", array( 'Gardening', 'Cooking' ) ),
	'noah'  => array( 'Noah Patel', 'flower-meadow-square.webp', 'coming-soon-bg-image.webp', 'Toronto', 'Weekend trail runner and amateur birdwatcher.', array( 'Running', 'Photography' ) ),
	'lena'  => array( 'Lena Fischer', 'marshland-birds-square.webp', 'northern-buttercups-flowers.webp', 'Hamburg', 'Reads a novel a week and reviews every one of them.', array( 'Reading', 'Music' ) ),
	'omar'  => array( 'Omar Haddad', 'parthenon-square.webp', 'location.webp', 'Amman', 'Architecture student who sketches the buildings he visits.', array( 'Photography', 'Reading' ) ),
	'grace' => array( 'Grace Kim', 'dallas-creek-square.webp', 'red-hibiscus-closeup.webp', 'Seoul', 'Bakes bread on Saturdays and shares the recipes.', array( 'Cooking', 'Gardening', 'Music' ) ),
	'tomas' => array( 'Tomas Becker', 'campanula-alliariifolia-flower.webp', 'grid-flower-1.webp', 'Vienna', 'Plays cello in a community orchestra.', array( 'Music' ) ),
	'sofia' => array( 'Sofia Rossi', 'star-thristle-flower.webp', 'botany-flowers.webp', 'Bologna', 'Collects wild flowers and presses them into notebooks.', array( 'Gardening', 'Photography' ) ),
	'ian'   => array( 'Ian Walsh', 'delphinium-flowers.webp', 'typewriter.webp', 'Galway', 'Writes short stories on an old typewriter.', array( 'Reading', 'Running' ) ),
);

$i = 0;
foreach ( $people as $login => list( $name, $avatar, $cover, $location, $about, $member_interests ) ) {
	$user_id = 'admin' === $login ? 1 : wp_insert_user(
		array(
			'user_login'   => $login,
			'user_pass'    => wp_generate_password(),
			'user_email'   => "$login@example.com",
			'display_name' => $name,
			'role'         => 'subscriber',
		)
	);
	xprofile_set_field_data( 1, $user_id, $name );
	xprofile_set_field_data( $location_id, $user_id, $location );
	xprofile_set_field_data( $about_id, $user_id, $about );
	xprofile_set_field_data( $interest_id, $user_id, $member_interests );
	bp_update_user_last_activity( $user_id, gmdate( 'Y-m-d H:i:s', time() - ( $i++ ) * HOUR_IN_SECONDS ) );

	playground_bp_avatar( $avatar, "$uploads/avatars/$user_id" );
	wp_mkdir_p( "$uploads/buddypress/members/$user_id/cover-image" );
	copy( get_theme_file_path( 'assets/images/' . $cover ), "$uploads/buddypress/members/$user_id/cover-image/playground-cover-image.webp" );
}
