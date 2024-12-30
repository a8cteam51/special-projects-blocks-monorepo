/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import Edit from './edit';
import PressMetaFields from './press-meta-fields';
import metadata from './block.json';

// Register the block type.
registerBlockType( metadata.name, {
	edit: Edit,
} );

// Register the meta-fields plugin.
registerPlugin( 'press-meta-fields', {
	render: PressMetaFields,
} );
