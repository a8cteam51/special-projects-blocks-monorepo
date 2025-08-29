/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	icon: (
		<svg
			fill="#000000"
			width="800px"
			height="800px"
			viewBox="0 0 32 32"
			id="icon"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M28,21H4a2.0021,2.0021,0,0,1-2-2V13a2.0021,2.0021,0,0,1,2-2H28a2.0021,2.0021,0,0,1,2,2v6A2.0021,2.0021,0,0,1,28,21ZM4,13v6H28V13Z" />
			<rect x="6" y="15" width="14" height="2" />
		</svg>
	),
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
