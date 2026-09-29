/**
 * Register a `customTitle` attribute on core/heading.
 *
 * The attribute lives in the block comment only. It is added to the heading
 * markup at render time (see `wpcomsp_dynamic_table_of_contents_block_render`),
 * never saved into the post HTML, so the heading stays valid if this plugin is
 * deactivated or KSES strips unknown attributes.
 *
 * @param {Object} settings Block settings.
 * @param {string} name     Block name.
 * @return {Object} Block settings.
 */
export const addCustomTitleAttribute = ( settings, name ) => {
	if ( name !== 'core/heading' ) {
		return settings;
	}
	settings.attributes = {
		...settings.attributes,
		customTitle: {
			type: 'string',
		},
	};
	return settings;
};
