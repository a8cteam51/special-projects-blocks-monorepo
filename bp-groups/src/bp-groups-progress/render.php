<?php
	$group_id = $block->context['postId'] ? $block->context['postId'] : a8csp_get_current_group( 'id' );
	$meta     = groups_get_groupmeta( $group_id, 'progress', true );
	$progress = '' === $meta ? 0 : (int) $meta;
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php if ( $attributes['showProgressText'] ) { ?>
		
		<?php
		printf(
			'<span class="group-progress-text">%s %d%%</span>',
			esc_html( $attributes['progressText'] ),
			intval( $progress )
		);
		?>
		
	<?php } ?>
	<div class="group-progress-bar-background">
		<div
			class="group-progress-bar-fill"
			style="width: <?php echo esc_attr( $progress ); ?>%;"
		>
			<span class="group-progress-bar-label screen-reader-text">
				<?php
				echo esc_html(
					/* translators: %d is the progress percentage. */
					sprintf( __( 'Progress: %d%%', 'bp-groups-progress' ), $progress )
				);
				?>
			</span>
		</div>
	</div>
</div>
