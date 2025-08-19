/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	RichText,
	store as blockEditorStore,
	useBlockProps,
	BlockControls,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ToolbarButton } from '@wordpress/components';
import { chevronLeft, chevronRight } from '@wordpress/icons';
import isEqual from 'fast-deep-equal';

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

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const handleTitleChange = ( newTitle ) => {
		updateBlockAttributes( clientId, { title: newTitle } );
	};

	return (
		<div
			id={ `tab-${ tabNumber }` }
			role="tab"
			className='tab'
			aria-selected={ isTabBlockSelected || isActiveTab }
			aria-controls={ `tabpanel-${ tabNumber }` }
			onClick={ setActiveTab }
		>
			<RichText
				tagName="span"
				value={ title }
				onChange={ handleTitleChange }
				placeholder={ __( 'Add text…', 'tabs' ) }
				allowedFormats={ [
					'core/bold',
					'core/italic',
					'core/link',
					'core/image',
				] }
				className="tab-button-text"
				disableLineBreaks
			/>
		</div>
	);
}

function TabsEdit( {
	attributes: { activeTab, tabs, templateLock },
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
	const { __unstableMarkNextChangeAsNotPersistent, replaceInnerBlocks } =
		useDispatch( blockEditorStore );

	useEffect( () => {
		if ( tabBlocks.length < activeTab ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( { activeTab: tabBlocks.length > 0 ? 1 : 0 } );
		}
		if (
			tabBlocks.length !== tabs.length ||
			tabBlocks.some( ( block, index ) => ! isEqual( block.attributes, tabs[ index ] ) )
		) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( {
				tabs: tabBlocks.map( ( block ) => block.attributes ),
			} );
		}
	}, [
		activeTab,
		setAttributes,
		tabBlocks,
		tabs,
		__unstableMarkNextChangeAsNotPersistent,
	] );

	const moveTabLeft = () => {
		if ( activeTab > 1 ) {
			const newActiveTab = activeTab - 1;

			// Create a new array with the reordered blocks
			const newBlockOrder = [ ...tabBlocks ];
			const currentBlock = newBlockOrder[ activeTab - 1 ];
			const previousBlock = newBlockOrder[ activeTab - 2 ];

			// Swap the blocks
			newBlockOrder[ activeTab - 2 ] = currentBlock;
			newBlockOrder[ activeTab - 1 ] = previousBlock;

			// Replace the inner blocks with the reordered version
			replaceInnerBlocks( clientId, newBlockOrder, false );

			// Update the active tab
			setAttributes( { activeTab: newActiveTab } );
		}
	};

	const moveTabRight = () => {
		if ( activeTab < tabBlocks.length ) {
			const newActiveTab = activeTab + 1;

			// Create a new array with the reordered blocks
			const newBlockOrder = [ ...tabBlocks ];
			const currentBlock = newBlockOrder[ activeTab - 1 ];
			const nextBlock = newBlockOrder[ activeTab ];

			// Swap the blocks
			newBlockOrder[ activeTab ] = currentBlock;
			newBlockOrder[ activeTab - 1 ] = nextBlock;

			// Replace the inner blocks with the reordered version
			replaceInnerBlocks( clientId, newBlockOrder, false );

			// Update the active tab
			setAttributes( { activeTab: newActiveTab } );
		}
	};

	return (
		<>
			<BlockControls>
				<ToolbarButton
					icon={ chevronLeft }
					label={ __( 'Move tab left', 'tabs' ) }
					onClick={ moveTabLeft }
					disabled={ activeTab <= 1 }
				/>
				<ToolbarButton
					icon={ chevronRight }
					label={ __( 'Move tab right', 'tabs' ) }
					onClick={ moveTabRight }
					disabled={ activeTab >= tabBlocks.length }
				/>
			</BlockControls>
			<div { ...blockProps }>
				<div role="tablist">
					{ tabBlocks.map( ( tabBlock, index ) => {
						const tabNumber = index + 1;
						return (
							<TabButton
								key={ tabBlock.clientId }
								clientId={ tabBlock.clientId }
								isActiveTab={
									! hasTabSelected && activeTab === tabNumber
								}
								tabNumber={ tabNumber }
								setActiveTab={ setAttributes.bind( null, {
									activeTab: tabNumber,
								} ) }
							/>
						);
					} ) }
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

export default function Edit( props ) {
	return <TabsEdit { ...props } />;
}
