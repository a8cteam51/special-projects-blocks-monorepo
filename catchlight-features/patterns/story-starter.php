<?php
/**
 * Pattern: Story Starter. A full photo story built from the Story pieces.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php echo catchlight_features_photo_carousel_pattern_markup( 'story-opener' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pattern markup, escaped in its own file. ?>

<?php echo catchlight_features_photo_carousel_pattern_markup( 'story-photo-carousel' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pattern markup, escaped in its own file. ?>

<?php echo catchlight_features_photo_carousel_pattern_markup( 'story-pull-quote' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pattern markup, escaped in its own file. ?>

<?php echo catchlight_features_photo_carousel_pattern_markup( 'story-photo-pair' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pattern markup, escaped in its own file. ?>

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Continue the story here. This is a good spot for a quote from the photographer about their approach. Talk about how you built trust with the people in your photographs and what you hope readers take away.', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<?php echo catchlight_features_photo_carousel_pattern_markup( 'story-wide-photo' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pattern markup, escaped in its own file. ?>

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Keep the story moving between photos. Short paragraphs of two to four sentences work best, so the photography stays front and center and readers move easily from one image to the next.', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<?php echo catchlight_features_photo_carousel_pattern_markup( 'story-offset-photo-pair' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pattern markup, escaped in its own file. ?>

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Bring in voices from the community. "Quotes from the people in the photographs help readers understand what is at stake and why this story matters to the people living it," said a community member.', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<?php echo catchlight_features_photo_carousel_pattern_markup( 'story-full-width-photo' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pattern markup, escaped in its own file. ?>

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Add context where it helps, like data, history, or local organizations working on the issue. Link to sources and partners so readers can learn more.', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<?php echo catchlight_features_photo_carousel_pattern_markup( 'story-centered-photo' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Pattern markup, escaped in its own file. ?>

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'As the story winds down, return to the people and the place you opened with. Readers should come away knowing where things stand today.', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Close with a strong final paragraph. Ending on a voice from the community, or on what happens next, lands better than a summary of everything above.', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->
