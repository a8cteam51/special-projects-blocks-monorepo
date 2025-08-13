/**
 * Get an icon component by name and iconset.
 *
 * @param {string} name Icon name.
 * @param {string} iconset Iconset name.
 *
 * @return {JSX.Element} Icon component.
 */
export const getIcon = ( name, iconset = 'default' ) => {
	try {
		const Icon = require( `./icons/${ name }.js` ).default;
		return <Icon iconset={ iconset } />;
	} catch ( error ) {
		console.error( error );
		return null;
	}
};
