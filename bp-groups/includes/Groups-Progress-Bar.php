<?php

namespace A8CSP\BP_GROUPS;

use BP_Group_Extension;

defined( 'ABSPATH' ) || exit;

/**
 * Class Groups_Progress_Bar
 *
 * @package UKBlackTech\Features
 */
class Groups_Progress_Bar extends BP_Group_Extension {

	/**
	 * Groups_Progress_Bar constructor.
	 */
	public function __construct() {
		$args = array(
			'slug'       => 'group-progress',
			'name'       => __( 'Group Progress', 'bp-groups' ),
			'visibility' => 'private',
			'show_tab'   => 'noone',
			'screens'    => array(
				'edit'   => array(
					'enabled' => true,
					'name'    => __( 'Group Progress', 'bp-groups' ),
				),
				'create' => array(
					'enabled' => true,
				),
				'admin'  => array(
					'enabled' => true,
				),
			),
		);

		$args = apply_filters( 'bp_groups_group_progress_construct_args', $args );

		parent::init( $args );
	}

	/**
	 * Display content in the manage/edit section.
	 *
	 * @param integer $group_id The group ID.
	 *
	 * @return void
	 */
	public function settings_screen( $group_id = 0 ) {
		$meta     = groups_get_groupmeta( $group_id, 'progress', true );
		$progress = '' === $meta ? 0 : (int) $meta;
		?>
		<h3>
		<?php
		echo esc_html( apply_filters( 'bp_group_progress_settings_screen_title', __( 'Group Progress', 'bp-groups' ) ) );
		?>
		</h3>
		<div
			id="group-progress-editor"
			class="group-progress-editor"
		>
			<label for="progress"><?php esc_html_e( 'Progress', 'bp-groups' ); ?></label>
			<input
				type="range"
				id="progress"
				name="progress"
				min="0"
				max="100"
				value="<?php echo esc_attr( $progress ); ?>"
				step="1"
				oninput="this.nextElementSibling.value = this.value"
			/>
			<output id="progress-value"><?php echo esc_html( $progress ); ?></output>%
		</div>
		<?php
	}

	/**
	 * Save the form data.
	 *
	 * @param integer $group_id The group ID.
	 *
	 * @return void
	 */
	public function settings_screen_save( $group_id = 0 ) {
		if ( ! isset( $_POST['save'] ) ) {
			return;
		}

		$context = $this->get_current_context();

		if ( ! isset( $_POST[ "_bp_group_{$context}_nonce_group-progress" ] ) || false === wp_verify_nonce( $_POST[ "_bp_group_{$context}_nonce_group-progress" ], "bp_group_extension_group-progress_{$context}" ) ) {
			bp_core_add_message( __( 'Security check failed.', 'bp-groups' ), 'error' );
			return;
		}

		if ( isset( $_POST['progress'] ) ) {
			$progress = intval( $_POST['progress'] );
		}

		if ( ! isset( $progress ) || $progress < 0 || $progress > 100 ) {
			bp_core_add_message( __( 'Please enter a valid progress value between 0 and 100.', 'bp-groups' ), 'error' );
			return;
		}

		groups_update_groupmeta( $group_id, 'progress', $progress );

		bp_core_add_message( __( 'Settings saved.', 'bp-groups' ) );
	}

	/**
	 * Determine the current context (create, edit, admin).
	 *
	 * @return string The current context.
	 */
	private function get_current_context() {
		if ( is_admin() ) {
			return 'admin';
		} elseif ( bp_is_current_action( 'create' ) ) {
			return 'create';
		} elseif ( bp_is_current_action( 'admin' ) ) {
			return 'edit';
		}

		return 'unknown';
	}
}

// Register the extension
bp_register_group_extension( 'A8CSP\BP_GROUPS\Groups_Progress_Bar' );
