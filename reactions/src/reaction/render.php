<?php
/**
 * Render the block on the frontend.
 *
 * The following variables are exposed:
 *     $attributes (array): the block attributes.
 *     $content (string): the block default content.
 *     $block (wp_block): the block instance.
 *
 * @see https://github.com/wordpress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
$name        = isset( $attributes['name'] ) ? $attributes['name'] : '';
$label       = isset( $attributes['label'] ) ? $attributes['label'] : '';
$iconset     = $block->context['iconset'];
$show_labels = $block->context['showLabels'];
$show_counts = $block->context['showCounts'];
$context     = array(
	'name' => $name,
);

$reaction         = wpcomsp_reactions_get_reaction_attributes( $name );
$svg_allowed_html = wpcomsp_reactions_kses_svg_allowed_tags();
?>
<li
	data-wp-interactive="wpcomsp/reactions"
	data-wp-class--wp-block-wpcomsp-reaction--active="state.hasReactionByName"
	<?php echo wp_kses_post( get_block_wrapper_attributes() ); ?>
	<?php echo wp_kses_post( wp_interactivity_data_wp_context( $context ) ); ?>
>
	<button
		data-wp-on--click="actions.handleReaction"
		aria-label="<?php echo esc_attr( $name ); ?>"
	>
		<span class="wp-block-wpcomsp-reaction__icon"><?php echo wp_kses( $reaction['iconsets'][ $iconset ], $svg_allowed_html ); ?></span>

		<?php if ( $show_labels && $label ) { ?>
			<span class="wp-block-wpcomsp-reaction__label"><?php echo esc_html( $label ); ?></span>
		<?php } ?>

		<?php if ( $show_counts ) { ?>
			<span class="wp-block-wpcomsp-reaction__count" data-wp-text="state.reactionCountByName">0</span>
		<?php } ?>
	</button>
</li>
