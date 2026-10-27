<?php
// Adds Twenty Twenty-Five's bundled images to the media library with fixed IDs.
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
$images = array(
	2001 => array( 'typewriter.webp', 'Typewriter', 'A person typing on a typewriter.' ),
	2002 => array( 'flower-meadow-square.webp', 'Flower meadow', 'Wildflowers in a meadow below a lone tree.' ),
	2003 => array( 'botany-flowers.webp', 'Calla lilies', 'Calla lilies photographed in a studio.' ),
	2004 => array( 'marshland-birds-square.webp', 'Marshland birds', 'Two wading birds on the marsh at sunset.' ),
	2005 => array( 'red-hibiscus-closeup.webp', 'Red hibiscus', 'A red hibiscus flower against a dark background.' ),
	2006 => array( 'parthenon-square.webp', 'Parthenon', 'The Parthenon on the Acropolis, Athens.' ),
);
$dir = wp_upload_dir()['basedir'] . '/playground';
wp_mkdir_p( $dir );
foreach ( $images as $id => list( $file, $title, $caption ) ) {
	copy( get_theme_file_path( 'assets/images/' . $file ), "$dir/$file" );
	$attachment_id = wp_insert_attachment( array( 'import_id' => $id, 'post_title' => $title, 'post_excerpt' => $caption, 'post_mime_type' => 'image/webp', 'post_status' => 'inherit' ), "$dir/$file" );
	wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, "$dir/$file" ) );
}
