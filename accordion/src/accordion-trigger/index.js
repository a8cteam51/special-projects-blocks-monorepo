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
			d="M19.5 12.75L9.5 12.75L9.5 11.25L19.5 11.25L19.5 12.75Z"
			fill="currentColor"
		/>
		<Path d="M4.5 9.5L8.5 12L4.5 14.5L4.5 9.5Z" fill="currentColor" />
	</SVG>
);

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	save,
} );
