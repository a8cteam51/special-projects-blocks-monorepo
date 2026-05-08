import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	// Surfaces in list view, breadcrumbs, and the block toolbar header.
	__experimentalLabel( attributes ) {
		if ( attributes.rowType === 'header' ) {
			return __( 'Header', 'table-plus' );
		}
		if ( attributes.rowType === 'footer' ) {
			return __( 'Footer', 'table-plus' );
		}
		return undefined;
	},
} );
