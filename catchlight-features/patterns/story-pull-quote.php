<?php
/**
 * Pattern: Story: Pull Quote. A short pull quote from the story.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:quote -->
<blockquote class="wp-block-quote"><!-- wp:paragraph -->
<p><?php echo esc_html__( 'A short pull quote from the story goes here. Pick a line readers will remember, ideally under 30 words.', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph --></blockquote>
<!-- /wp:quote -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
