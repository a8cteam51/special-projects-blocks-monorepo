<?php
	$inner_blocks = $block->inner_blocks;
	$inner_blocks_html = '';
	foreach ($inner_blocks as $inner_block) {
    $inner_blocks_html .= $inner_block->render();
	}
?>

<div
	data-wp-interactive="wpcomsp/marquee"
	data-wp-init="callbacks.init"
>
	<div <?php echo get_block_wrapper_attributes(array( "class" => 'wp-block-wpcomsp-marquee__inner')); ?>>
		<?php echo $inner_blocks_html; ?>
	</div>
</div>
