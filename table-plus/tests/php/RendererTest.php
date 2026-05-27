<?php
/**
 * Unit tests for WPCOMSP_Table_Plus_Renderer.
 *
 * @package wpcomsp
 */

declare( strict_types=1 );

use PHPUnit\Framework\TestCase;

/**
 * @covers WPCOMSP_Table_Plus_Renderer
 */
final class RendererTest extends TestCase {

	private const ROW_TAG = 'wp-block-wpcomsp-table-plus-row';
	private const CELL_TAG = 'wp-block-wpcomsp-table-plus-cell';

	/**
	 * Build a parsed-block array for a row, plus an attached pre-rendered HTML
	 * string. The render() method's $render_row callable just looks up that
	 * string — this lets us test grouping without mocking render_block().
	 */
	private static function row( string $row_type, string $rendered_html ): array {
		$attrs = ( 'body' === $row_type ) ? array() : array( 'rowType' => $row_type );

		return array(
			'blockName' => WPCOMSP_Table_Plus_Renderer::ROW_BLOCK_NAME,
			'attrs'     => $attrs,
			'__html'    => $rendered_html,
		);
	}

	private static function row_html( string $cells_html ): string {
		return '<tr class="' . self::ROW_TAG . '">' . $cells_html . '</tr>';
	}

	private static function cell( string $content, string $extra_class = '' ): string {
		$class = trim( self::CELL_TAG . ( '' !== $extra_class ? ' ' . $extra_class : '' ) );

		return sprintf( '<div class="%s">%s</div>', $class, $content );
	}

	private function render( array $rows, string $wrapper = 'class="wp-block"' ): string {
		return WPCOMSP_Table_Plus_Renderer::render(
			array(),
			$rows,
			$wrapper,
			static function ( array $row_block ): string {
				return $row_block['__html'] ?? '';
			}
		);
	}

	public function test_empty_inner_blocks_returns_table_with_no_sections(): void {
		$output = $this->render( array(), 'class="x"' );

		$this->assertSame( '<table class="x"></table>', $output );
	}

	public function test_wrapper_attributes_are_emitted_on_table_element(): void {
		$output = $this->render(
			array( self::row( 'body', self::row_html( self::cell( 'A' ) ) ) ),
			'class="wp-block-wpcomsp-table-plus" style="--tp-border-width:2px"'
		);

		$this->assertStringStartsWith(
			'<table class="wp-block-wpcomsp-table-plus" style="--tp-border-width:2px">',
			$output
		);
	}

	public function test_body_only_rows_render_inside_tbody(): void {
		$output = $this->render(
			array(
				self::row( 'body', self::row_html( self::cell( 'A' ) ) ),
				self::row( 'body', self::row_html( self::cell( 'B' ) ) ),
			)
		);

		$this->assertStringContainsString( '<tbody><tr', $output );
		$this->assertStringContainsString( '<td class="' . self::CELL_TAG . '">A</td>', $output );
		$this->assertStringContainsString( '<td class="' . self::CELL_TAG . '">B</td>', $output );
		$this->assertStringNotContainsString( '<thead>', $output );
		$this->assertStringNotContainsString( '<tfoot>', $output );
	}

	public function test_header_row_promotes_cells_to_th_with_scope(): void {
		$output = $this->render(
			array( self::row( 'header', self::row_html( self::cell( 'Name' ) ) ) )
		);

		$this->assertStringContainsString( '<thead><tr', $output );
		$this->assertStringContainsString(
			'<th scope="col" class="' . self::CELL_TAG . '">Name</th>',
			$output
		);
		$this->assertStringNotContainsString( '<tbody>', $output );
		$this->assertStringNotContainsString( '<tfoot>', $output );
	}

	public function test_footer_row_keeps_cells_as_td(): void {
		$output = $this->render(
			array( self::row( 'footer', self::row_html( self::cell( 'Total' ) ) ) )
		);

		$this->assertStringContainsString( '<tfoot><tr', $output );
		$this->assertStringContainsString( '<td class="' . self::CELL_TAG . '">Total</td>', $output );
		$this->assertStringNotContainsString( '<th', $output );
	}

	public function test_groups_into_canonical_order_regardless_of_source_order(): void {
		$output = $this->render(
			array(
				self::row( 'footer', self::row_html( self::cell( 'F' ) ) ),
				self::row( 'body', self::row_html( self::cell( 'B' ) ) ),
				self::row( 'header', self::row_html( self::cell( 'H' ) ) ),
			)
		);

		$thead_pos = strpos( $output, '<thead>' );
		$tbody_pos = strpos( $output, '<tbody>' );
		$tfoot_pos = strpos( $output, '<tfoot>' );

		$this->assertNotFalse( $thead_pos );
		$this->assertNotFalse( $tbody_pos );
		$this->assertNotFalse( $tfoot_pos );
		$this->assertLessThan( $tbody_pos, $thead_pos );
		$this->assertLessThan( $tfoot_pos, $tbody_pos );
	}

	public function test_skips_inner_blocks_that_are_not_rows(): void {
		$output = $this->render(
			array(
				array(
					'blockName' => 'core/paragraph',
					'attrs'     => array(),
					'__html'    => '<p>not a row</p>',
				),
				self::row( 'body', self::row_html( self::cell( 'OK' ) ) ),
			)
		);

		$this->assertStringNotContainsString( '<p>not a row</p>', $output );
		$this->assertStringContainsString( 'OK', $output );
	}

