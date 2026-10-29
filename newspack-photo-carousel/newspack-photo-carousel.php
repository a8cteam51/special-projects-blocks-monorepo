<?php
/**
 * Plugin Name:       Newspack Photo Carousel
 * Description:       A one-photo-at-a-time carousel of curated images. Each slide is an Image block with its own caption, an empty caption falls back to the Media Library caption, and with the Newspack plugin active each slide also shows its Newspack photo credit, which can be edited from the image's sidebar. A thumbnail rail sits under the stage, the arrows and arrow keys page through the photos, touch swipes work on phones, and optional autoplay pauses on hover, focus and for visitors who prefer reduced motion. Only the current photo and its neighbours load, so the page weight stays flat however many photos the carousel holds. A Gallery block converts to a carousel and back.
 * Requires at least: 7.0
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            Automattic Special Projects Team
 * Author URI:        https://specialprojects.automattic.com/
 * Update URI:        https://github.com/a8cteam51/special-projects-blocks-monorepo/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       newspack-photo-carousel
 *
 * @package           wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require __DIR__ . '/includes/render-helpers.php';

/**
 * Registers the Photo Carousel block from the `blocks-manifest.php` that the
 * build writes, along with its assets.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 *
 * @return void
 */
function newspack_photo_carousel_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'newspack_photo_carousel_block_init' );

/**
 * Loads photo credit support only when the Newspack plugin provides credits.
 *
 * Checked on `init` rather than at include time: the root autoloader and a
 * plain activation load this file at different points, but every plugin has
 * loaded by `init`.
 *
 * @return void
 */
function newspack_photo_carousel_load_credits() {
	if ( ! method_exists( 'Newspack\Newspack_Image_Credits', 'get_media_credit_string' ) ) {
		return;
	}

	require_once __DIR__ . '/includes/class-newspack-photo-carousel-credits.php';
	Newspack_Photo_Carousel_Credits::instance();
}
add_action( 'init', 'newspack_photo_carousel_load_credits', 5 );
