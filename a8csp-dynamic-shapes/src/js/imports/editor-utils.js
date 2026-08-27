// WordPress dependencies.
import { useSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Editor-only helpers.
 *
 * Keep these separate from `utils.js`: that module is shared with the
 * front-end `view.js` bundle, and any `@wordpress/block-editor` import
 * reachable from it is extracted into `view.asset.php` as a script
 * dependency, pulling the editor and media scripts onto the front-end.
 */

/**
 * Custom hook to get spacing presets with fallback priority.
 *
 * @return {Array} The resolved spacing presets.
 */
export const useSpacingPresets = () => {
	const defaultSpacingPresets = useSettings(
		'spacing.spacingSizes.default'
	)?.[ 0 ];
	const themeSpacingPresets = useSettings(
		'spacing.spacingSizes.theme'
	)?.[ 0 ];
	const blockPresets =
		useSettings( 'blocks.core/group' )?.[ 0 ]?.spacing?.presets;

	if ( blockPresets?.length ) {
		return blockPresets;
	}
	if ( themeSpacingPresets?.length ) {
		return themeSpacingPresets;
	}
	if ( defaultSpacingPresets?.length ) {
		return defaultSpacingPresets;
	}
	return [];
};

/**
 * Creates corner configuration arrays for axis controls.
 *
 * @param {Array} keys Array of corner keys.
 *
 * @return {Array} Array of corner objects with key and label.
 */
export const axisConfig = ( keys ) => {
	const labels = {
		vtl: __( 'Top left', 'a8csp-dynamic-shapes' ),
		vtr: __( 'Top right', 'a8csp-dynamic-shapes' ),
		vbl: __( 'Bottom left', 'a8csp-dynamic-shapes' ),
		vbr: __( 'Bottom right', 'a8csp-dynamic-shapes' ),
		htl: __( 'Top left', 'a8csp-dynamic-shapes' ),
		htr: __( 'Top right', 'a8csp-dynamic-shapes' ),
		hbl: __( 'Bottom left', 'a8csp-dynamic-shapes' ),
		hbr: __( 'Bottom right', 'a8csp-dynamic-shapes' ),
	};

	return keys.map( ( key ) => ( {
		key,
		label: labels[ key ],
	} ) );
};
