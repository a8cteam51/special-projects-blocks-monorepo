<?php
/**
 * Pattern: Story: Photo Pair. Two photos side by side, one larger than the other.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"58.33%"} -->
<div class="wp-block-column" style="flex-basis:58.33%"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'landscape-1' ) ); ?>" alt=""/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Replace this photo. Paired photos work well when they show two sides of the same place or moment. Captions say who, where, and what is happening, and end with the date. September 18, 2022.', 'catchlight-features' ); ?></figcaption></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->
<!-- wp:column {"width":"41.67%"} -->
<div class="wp-block-column" style="flex-basis:41.67%"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'portrait-1' ) ); ?>" alt=""/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Replace this photo. A quieter landscape or detail shot balances a busier image beside it. April 11, 2023.', 'catchlight-features' ); ?></figcaption></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
