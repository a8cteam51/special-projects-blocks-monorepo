import { registerBlockType } from '@wordpress/blocks';
import { postContent as icon } from '@wordpress/icons';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	save,
} );
