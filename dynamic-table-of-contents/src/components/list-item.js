import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

const ListItem = ( { title, id, customTitles, customTitle } ) => {
	const [ isEditing, setIsEditing ] = useState( false );
	const [ updatedText, setUpdatedText ] = useState( title );
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	return (
		<li key={ id }>
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
							isPrimary
							onClick={ () => {
								updateBlockAttributes( id, {
									customTitle: updatedText,
								} );
							} }
						>
							{ __( 'Update', 'dynamic-table-of-contents' ) }
						</Button>
						<Button
							isSecondary
							onClick={ () => {
								updateBlockAttributes( id, {
									customTitle: null,
								} );
							} }
						>
							{ __( 'Reset', 'dynamic-table-of-contents' ) }
						</Button>
						<Button
							isLink
							onClick={ () => {
								setIsEditing( ! isEditing );
							} }
						>
							{ __( 'Close', 'dynamic-table-of-contents' ) }
						</Button>
					</div>
				</>
			) : (
				<a href={ `#block-${ id }` }>
					{ ( customTitles && customTitle ) || title }
				</a>
			) }
			{ ! isEditing && customTitles && (
				<Button
					isLink
					className="edit-heading-title"
					onClick={ () => {
						setIsEditing( ! isEditing );
					} }
					style={ { marginLeft: '0.5ch' } }
				>
					{ __( 'Edit Title', 'dynamic-table-of-contents' ) }
				</Button>
			) }
		</li>
	);
};

export default ListItem;
