<?php
/**
 * Plugin Name:       Terms List
 * Description:       Display a list of terms in a selected taxonomy.
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       terms-list
 *
 * @package           wpcomsp
 *
 */

/**
 * Renders the `core/categories` block on server.
 *
 * @since 5.0.0
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the terms list/dropdown markup.
 */
function render_block_terms_list( $attributes ) {
	static $block_id = 0;
	++$block_id;

	if ( empty( $attributes['selectedTaxonomy'] ) ) {
		return '';
	}

	$args = array(
		'echo'         => false,
		'hierarchical' => ! empty( $attributes['showHierarchy'] ),
		'orderby'      => 'name',
		'show_count'   => ! empty( $attributes['showPostCounts'] ),
		'title_li'     => '',
		'hide_empty'   => empty( $attributes['showEmpty'] ),
		'taxonomy'     => $attributes['selectedTaxonomy'],
	);
	if ( ! empty( $attributes['showOnlyTopLevel'] ) && $attributes['showOnlyTopLevel'] ) {
		$args['parent'] = 0;
	}

	if ( ! empty( $attributes['displayAsDropdown'] ) ) {
		$id                       = 'terms-list-' . $block_id;
		$args['id']               = $id;
		$args['show_option_none'] = __( 'Select Term' );
		$show_label               = empty( $attributes['showLabel'] ) ? ' screen-reader-text' : '';
		$default_label            = __( 'Terms' );
		$label_text               = ! empty( $attributes['label'] ) ? $attributes['label'] : $default_label;
		$wrapper_markup           = '<div %1$s><label class="client-side-terms-list__label' . $show_label . '" for="' . esc_attr( $id ) . '">' . $label_text . '</label>%2$s</div>';
		$items_markup             = wp_dropdown_categories( $args );
		$type                     = 'dropdown';

		if ( ! is_admin() ) {
			// Inject the dropdown script immediately after the select dropdown.
			$items_markup = preg_replace(
				'#(?<=</select>)#',
				build_dropdown_script_block_core_categories( $id ),
				$items_markup,
				1
			);
		}
	} else {
		$wrapper_markup = '<ul %1$s>%2$s</ul>';
		$items_markup   = wp_list_categories( $args );
		$type           = 'list';
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => "wp-block-terms-{$type}" ) );

	return sprintf(
		$wrapper_markup,
		$wrapper_attributes,
		$items_markup
	);
}

/**
 * Generates the inline script for a terms dropdown field.
 *
 * @since 5.0.0
 *
 * @param string $dropdown_id ID of the dropdown field.
 *
 * @return string Returns the dropdown onChange redirection script.
 */
function build_dropdown_script_block_terms_list( $dropdown_id ) {
	ob_start();
	?>
	<script>
	( function() {
		var dropdown = document.getElementById( '<?php echo esc_js( $dropdown_id ); ?>' );
		function onTermChange() {
			if ( dropdown.options[ dropdown.selectedIndex ].value > 0 ) {
				location.href = "<?php echo esc_url( home_url() ); ?>/?cat=" + dropdown.options[ dropdown.selectedIndex ].value;
			}
		}
		dropdown.onchange = onTermChange;
	})();
	</script>
	<?php
	return wp_get_inline_script_tag( str_replace( array( '<script>', '</script>' ), '', ob_get_clean() ) );
}

/**
 * Registers the `wpcomsp/terms-list` block on server.
 *
 * @since 5.0.0
 *
 * @return void
 */
function register_block_terms_list() {
	register_block_type_from_metadata(
		plugin_dir_path( __FILE__ ) . 'build',
		array(
			'render_callback' => 'render_block_terms_list',
		)
	);
}
add_action( 'init', 'register_block_terms_list' );
