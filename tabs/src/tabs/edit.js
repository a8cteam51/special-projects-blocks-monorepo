/**
 * WordPress dependencies
 */
import {
	BlockIcon,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
	useBlockDisplayInformation,
	useBlockProps,
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
import { useEffect, useState } from '@wordpress/element';
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

function TabsInspectorControls( { clientId, setAttributes } ) {
	const tabs = useSelect(
		( select ) => {
			return select( blockEditorStore ).getBlocks( clientId );
		},
		[ clientId ]
	);
	const { title, icon } = useBlockDisplayInformation( tabs[ 0 ].clientId );
	const { insertBlock } = useDispatch( blockEditorStore );

	function addNewTab() {
		insertBlock(
			createBlock( TAB_BLOCK_NAME ),
			tabs.length,
			clientId,
			false
		);
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Tabs', 'tabs' ) }>
				{ tabs.map( ( tab, index ) => (
					<PanelRow key={ tab.clientId }>
						<Button
							icon={ <BlockIcon icon={ icon } showColors /> }
							onClick={ setAttributes.bind( null, {
								activeTab: index,
							} ) }
						>
							{ title }
						</Button>
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

function TabButton( { clientId, isActiveTab, tabNumber, setActiveTab } ) {
	const { isTabBlockSelected, title } = useSelect(
		( select ) => {
			const { getBlock, hasSelectedInnerBlock, isBlockSelected } =
				select( blockEditorStore );

			return {
				isTabBlockSelected:
					isBlockSelected( clientId ) ||
					hasSelectedInnerBlock( clientId, true ),
				title: getBlock( clientId ).attributes.title,
			};
		},
		[ clientId ]
	);

	return (
		<button
			id={ `tab-${ tabNumber }` }
			type="button"
			role="tab"
			aria-selected={ isTabBlockSelected || isActiveTab }
			aria-controls={ `tabpanel-${ tabNumber }` }
			tabIndex={ isTabBlockSelected || isActiveTab ? undefined : '-1' }
			onClick={ setActiveTab }
		>
			<span>{ title || __( 'Tab', 'tabs' ) }</span>
		</button>
	);
}

function TabsEdit( {
	attributes: { activeTab, tabsCount, templateLock },
	clientId,
	setAttributes,
} ) {
	const blockProps = useBlockProps();
	const { hasTabSelected, tabBlocks } = useSelect(
		( select ) => {
			const { getBlocks, hasSelectedInnerBlock } =
				select( blockEditorStore );
			return {
				tabBlocks: getBlocks( clientId ),
				hasTabSelected: hasSelectedInnerBlock( clientId, true ),
			};
		},
		[ clientId ]
	);
	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );

	useEffect( () => {
		if ( tabBlocks.length <= activeTab ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( { activeTab: 0 } );
		}
		if ( tabBlocks.length !== tabsCount ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( { tabsCount: tabBlocks.length } );
		}
	}, [
		activeTab,
		setAttributes,
		tabBlocks,
		tabsCount,
		__unstableMarkNextChangeAsNotPersistent,
	] );

	return (
		<>
			<TabsInspectorControls
				clientId={ clientId }
				setAttributes={ setAttributes }
			/>
			<div { ...blockProps }>
				<div role="tablist">
					{ tabBlocks.map( ( tabBlock, index ) => (
						<TabButton
							key={ tabBlock.clientId }
							clientId={ tabBlock.clientId }
							isActiveTab={
								! hasTabSelected && activeTab === index
							}
							tabNumber={ index + 1 }
							setActiveTab={ setAttributes.bind( null, {
								activeTab: index,
							} ) }
						/>
					) ) }
				</div>
				<InnerBlocks
					__experimentalCaptureToolbars
					defaultBlock={ TAB_BLOCK }
					directInsert
					orientation="horizontal"
					templateLock={ templateLock }
				/>
			</div>
		</>
	);
}

function TabsPlaceholder( { clientId } ) {
	const blockProps = useBlockProps();
	const [ initialTabsCount, setInitialColumnCount ] = useState( 2 );
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
