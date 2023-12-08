<?php
/**
 * Plugin Autoupdate Filter Self Update class.
 * sets up autoupdates for this GitHub-hosted plugin.
 *
 * @package wpsp
 */
namespace WPSP_Blocks\Dynamic_Table_Of_Contents;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class WPSP_Blocks_Self_Update {

	/**
	 * Initialize WordPress hooks
	 */
	public function init() {
		add_filter( 'update_plugins_github.com', array( $this, 'self_update' ), 10, 3 );
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
		$plugin_slug     = $plugin_data['TextDomain'];
		$current_version = (float) $plugin_data['Version'];
		$updated_version = (float) $current_version + 0.1;

		// only check this plugin
		if ( "{$plugin_slug}/{$plugin_slug}.php" !== $plugin_file ) {
			return $update;
		}

		// already completed update check elsewhere
		if ( ! empty( $update ) ) {
			return $update;
		}

		// Check if we have a plugin update based on .zip existence.
		$response = wp_remote_get(
			"https://github.com/a8cteam51/special-projects-blocks-monorepo/releases/download/{$plugin_slug}-v{$updated_version}/{$plugin_slug}.zip",
			array(
				'user-agent' => 'wpspecialprojects',
			)
		);

		// If we found a .zip then there's an update available!
		if ( 200 === wp_remote_retrieve_response_code( $response ) ) {
			$zip = wp_remote_retrieve_body( $response );
		} else {
			return false;
		}

		return array(
			'slug'    => $plugin_slug,
			'version' => $updated_version,
			'url'     => "https://github.com/a8cteam51/special-projects-blocks-monorepo/releases/tag/{$plugin_slug}-v{$updated_version}",
			'package' => $zip,
		);
	}
}
$wpsp_blocks_self_update = new WPSP_Blocks_Self_Update();
$wpsp_blocks_self_update->init();
