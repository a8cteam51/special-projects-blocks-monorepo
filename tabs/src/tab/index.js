/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const TabIcon = (
	<SVG width="24" height="24" viewBox="0 0 24 24" fill="none">
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.5498 10.3501V6.3501H9.8498V10.3501H11.3498V6.1001C11.3498 5.40974 10.7902 4.8501 10.0998 4.8501H5.2998C4.60945 4.8501 4.0498 5.40974 4.0498 6.1001V10.3501H5.5498ZM20 12.6001H4V14.1001L20 14.1001V12.6001ZM14 17.1001H4V18.6001H14V17.1001Z"
			fill="currentColor"
		/>
	</SVG>
);

registerBlockType( metadata.name, {
	icon: TabIcon,
	edit: Edit,
	save,
} );
