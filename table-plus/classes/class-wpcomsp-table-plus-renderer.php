<?php
/**
 * Table Plus block renderer.
 *
 * Pure PHP logic for assembling the frontend <table> output. Kept free of
 * direct WordPress function calls (other than esc_attr) so it can be
 * unit-tested without booting WP — see tests/php/RendererTest.php.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class WPCOMSP_Table_Plus_Renderer
 */
class WPCOMSP_Table_Plus_Renderer {

	public const ROW_BLOCK_NAME = 'wpcomsp/table-plus-row';

	/**
	 * Assemble the final <table> HTML for a Table Plus block.
	 *
	 * Inner row blocks are grouped into <thead>, <tbody>, and <tfoot> based on
	 * their `rowType` attribute, regardless of source order. Cell <div>s in
	 * header rows are promoted to <th scope="col">; everywhere else they
	 * become <td>.
	 *
	 * @param array    $attributes         Block attributes (unused at this layer; reserved for future use).
	 * @param array    $inner_blocks       Parsed-block array of inner blocks (the rows).
	 * @param string   $wrapper_attributes Pre-rendered HTML attribute string for the <table> element.
	 * @param callable $render_row         Callable that takes a parsed row block and returns its HTML.
	 *
	 * @return string
	 */
	public static function render( array $attributes, array $inner_blocks, string $wrapper_attributes, callable $render_row ): string {
		unset( $attributes ); // Border styling is folded into $wrapper_attributes by the caller.

		$head_rows = '';
		$body_rows = '';
		$foot_rows = '';

		foreach ( $inner_blocks as $row_block ) {
			$block_name = isset( $row_block['blockName'] ) ? $row_block['blockName'] : '';
			if ( self::ROW_BLOCK_NAME !== $block_name ) {
				continue;
			}

			$row_type     = isset( $row_block['attrs']['rowType'] ) ? $row_block['attrs']['rowType'] : 'body';
			$is_header    = ( 'header' === $row_type );
			$rendered_row = self::promote_cells( (string) $render_row( $row_block ), $is_header );

			if ( $is_header ) {
				$head_rows .= $rendered_row;
			} elseif ( 'footer' === $row_type ) {
				$foot_rows .= $rendered_row;
			} else {
				$body_rows .= $rendered_row;
			}
		}

		$output = sprintf( '<table %s>', $wrapper_attributes );

		if ( '' !== $head_rows ) {
			$output .= '<thead>' . $head_rows . '</thead>';
		}
		if ( '' !== $body_rows ) {
			$output .= '<tbody>' . $body_rows . '</tbody>';
		}
		if ( '' !== $foot_rows ) {
			$output .= '<tfoot>' . $foot_rows . '</tfoot>';
		}

		$output .= '</table>';

		return $output;
	}

	/**
	 * Build the inline `style` value carrying the cell-border CSS variables.
	 *
	 * Reads from the standard core border-support attribute paths
	 * (`style.border.width|style|color` and the `borderColor` preset slug).
	 * Anything missing falls through to the CSS-level defaults declared in
	 * style.scss / editor.scss, so we only emit the variables we have.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	public static function build_inline_style( array $attributes ): string {
		$style_attr = isset( $attributes['style'] ) && is_array( $attributes['style'] )
			? $attributes['style']
			: array();
		$border = isset( $style_attr['border'] ) && is_array( $style_attr['border'] )
			? $style_attr['border']
			: array();

		$declarations = array();

		if ( isset( $border['width'] ) && '' !== $border['width'] ) {
			$declarations[] = '--tp-border-width:' . esc_attr( (string) $border['width'] );
		}
		if ( isset( $border['style'] ) && '' !== $border['style'] ) {
			$declarations[] = '--tp-border-style:' . esc_attr( (string) $border['style'] );
		}

		if ( isset( $border['color'] ) && '' !== $border['color'] ) {
			$declarations[] = '--tp-border-color:' . esc_attr( (string) $border['color'] );
		} elseif ( isset( $attributes['borderColor'] ) && '' !== $attributes['borderColor'] ) {
			$declarations[] = sprintf(
				'--tp-border-color:var(--wp--preset--color--%s)',
				esc_attr( (string) $attributes['borderColor'] )
			);
		}

		return '' === implode( '', $declarations )
			? ''
			: implode( ';', $declarations ) . ';';
	}

	/**
	 * Replace each cell <div> in a row's rendered HTML with a real <td> or <th>.
	 *
	 * Cell content comes from RichText, which only allows inline tags by
	 * default, so the non-greedy `(.*?)</div>` match cannot be tripped by a
	 * nested </div>. If you ever loosen the cell to allow block-level HTML,
	 * swap the regex for a DOMDocument walk.
	 *
	 * @param string $row_html  Row HTML.
	 * @param bool   $is_header Whether the row is a <thead> row.
	 *
	 * @return string
	 */
	public static function promote_cells( string $row_html, bool $is_header ): string {
		$tag   = $is_header ? 'th' : 'td';
		$extra = $is_header ? ' scope="col"' : '';

		return preg_replace_callback(
			'#<div(\b[^>]*\bwp-block-wpcomsp-table-plus-cell\b[^>]*)>(.*?)</div>#s',
			static function ( $match ) use ( $tag, $extra ) {
				return '<' . $tag . $extra . $match[1] . '>' . $match[2] . '</' . $tag . '>';
			},
			$row_html
		);
	}
}
