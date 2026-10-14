/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { getCardTemplate } from '../shared/template';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	// Read by the editor from WordPress 7.2 for every new Hotspot.
	template: getCardTemplate(),
	/**
	 * Names each hotspot by its label in List View, the breadcrumbs and the
	 * block's accessible name, so hotspots can be told apart there.
	 *
	 * @param {Object} attributes Block attributes.
	 * @return {string|undefined} The label, or undefined for the block title.
	 */
	__experimentalLabel( attributes ) {
		const label = attributes?.label?.trim();
		return label || undefined;
	},
} );
