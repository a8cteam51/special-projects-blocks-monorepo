<?php
/**
 * Pattern: Story: Opener. A one-sentence subheading and two opening paragraphs.
 *
 * Registered in includes/patterns.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!-- wp:heading -->
<h2 class="wp-block-heading"><?php echo esc_html__( 'A one-sentence subheading that sets up the story goes here.', 'catchlight-features' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Open the story here. Put readers in the place and introduce the people at the center of it. Two or three sentences are plenty for an opening paragraph, because the photographs will carry much of the story from here.', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Use the second paragraph to introduce the photographer and the project. Who are they, which newsroom or partner are they working with, and how long did they spend documenting this community?', 'catchlight-features' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"50px"} -->
<div style="height:50px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
