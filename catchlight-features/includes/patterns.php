<?php
/**
 * Story patterns: the Story Starter and the pieces it is built from, in a
 * "CatchLight Story" inserter category. The markup lives in patterns/, one file
 * per pattern, and uses core blocks plus the Photo Carousel only, so it works
 * in the classic Newspack theme. Photos are neutral placeholders shipped in
 * assets/patterns/.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Returns the URL of a placeholder photo shipped with the plugin.
 *
 * @param string $name File name without the extension, e.g. `landscape-1`.
 *
 * @return string
 */
function catchlight_features_photo_carousel_pattern_image( string $name ): string {
	return plugins_url( 'assets/patterns/' . $name . '.svg', dirname( __DIR__ ) . '/catchlight-features.php' );
}

/**
 * Returns a pattern's block markup from its file in patterns/.
 *
 * @param string $slug Pattern file name without the extension.
 *
 * @return string
 */
function catchlight_features_photo_carousel_pattern_markup( string $slug ): string {
	$file = dirname( __DIR__ ) . '/patterns/' . $slug . '.php';
	if ( ! is_readable( $file ) ) {
		return '';
	}

	ob_start();
	include $file;
	return (string) ob_get_clean();
}

/**
 * Registers the pattern category and the story patterns.
 *
 * @return void
 */
function catchlight_features_photo_carousel_register_patterns() {
	register_block_pattern_category(
		'catchlight-story',
		array( 'label' => __( 'CatchLight Story', 'catchlight-features' ) )
	);

	$patterns = array(
		'story-starter'           => array(
			__( 'Story Starter', 'catchlight-features' ),
			__( 'A full photo story built from the Story pieces: opener, carousel, pull quote, photo pairs and single photos, with prompts for the text in between.', 'catchlight-features' ),
		),
		'story-opener'            => array(
			__( 'Story: Opener', 'catchlight-features' ),
			__( 'A one-sentence subheading and two opening paragraphs.', 'catchlight-features' ),
		),
		'story-photo-carousel'    => array(
			__( 'Story: Photo Carousel', 'catchlight-features' ),
			__( 'A Photo Carousel with three photos, each with its own caption.', 'catchlight-features' ),
		),
		'story-pull-quote'        => array(
			__( 'Story: Pull Quote', 'catchlight-features' ),
			__( 'A short pull quote from the story.', 'catchlight-features' ),
		),
		'story-photo-pair'        => array(
			__( 'Story: Photo Pair', 'catchlight-features' ),
			__( 'Two photos side by side, one larger than the other.', 'catchlight-features' ),
		),
		'story-offset-photo-pair' => array(
			__( 'Story: Offset Photo Pair', 'catchlight-features' ),
			__( 'Two staggered photos, for a before and after or two moments in one place.', 'catchlight-features' ),
		),
		'story-wide-photo'        => array(
			__( 'Story: Wide Photo', 'catchlight-features' ),
			__( 'A single photo wider than the text column.', 'catchlight-features' ),
		),
		'story-full-width-photo'  => array(
			__( 'Story: Full-Width Photo', 'catchlight-features' ),
			__( 'A single photo the full width of the screen.', 'catchlight-features' ),
		),
		'story-centered-photo'    => array(
			__( 'Story: Centered Photo', 'catchlight-features' ),
			__( 'A single centered photo.', 'catchlight-features' ),
		),
	);

	foreach ( $patterns as $slug => $labels ) {
		register_block_pattern(
			'catchlight-features/' . $slug,
			array(
				'title'       => $labels[0],
				'description' => $labels[1],
				'categories'  => array( 'catchlight-story' ),
				'postTypes'   => array( 'post', 'page' ),
				'content'     => catchlight_features_photo_carousel_pattern_markup( $slug ),
			)
		);
	}
}
add_action( 'init', 'catchlight_features_photo_carousel_register_patterns' );
