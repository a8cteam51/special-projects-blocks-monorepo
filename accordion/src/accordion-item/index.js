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

const AccordionItemIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M4 16H14V17.5H4V16Z"
			fill="#1E1E1E"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M4 11.5H20V13H4V11.5Z"
			fill="#1E1E1E"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M10 7L20 7V8.5L10 8.5V7Z"
			fill="#1E1E1E"
		/>
		<path d="M4 5.25L8 7.75L4 10.25V5.25Z" fill="#1E1E1E" />
	</svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	icon: <AccordionItemIcon />,

	/**
	 * @see ./save.js
	 */
	save,
} );
