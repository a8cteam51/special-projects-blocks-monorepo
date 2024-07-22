import { registerBlockType } from '@wordpress/blocks';
import { SVG, Path } from '@wordpress/components';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';

const icon = (
	<SVG
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<Path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M19.5 9.25L9.5 9.25L9.5 7.75L19.5 7.75L19.5 9.25Z"
			fill="#1E1E1E"
		/>
		<Path d="M4.5 6L8.5 8.5L4.5 11L4.5 6Z" fill="#1E1E1E" />
		<Path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M19.5 16.25L9.5 16.25L9.5 14.75L19.5 14.75L19.5 16.25Z"
			fill="#1E1E1E"
		/>
		<Path d="M4.5 13L8.5 15.5L4.5 18L4.5 13Z" fill="#1E1E1E" />
	</SVG>
);

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	save,
} );
