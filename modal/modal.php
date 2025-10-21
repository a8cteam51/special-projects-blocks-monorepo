<?php
/**
 * Plugin Name:       Modal
 * Description:       A modal block that can be toggled open and closed.
 * Version:           0.1.1
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Author:            WordPress Special Projects Team
 * Author URI:        https://wpspecialprojects.wordpress.com/
 * Update URI:        https://opsoasis.wpspecialprojects.com/modal/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       modal
 *
 * @package           a8csp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// If no other WPCOMSP Block Plugin added the self update class, add it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
	require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

	$wpcomsp_blocks_self_update = WPCOMSP_Blocks_Self_Update::get_instance();
	$wpcomsp_blocks_self_update->hooks();
}

/**
 * Setup auto-updates for this plugin from our monorepo.
 * Done in an anonymous function for simplicity in making this a drop-in snippet.
 *
 * @param array $blocks Array of plugin files.
 *
 * @return array
 */
add_filter(
	'wpcomsp_installed_blocks',
	function ( $blocks ) {
		// Add the plugin slug here to enable autoupdates.
		$blocks[] = 'modal';

		return $blocks;
	}
);

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 *
 * @return void
 */
function a8csp_modal_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build' );
}
add_action( 'init', 'a8csp_modal_block_init' );

/**
 * Adds a custom template part area for mega menus to the list of template part areas.
 *
 * @param array $areas Existing array of template part areas.
 *
 * @return array Modified array of template part areas.
 */
function a8csp_modal_template_areas( array $areas ) {
	$modal_area = apply_filters(
		'a8csp_modal_area_args',
		array(
			'area'        => 'modal',
			'area_tag'    => 'div',
			'description' => __( 'Modal content templates', 'a8csp' ),
			'icon'        => '',
			'label'       => __( 'Modal', 'a8csp' ),
		)
	);

	$areas[] = $modal_area;

	return $areas;
}

add_filter( 'default_wp_template_part_areas', 'a8csp_modal_template_areas' );

/**
 * Retrieves the modal templates part areas.
 *
 * Returns the data we need to add the modal templates and meta data to the site.
 *
 * @return array
 */
function a8csp_modal_get_modal_templates() {
	$get_all_templates = get_block_templates( array( 'area' => 'modal' ), 'wp_template_part' );

	$modal_templates = array_map(
		function ( $template ) {
			return array(
				'id'      => isset( $template->wp_id ) ? $template->wp_id : null,
				'name'    => isset( $template->title ) ? $template->title : null,
				'content' => isset( $template->content ) ? $template->content : null,
				'slug'    => isset( $template->slug ) ? $template->slug : null,
			);
		},
		$get_all_templates
	);

	$modal_templates = apply_filters( 'a8csp_modal_modal_template_args', $modal_templates, $get_all_templates );

	return $modal_templates;
}

/**
 * Registers the modal meta settings.
 *
 * This adds the title and description fields for each modal template.
 * The settings are saved in the options database so they are available globally for every instance of the modal.
 *
 * @return void
 */
function a8csp_modal_add_modal_meta() {
	$modal_templates = a8csp_modal_get_modal_templates();

	add_option( 'modal_meta', array() );

	$settings = array();

	foreach ( $modal_templates as $template ) {
		$settings[ $template['slug'] ] = array(
			'type'       => 'object',
			'properties' => array(
				'modalTitle'       => array(
					'type'    => 'string',
					'default' => $template['name'],
				),
				'modalDescription' => array(
					'type' => 'string',
				),
			),
		);
	}

	$settings = apply_filters( 'a8csp_modal_meta_args', $settings, $modal_templates );

	register_setting(
		'modal_option_fields',
		'modal_meta',
		array(
			'show_in_rest' => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => $settings,
				),
			),
		)
	);
}

add_action( 'init', 'a8csp_modal_add_modal_meta' );

