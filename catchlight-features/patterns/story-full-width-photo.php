<?php
/**
 * Pattern: Story: Full-Width Photo. A single photo the full width of the screen.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:image {"sizeSlug":"large","linkDestination":"none","align":"full"} -->
<figure class="wp-block-image alignfull size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'landscape-2' ) ); ?>" alt=""/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Replace this photo. Save full-width images for the most powerful scenes in the story. April 4, 2023.', 'catchlight-features' ); ?></figcaption></figure>
<!-- /wp:image -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
