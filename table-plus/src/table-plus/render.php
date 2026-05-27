<?php
/**
 * Server-side render for the Table Plus block.
 *
 * Thin wrapper around WPCOMSP_Table_Plus_Renderer; the meaningful logic lives
 * in classes/class-wpcomsp-table-plus-renderer.php so it can be unit-tested
 * without a full WordPress bootstrap.
 *
 * @package wpcomsp
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Concatenated inner block markup (unused; we walk parsed blocks instead).
 * @var WP_Block $block      Parsed block instance.
 */

$inner_blocks = isset( $block->parsed_block['innerBlocks'] ) ? $block->parsed_block['innerBlocks'] : array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'style' => WPCOMSP_Table_Plus_Renderer::build_inline_style( $attributes ) )
);

echo WPCOMSP_Table_Plus_Renderer::render( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$attributes,
	$inner_blocks,
	$wrapper_attributes,
	'render_block'
);