/**
 * Add the modal templates to the site.
 *
 * The action has to be added to the wp_head hook to ensure correct styles are loaded for the inner content
 * of the modal, otherwise not all styles will be loaded.
 *
 * The resulting html is then echoed in the wp_footer hook to ensure the modal
 * templates are added to the end of the page so that other html elements on the page
 * do not interfere with the modal container.
 *
 * @return void
 */
function a8csp_modal_insert_modal_templates() {

	if ( ! has_block( 'a8csp/modal' ) ) {
		return;
	}

	if ( post_password_required() ) {
		return;
	}

	$modal_templates = a8csp_modal_get_modal_templates();

	ob_start();

	foreach ( $modal_templates as $template ) {
		$slug = $template['slug'];

		$modal_meta        = get_option( 'modal_meta' );
		$modal_title       = isset( $modal_meta[ $slug ] ) && isset( $modal_meta[ $slug ]['modalTitle'] ) ? $modal_meta[ $slug ]['modalTitle'] : $template['name'];
		$modal_description = isset( $modal_meta[ $slug ] ) && isset( $modal_meta[ $slug ]['modalDescription'] ) ? $modal_meta[ $slug ]['modalDescription'] : false;

		wp_interactivity_state(
			'a8csp/modal',
			array(
				'selected' => null,
			)
		);
		?>
		<div
			class="wp-block-a8csp-modal-container"
			id="<?php echo esc_attr( $template['slug'] ); ?>"
			role="dialog"
			aria-modal="true"
			data-wp-interactive="a8csp/modal"
			data-wp-class--is-open="state.isModalOpen"
			data-wp-on--keydown="actions.handleModalKeydown"
			data-wp-bind--aria-hidden="!state.isModalOpen"
			data-wp-bind--inert="!state.isModalOpen"
			data-wp-bind--aria-label="context.title"
			data-wp-bind--aria-description="context.description"
				<?php
				echo wp_kses_data(
					wp_interactivity_data_wp_context(
						array(
							'id'          => esc_attr( $template['slug'] ),
							'title'       => esc_html( $modal_title ),
							'description' => esc_html( $modal_description ),
						)
					)
				);
				?>
		>
		<?php do_action( 'a8csp_modal_inner_content', $template ); ?>
		</div>

		<?php
	}

	$html = ob_get_contents();
	ob_clean();

	add_action(
		'wp_footer',
		function () use ( $html ) {
			echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	);
}

add_action( 'wp_head', 'a8csp_modal_insert_modal_templates', 0 );

/**
 * Add the default inner content for the modal.
 *
 * @param array $template The template content.
 *
 * @return void
 */
function a8csp_modal_default_inner_content( $template ) {
	?>
	<div class="wp-block-a8csp-modal-container--inner">
		
		<?php echo do_blocks( $template['content'] ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
	</div>

	<button
		data-wp-on--click='actions.closeModal'
		class="close-modal"
	>
		<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M18 6L6 18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M6 6L18 18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		<span class="screen-reader-text"><?php echo esc_html__( 'Close', 'modal' ); ?>
	</button>

	<?php
}

add_action( 'a8csp_modal_inner_content', 'a8csp_modal_default_inner_content' );

/**
 * Add Modal button block to the list of allowed blocks for the Navigation block.
 *
 * @param array  $args       The block type registration arguments.
 * @param string $block_type The block type name including namespace.
 *
 * @return array
 */
function a8csp_modal_navigation_filter( $args, $block_type ) {
	// Filter to disable modal for navigation if needed.
	$allow_modal_for_navigation = apply_filters( 'a8csp_modal_navigation', true );

	if ( ! $allow_modal_for_navigation ) {
		return $args;
	}

	if ( 'core/navigation' === $block_type ) {
		if ( is_array( $args['allowed_blocks'] ) ) {
			$updated_args = array_push( $args['allowed_blocks'], 'a8csp/modal' );

			$args['allowedBlocks'] = $updated_args;
		}
	}

	return $args;
}

add_filter( 'register_block_type_args', 'a8csp_modal_navigation_filter', 10, 2 );
