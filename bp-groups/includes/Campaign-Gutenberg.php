<?php

namespace UKBlackTech\Features;

use BP_Group_Extension;

defined( 'ABSPATH' ) || exit;

/**
 * Class Campaign_Gutenberg
 *
 * @package UKBlackTech\Features
 */
class Campaign_Gutenberg extends BP_Group_Extension {

	/**
	 * Campaign_Gutenberg constructor.
	 */
	public function __construct() {
		$args = array(
			'slug'       => 'campaign-content',
			'name'       => __( 'Campaign Content', 'ukblacktech-2026-features' ),
			'visibility' => 'private',
			'show_tab'   => 'noone',
			'screens'    => array(
				'edit'   => array(
					'enabled' => true,
					'name'    => __( 'Campaign Content', 'ukblacktech-2026-features' ),
				),
				'create' => array(
					'enabled' => true,
				),
				'admin'  => array(
					'enabled' => true,
				),
			),
		);

		parent::init( $args );
	}

	/**
	 * Display content in the manage/edit section.
	 *
	 * @param int|null $group_id The group ID.
	 *
	 * @return void
	 */
	public function settings_screen( $group_id = null ) {
		?>
		<h3><?php esc_html_e( 'Campaign Content', 'ukblacktech-2026-features' ); ?></h3>
		<div
			id="campaign-content-editor"
			class="campaign-content-editor"
		>
			Loading Editor...
		</div>
		<?php

		$long_description_field = new Campaign_Custom_Fields( $group_id, 'content', 'textarea', __( 'Content', 'ukblacktech-2026-features' ) );
		echo $long_description_field->render_field();
	}

	/**
	 * Save the form data.
	 *
	 * @param int|null $group_id The group ID.
	 *
	 * @return void
	 */
	public function edit_screen_save( $group_id = null ) {
		if ( ! isset( $_POST['save'] ) ) {
			return;
		}

		if ( isset( $_POST['content'] ) ) {
			$content = $_POST['content'];
		}

		groups_update_groupmeta( $group_id, 'content', $content );

		// Add your save logic here.

		bp_core_add_message( __( 'Settings saved.', 'ukblacktech-2026-features' ) );
	}
}
