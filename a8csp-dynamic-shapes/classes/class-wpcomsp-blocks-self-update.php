<?php
/**
 * Plugin Autoupdate Filter Self Update class.
 * sets up autoupdates for this GitHub-hosted plugin.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class WPCOMSP_Blocks_Self_Update {

	public static $instance;

	/**
	 * Get instance of this class.
	 *
	 * @return WPCOMSP_Blocks_Self_Update
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Initialize WordPress hooks
	 */
	public function hooks() {
		add_filter( 'update_plugins_opsoasis.wpspecialprojects.com', array( $this, 'self_update' ), 10, 3 );
	}

	/**
	 * Check for updates to this plugin
	 *
	 * @param array  $update   Array of update data.
	 * @param array  $plugin_data Array of plugin data.
	 * @param string $plugin_file Path to plugin file.
	 *
	 * @return array|bool Array of update data or false if no update available.
	 */
	public function self_update( $update, array $plugin_data, string $plugin_file ) {
		// Already completed update check elsewhere.
		if ( ! empty( $update ) ) {
			return $update;
		}

		$plugin_filename_parts = explode( '/', $plugin_file );

		// Ask opsoasis if there's an update.
		$response = wp_remote_get(
			'https://opsoasis.wpspecialprojects.com/wp-json/opsoasis-blocks-version-manager/v1/update-check',
			array(
				'body' => array(
					'plugin'  => $plugin_filename_parts[0],
					'version' => $plugin_data['Version'],
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $update;
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( 404 === $response_code || 202 === $response_code ) {
			return $update;
		}

		$updated_array = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( ! is_array( $updated_array ) || ! isset( $updated_array['slug'], $updated_array['version'], $updated_array['package_url'] ) ) {
			return $update;
		}

		return array(
			'slug'    => $updated_array['slug'],
			'version' => $updated_array['version'],
			'url'     => $updated_array['package_url'],
			'package' => $updated_array['package_url'],
		);
	}
}
