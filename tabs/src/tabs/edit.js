/**
 * WordPress dependencies
 */
import {
	BlockIcon,
	InspectorControls,
	store as blockEditorStore,
	useBlockDisplayInformation,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	PanelRow,
	Placeholder,
	TextControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { create } from '@wordpress/icons';

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
	const template = [];
	for ( let i = 0; i < count; i++ ) {
		template.push( [ TAB_BLOCK_NAME ] );
	}

	return template;
}

function TabsInspectorControls( { clientId } ) {
	const tabs = useSelect(
		( select ) => {
			return select( blockEditorStore ).getBlocks( clientId );
		},
		[ clientId ]
	);
	const { title, icon } = useBlockDisplayInformation( tabs[ 0 ].clientId );
	const { insertBlock } = useDispatch( blockEditorStore );

	function addNewTab() {
		insertBlock( createBlock( TAB_BLOCK_NAME ), tabs.length, clientId );
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Tabs', 'tabs' ) }>
				{ tabs.map( ( tab ) => (
					<PanelRow key={ tab.clientId }>
						<BlockIcon icon={ icon } showColors />
						{ title }
					</PanelRow>
				) ) }
				<PanelRow>
					<Button
						icon={ create }
						label={ __( 'Add a new tab', 'tabs' ) }
						onClick={ addNewTab }
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
}

function TabsEdit( { attributes: { templateLock }, clientId } ) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		defaultBlock: TAB_BLOCK,
		directInsert: true,
		orientation: 'horizontal',
		renderAppender: false,
		templateLock,
	} );

	return (
		<>
			<TabsInspectorControls clientId={ clientId } />
			<div { ...innerBlocksProps } />
		</>
	);
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
				<form onSubmit={ onCreateTabs }>
					<TextControl
						__next40pxDefaultSize
						type="number"
						label={ __( 'Tabs count', 'tabs' ) }
						min="1"
						value={ initialTabsCount }
						onChange={ setInitialColumnCount }
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
