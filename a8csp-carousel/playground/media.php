<?php
// Adds Twenty Twenty-Five's bundled images to the media library with fixed IDs:
// 2001-2005 for the gallery carousel, 2006-2009 as the posts' featured images.
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
$images = array(
	2001 => array( 'flower-meadow-square.webp', 'Flower meadow' ),
	2002 => array( 'coral-square.webp', 'Coral' ),
	2003 => array( 'marshland-birds-square.webp', 'Marshland birds' ),
	2004 => array( 'dallas-creek-square.webp', 'Red flower' ),
	2005 => array( 'parthenon-square.webp', 'Parthenon' ),
	2006 => array( 'red-hibiscus-closeup.webp', 'Red hibiscus' ),
	2007 => array( 'botany-flowers.webp', 'White blooms' ),
	2008 => array( 'northern-buttercups-flowers.webp', 'Buttercups' ),
	2009 => array( 'malibu-plantlife.webp', 'Purple bloom' ),
);
$dir = wp_upload_dir()['basedir'] . '/playground';
wp_mkdir_p( $dir );
foreach ( $images as $id => list( $file, $title ) ) {
	copy( get_theme_file_path( 'assets/images/' . $file ), "$dir/$file" );
	$attachment_id = wp_insert_attachment( array( 'import_id' => $id, 'post_title' => $title, 'post_mime_type' => 'image/webp', 'post_status' => 'inherit' ), "$dir/$file" );
	wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, "$dir/$file" ) );
}
