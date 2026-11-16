<?php
/**
 * Pattern: Story: Photo Carousel. A Photo Carousel with three photos, each with its own caption.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:catchlight-features/photo-carousel -->
<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'landscape-1' ) ); ?>" alt=""/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Replace this photo. The carousel works best with three to six images. Captions say who, where, and what is happening, and end with the date, like April 11, 2023.', 'catchlight-features' ); ?></figcaption></figure>
<!-- /wp:image -->
<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'landscape-2' ) ); ?>" alt=""/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Replace this photo. Name the people in the frame and add a line of context about their lives or their part in the story. July 17, 2022.', 'catchlight-features' ); ?></figcaption></figure>
<!-- /wp:image -->
<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'landscape-3' ) ); ?>" alt=""/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Replace this photo. Who is pictured, where they are, and what is happening, ending with the date. September 18, 2022.', 'catchlight-features' ); ?></figcaption></figure>
<!-- /wp:image -->
<!-- /wp:catchlight-features/photo-carousel -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
