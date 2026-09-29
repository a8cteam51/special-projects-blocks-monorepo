import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

const ListItem = ( { title, id, showCustomTitles, customTitle } ) => {
	const [ isEditing, setIsEditing ] = useState( false );
	const [ updatedText, setUpdatedText ] = useState( '' );
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const startEditing = () => {
		setUpdatedText( customTitle || title );
		setIsEditing( true );
	};

	// An empty value removes the custom title.
	const saveCustomTitle = ( value ) => {
		updateBlockAttributes( id, { customTitle: value || undefined } );
		setIsEditing( false );
	};

	return (
		<li>
			{ isEditing ? (
				<>
					<TextControl
						__next40pxDefaultSize
						value={ updatedText }
						onChange={ ( value ) => {
							setUpdatedText( value );
						} }
					/>
					<div
						style={ {
							display: 'flex',
							gap: '0.5rem',
							marginTop: '0.5rem',
						} }
					>
						<Button
							variant="primary"
							onClick={ () =>
								saveCustomTitle( updatedText.trim() )
							}
						>
							{ __( 'Update', 'dynamic-table-of-contents' ) }
						</Button>
						<Button
							variant="secondary"
							onClick={ () => saveCustomTitle( '' ) }
						>
							{ __( 'Reset', 'dynamic-table-of-contents' ) }
						</Button>
						<Button
							variant="link"
							onClick={ () => setIsEditing( false ) }
						>
							{ __( 'Close', 'dynamic-table-of-contents' ) }
						</Button>
					</div>
				</>
			) : (
				<a href={ `#block-${ id }` }>
					{ ( showCustomTitles && customTitle ) || title }
				</a>
			) }
			{ ! isEditing && showCustomTitles && (
				<Button
					variant="link"
					className="edit-heading-title"
					onClick={ startEditing }
					style={ { marginLeft: '0.5ch' } }
				>
					{ __( 'Edit Title', 'dynamic-table-of-contents' ) }
				</Button>
			) }
		</li>
	);
};

export default ListItem;
