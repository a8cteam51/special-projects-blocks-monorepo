<?php
// Adds Twenty Twenty-Five's bundled Parthenon photo to the media library as attachment 2001.
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
$images = array(
	2001 => array( 'parthenon-square.webp', 'Parthenon' ),
);
$dir = wp_upload_dir()['basedir'] . '/playground';
wp_mkdir_p( $dir );
foreach ( $images as $id => list( $file, $title ) ) {
	copy( get_theme_file_path( 'assets/images/' . $file ), "$dir/$file" );
	$attachment_id = wp_insert_attachment( array( 'import_id' => $id, 'post_title' => $title, 'post_mime_type' => 'image/webp', 'post_status' => 'inherit' ), "$dir/$file" );
	wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, "$dir/$file" ) );
}
