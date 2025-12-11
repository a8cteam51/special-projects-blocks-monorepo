<?php
/**
 * Functions for the dynamic shapes plugin.
 *
 * @package wpcomsp-dynamic-shapes
 */

declare( strict_types=1 );

namespace WPCOMSP\DynamicShapes\Functions;

defined( 'ABSPATH' ) || exit;

/**
 * Returns the plugin's metadata.
 *
 * @template PluginMetaKey of key-of<PluginMetaData>
 *
 * @param PluginMetaKey|null $property Optional. The property to return. Default all.
 *
 * @return ($property is null ? PluginMetaData : ($property is PluginMetaKey ? PluginMetaData[PluginMetaKey] : null))
 */
function get_metadata( ?string $property = null ) {
	static $plugin_data = null;

	if ( null === $plugin_data ) {
		if ( ! function_exists( 'get_plugin_data' ) ) {
			/* @phpstan-ignore requireOnce.fileNotFound */
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$dir_path = constant( 'WPCOMSP_DYNAMIC_SHAPES_DIR' );
		if ( null === $dir_path ) {
			return null;
		}

		$plugin_data = get_plugin_data( $dir_path . 'dynamic-shapes.php', true, false );
	}

	$metadata = $plugin_data;
	if ( null === $property ) {
		return $metadata;
	}

	return $metadata[ $property ] ?? null;
}

/**
 * Returns the plugin's slug.
 *
 * @return string
 */
function get_slug(): string {
	return 'a8csp-dynamic-shapes';
}

/**
 * Returns an array with meta information for a given asset path. First, it checks for an .asset.php file in the same directory
 * as the given asset file whose contents are returns if it exists. If not, it returns an array with the file's last modified
 * time as the version and the main stylesheet + any extra dependencies passed in as the dependencies.
 *
 * @param string        $asset_path         The path to the asset file.
 * @param string[]|null $extra_dependencies Any extra dependencies to include in the returned meta.
 *
 * @return array{ version: string, dependencies: array<string> }|null
 */
function get_asset_meta( string $asset_path, ?array $extra_dependencies = null ): ?array {
	$dir_path = constant( 'WPCOMSP_DYNAMIC_SHAPES_DIR' );
	if ( null === $dir_path ) {
		return null;
	}

	$asset_path = str_starts_with( $asset_path, $dir_path ) ? $asset_path : $dir_path . $asset_path;
	if ( ! file_exists( $asset_path ) ) {
		return null;
	}

	$asset_meta = array(
		'dependencies' => array(),
		'version'      => (string) filemtime( $asset_path ),
	);
	if ( '' === $asset_meta['version'] ) {
		$asset_meta['version'] = get_metadata( 'Version' );
	}

	$asset_pathinfo              = pathinfo( $asset_path );
	$asset_pathinfo['dirname'] ??= '';

	$asset_meta_file = "{$asset_pathinfo['dirname']}/{$asset_pathinfo['filename']}.asset.php";
	if ( file_exists( $asset_meta_file ) ) {
		$asset_meta_generated = require $asset_meta_file;

		if ( isset( $asset_meta_generated['version'] ) ) {
			$asset_meta['version'] = $asset_meta_generated['version'];
		}
		if ( isset( $asset_meta_generated['dependencies'] ) ) {
			$asset_meta['dependencies'] = $asset_meta_generated['dependencies'];
		}
	}

	if ( is_array( $extra_dependencies ) ) {
		$asset_meta['dependencies'] = array_merge( $asset_meta['dependencies'], $extra_dependencies );
		$asset_meta['dependencies'] = array_unique( $asset_meta['dependencies'] );
	}

	return $asset_meta;
}

/**
 * Enqueues a script with the given file name.
 *
 * @param string $file_name The name of the file to enqueue.
 *
 * @return void
 */
function enqueue_script( string $file_name ): void {
	$dir_path = constant( 'WPCOMSP_DYNAMIC_SHAPES_DIR' );
	$dir_url  = constant( 'WPCOMSP_DYNAMIC_SHAPES_URL' );
	if ( null === $dir_path || null === $dir_url ) {
		return;
	}

	$asset_path = "build/js/$file_name.js";
	$asset_meta = get_asset_meta( $dir_path . $asset_path );

	if ( is_array( $asset_meta ) ) {
		wp_enqueue_script(
			get_slug() . "-$file_name",
			$dir_url . $asset_path,
			$asset_meta['dependencies'],
			$asset_meta['version'],
			true
		);
	}
}

/**
 * Enqueues a script with the given file name.
 *
 * @param string $file_name The name of the file to enqueue.
 *
 * @return void
 */
function enqueue_style( string $file_name ): void {
	$dir_path = constant( 'WPCOMSP_DYNAMIC_SHAPES_DIR' );
	$dir_url  = constant( 'WPCOMSP_DYNAMIC_SHAPES_URL' );
	if ( null === $dir_path || null === $dir_url ) {
		return;
	}

	$asset_path = "build/css/$file_name.css";

	wp_enqueue_style(
		get_slug() . "-$file_name",
		$dir_url . $asset_path,
		array(),
		(string) filemtime( $dir_path . $asset_path )
	);
}
