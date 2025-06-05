// WordPress dependencies.
import { registerBlockType } from '@wordpress/blocks';

// Internal dependencies.
import './style.css';
import edit from './edit';
import save from './save';
import variations from './variations';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit,
	save,
	variations,
} );