	public function test_preserves_body_row_order(): void {
		$output = $this->render(
			array(
				self::row( 'body', self::row_html( self::cell( '1' ) ) ),
				self::row( 'body', self::row_html( self::cell( '2' ) ) ),
				self::row( 'body', self::row_html( self::cell( '3' ) ) ),
			)
		);

		$pos_1 = strpos( $output, '>1<' );
		$pos_2 = strpos( $output, '>2<' );
		$pos_3 = strpos( $output, '>3<' );

		$this->assertNotFalse( $pos_1 );
		$this->assertNotFalse( $pos_2 );
		$this->assertNotFalse( $pos_3 );
		$this->assertLessThan( $pos_2, $pos_1 );
		$this->assertLessThan( $pos_3, $pos_2 );
	}

	public function test_promote_cells_preserves_classes_and_inline_styles(): void {
		$row = '<tr class="' . self::ROW_TAG . '"><div class="' . self::CELL_TAG . ' has-background" style="color:red">X</div></tr>';

		$promoted = WPCOMSP_Table_Plus_Renderer::promote_cells( $row, false );

		$this->assertSame(
			'<tr class="' . self::ROW_TAG . '"><td class="' . self::CELL_TAG . ' has-background" style="color:red">X</td></tr>',
			$promoted
		);
	}

	public function test_promote_cells_to_header_inserts_scope_before_other_attributes(): void {
		$row = '<tr><div class="' . self::CELL_TAG . ' has-text-color" style="color:red">Y</div></tr>';

		$promoted = WPCOMSP_Table_Plus_Renderer::promote_cells( $row, true );

		$this->assertStringContainsString(
			'<th scope="col" class="' . self::CELL_TAG . ' has-text-color" style="color:red">Y</th>',
			$promoted
		);
	}

	public function test_promote_cells_leaves_unrelated_divs_alone(): void {
		$row = '<tr><div class="something-else">x</div><div class="' . self::CELL_TAG . '">y</div></tr>';

		$promoted = WPCOMSP_Table_Plus_Renderer::promote_cells( $row, false );

		$this->assertStringContainsString( '<div class="something-else">x</div>', $promoted );
		$this->assertStringContainsString( '<td class="' . self::CELL_TAG . '">y</td>', $promoted );
	}

	public function test_promote_cells_preserves_inline_html_inside_cell_content(): void {
		$row = '<tr><div class="' . self::CELL_TAG . '">Hello <strong>World</strong></div></tr>';

		$promoted = WPCOMSP_Table_Plus_Renderer::promote_cells( $row, false );

		$this->assertStringContainsString(
			'<td class="' . self::CELL_TAG . '">Hello <strong>World</strong></td>',
			$promoted
		);
	}

	public function test_promote_cells_no_op_when_no_cell_div(): void {
		$row = '<tr><div class="other">x</div></tr>';

		$promoted = WPCOMSP_Table_Plus_Renderer::promote_cells( $row, false );

		$this->assertSame( $row, $promoted );
	}

	public function test_build_inline_style_returns_empty_when_no_border_attributes(): void {
		// CSS fallbacks in style.scss / editor.scss provide defaults; we only
		// emit variables we actually have.
		$this->assertSame( '', WPCOMSP_Table_Plus_Renderer::build_inline_style( array() ) );
	}

	public function test_build_inline_style_with_full_custom_border(): void {
		$css = WPCOMSP_Table_Plus_Renderer::build_inline_style(
			array(
				'style' => array(
					'border' => array(
						'width' => '3px',
						'style' => 'dashed',
						'color' => '#ff0000',
					),
				),
			)
		);

		$this->assertSame(
			'--tp-border-width:3px;--tp-border-style:dashed;--tp-border-color:#ff0000;',
			$css
		);
	}

	public function test_build_inline_style_emits_only_set_variables(): void {
		$css = WPCOMSP_Table_Plus_Renderer::build_inline_style(
			array(
				'style' => array(
					'border' => array( 'width' => '4px' ),
				),
			)
		);

		$this->assertSame( '--tp-border-width:4px;', $css );
	}

	public function test_build_inline_style_resolves_preset_border_color(): void {
		$css = WPCOMSP_Table_Plus_Renderer::build_inline_style(
			array( 'borderColor' => 'primary' )
		);

		$this->assertSame( '--tp-border-color:var(--wp--preset--color--primary);', $css );
	}

	public function test_build_inline_style_custom_color_wins_over_preset(): void {
		$css = WPCOMSP_Table_Plus_Renderer::build_inline_style(
			array(
				'borderColor' => 'primary',
				'style'       => array( 'border' => array( 'color' => '#abcdef' ) ),
			)
		);

		$this->assertSame( '--tp-border-color:#abcdef;', $css );
	}

	public function test_build_inline_style_escapes_user_supplied_values(): void {
		$css = WPCOMSP_Table_Plus_Renderer::build_inline_style(
			array(
				'style' => array(
					'border' => array(
						'style' => '"><script>',
						'color' => 'red"',
					),
				),
			)
		);

		$this->assertStringContainsString( '&quot;&gt;&lt;script&gt;', $css );
		$this->assertStringContainsString( 'red&quot;', $css );
	}

	public function test_build_inline_style_ignores_non_array_style_attribute(): void {
		// Defensive: a malformed `style` shouldn't crash or leak in.
		$this->assertSame(
			'',
			WPCOMSP_Table_Plus_Renderer::build_inline_style( array( 'style' => 'not-an-array' ) )
		);
	}

	public function test_default_row_type_is_body_when_attribute_missing(): void {
		$row = array(
			'blockName' => WPCOMSP_Table_Plus_Renderer::ROW_BLOCK_NAME,
			'attrs'     => array(), // No rowType set.
			'__html'    => self::row_html( self::cell( 'X' ) ),
		);

		$output = $this->render( array( $row ) );

		$this->assertStringContainsString( '<tbody>', $output );
		$this->assertStringNotContainsString( '<thead>', $output );
		$this->assertStringNotContainsString( '<tfoot>', $output );
	}
}
