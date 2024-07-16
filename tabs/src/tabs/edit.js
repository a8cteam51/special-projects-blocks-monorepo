/**
 * WordPress dependencies
 */
import {
	BlockIcon,
	store as blockEditorStore,
	useBlockDisplayInformation,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { Button, Placeholder, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const TAB_BLOCK_NAME = 'wpcomsp/tab';
const TAB_BLOCK = {
	name: TAB_BLOCK_NAME,
};

function createInnerTabsTemplate( count ) {
	return [ ...Array( count ).keys() ].map( () => [ TAB_BLOCK_NAME ] );
}

function TabsEdit( { attributes: { templateLock } } ) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		defaultBlock: TAB_BLOCK,
		directInsert: true,
		orientation: 'horizontal',
		renderAppender: false,
		templateLock,
	} );

	return <div { ...innerBlocksProps } />;
}

function TabsPlaceholder( { clientId } ) {
	const blockProps = useBlockProps();
	const [ initialTabsCount, setInitialColumnCount ] = useState( 3 );
	const { title, icon } = useBlockDisplayInformation( clientId );
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	function onCreateTabs( event ) {
		event.preventDefault();

		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate(
				createInnerTabsTemplate( initialTabsCount )
			),
			true
		);
	}

	return (
		<div { ...blockProps }>
			<Placeholder
				label={ title }
				icon={ <BlockIcon icon={ icon } showColors /> }
				instructions={ __(
					'Insert tabs to organize content.',
					'tabs'
				) }
			>
				<form
					className="blocks-tabs__placeholder-form"
					onSubmit={ onCreateTabs }
				>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						type="number"
						label={ __( 'Tabs count', 'tabs' ) }
						value={ initialTabsCount }
						onChange={ setInitialColumnCount }
						min="1"
						className="blocks-table__placeholder-input"
					/>
					<Button
						__next40pxDefaultSize
						variant="primary"
						type="submit"
					>
						{ __( 'Create Tabs', 'tabs' ) }
					</Button>
				</form>
			</Placeholder>
		</div>
	);
}

export default function Edit( props ) {
	const hasInnerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlocks( props.clientId ).length > 0,
		[ props.clientId ]
	);

	const Component = hasInnerBlocks ? TabsEdit : TabsPlaceholder;

	return <Component { ...props } />;
}
