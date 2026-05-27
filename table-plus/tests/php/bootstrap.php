<?php
/**
 * PHPUnit bootstrap.
 *
 * The renderer only depends on `esc_attr` from WordPress, so we stub it with
 * an htmlspecialchars equivalent and avoid loading WP for unit tests.
 *
 * @package wpcomsp
 */

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' ); // Satisfy the guard at the top of the renderer file.
}

if ( ! function_exists( 'esc_attr' ) ) {
	/**
	 * Minimal esc_attr replacement for the unit-test environment.
	 *
	 * @param mixed $value Value to escape.
	 *
	 * @return string
	 */
	function esc_attr( $value ): string {
		return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' );
	}
}

require __DIR__ . '/../../classes/class-wpcomsp-table-plus-renderer.php';
