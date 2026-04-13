<?php
/**
 * Render the Breadcrumbs block.
 *
 * @package A8CSP\Blocks
 * @var array $attributes Block attributes.
 */

// Return early if the Breadcrumbs class does not exist.
if ( ! class_exists( A8CSP\Breadcrumbs::class ) ) {
	return;
}

$hide_home_link = isset( $attributes['hideHomeBreadcrumb'] ) && $attributes['hideHomeBreadcrumb'] ? true : false;
// Exit if the breadcrumbs count is less than or equal to 1 and the hideSingleBreadcrumb attribute is set to true.
if ( isset( $attributes['hideSingleBreadcrumb'] ) && $attributes['hideSingleBreadcrumb'] && ( count( A8CSP\Breadcrumbs::get_crumbs( $hide_home_link ) ) <= 1 ) ) {
	return;
}

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo A8CSP\Breadcrumbs::get_crumbs_html( $hide_home_link ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
