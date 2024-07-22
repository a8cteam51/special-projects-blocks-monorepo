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
		fill="#ffffff"
		xmlns="http://www.w3.org/2000/svg"
	>
		<Path
			d="M8.10417 18.0002V17.2502H6.5C5.80964 17.2502 5.25 16.6906 5.25 16.0002V13.6669H4.5V10.3336H5.25V8.00024C5.25 7.30989 5.80964 6.75024 6.5 6.75024H8.10417V6.00024H10.3958V6.75024H13.6042V6.00024H15.8958V6.75024H17.5C18.1904 6.75024 18.75 7.30989 18.75 8.00024V10.3336H19.5V13.6669H18.75V16.0002C18.75 16.6906 18.1904 17.2502 17.5 17.2502H15.8958V18.0002H13.6042V17.2502H10.3958V18.0002H8.10417Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-dasharray="3.5 2.5"
		/>
	</SVG>
);

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	save,
} );
