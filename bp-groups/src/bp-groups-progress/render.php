<?php
use A8CSP\BP_GROUPS\Groups_Block_Bindings;

defined( 'ABSPATH' ) || exit;

$group = Groups_Block_Bindings::get_current_group( $block->context );

if ( 0 === $group ) {
	return '';
}

$meta     = groups_get_groupmeta( $group->id, 'progress', true );
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
					sprintf( __( 'Progress: %d%%', 'bp-groups-blocks' ), $progress )
				);
				?>
			</span>
		</div>
	</div>
</div>
