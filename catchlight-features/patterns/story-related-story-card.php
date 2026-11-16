<?php
/**
 * Pattern: Story: Related Story Card. A card linking to a related story or interactive.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"border":{"width":"1px","color":"#dddddd","radius":"8px"},"spacing":{"padding":{"top":"24px","right":"24px","bottom":"24px","left":"24px"}},"color":{"background":"#f7f7f7"}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center has-border-color has-background" style="border-color:#dddddd;border-width:1px;border-radius:8px;background-color:#f7f7f7;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px"><!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="#"><?php echo esc_html__( 'Title of a Related Story or Interactive, Linked to Its Page', 'catchlight-features' ); ?></a></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'By Reporter Name for Partner Publication', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#"><?php echo esc_html__( 'Read the story', 'catchlight-features' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"aspectRatio":"3/2","scale":"cover","sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="<?php echo esc_url( catchlight_features_photo_carousel_pattern_image( 'landscape-3' ) ); ?>" alt="" style="aspect-ratio:3/2;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
