import { registerBlockType } from '@wordpress/blocks';
import { SVG, Path } from '@wordpress/components';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const icon = (
	<SVG
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M19.5 9.5L9.5 9.5L9.5 8L19.5 8L19.5 9.5Z"
			fill="currentColor"
		/>
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M19.5 13L9.5 13L9.5 11.5L19.5 11.5L19.5 13Z"
			fill="currentColor"
		/>
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M19.5 16.3999L9.5 16.3999L9.5 14.8999L19.5 14.8999L19.5 16.3999Z"
			fill="currentColor"
		/>
		<Path d="M4.5 6.25L8.5 8.75L4.5 11.25L4.5 6.25Z" fill="currentColor" />
	</SVG>
);

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	save,
} );
