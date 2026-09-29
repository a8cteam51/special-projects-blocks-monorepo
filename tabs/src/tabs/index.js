/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';

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
import deprecated from './deprecated';
import transforms from './transforms';

const TabsIcon = (
	<SVG width="24" height="24" viewBox="0 0 24 24" fill="none">
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.2998 4.8501C4.60945 4.8501 4.0498 5.40974 4.0498 6.1001V10.3501H11.3498V6.1001C11.3498 5.40974 10.7902 4.8501 10.0998 4.8501H5.2998ZM14.2002 10.3501V7.1001H18.5002V10.3501H20.0002V6.8501C20.0002 6.15974 19.4406 5.6001 18.7502 5.6001H13.9502C13.2598 5.6001 12.7002 6.15974 12.7002 6.8501V10.3501H14.2002ZM20 12.6001H4V14.1001H20V12.6001ZM14 17.1001H4V18.6001H14V17.1001Z"
			fill="currentColor"
		/>
	</SVG>
);

registerBlockType( metadata.name, {
	icon: TabsIcon,
	edit: Edit,
	save,
	deprecated,
	transforms,
} );
