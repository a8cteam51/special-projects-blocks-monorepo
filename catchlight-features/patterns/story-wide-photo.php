<?php
/**
 * Pattern: Story: Wide Photo. A single photo wider than the text column.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:image {"sizeSlug":"large","linkDestination":"none","align":"wide"} -->
<figure class="wp-block-image alignwide size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'landscape-1' ) ); ?>" alt=""/><figcaption class="wp-element-caption"><?php echo esc_html__( 'Replace this photo. A wide image gives a strong portrait or scene room to breathe. February 8, 2023.', 'catchlight-features' ); ?></figcaption></figure>
<!-- /wp:image -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
