<?php
/**
 * Pattern: Story: Centered Photo. A single centered photo.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:image {"sizeSlug":"large","linkDestination":"none","align":"center"} -->
<figure class="wp-block-image aligncenter size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'landscape-3' ) ); ?>" alt=""/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Replace this photo. Name the people pictured, including ages when relevant, and say what they are doing. April 11, 2023.', 'catchlight-features' ); ?></figcaption></figure>
<!-- /wp:image -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
