/**
 * WordPress dependencies
 */
import {
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

export default function Edit( {
	attributes: { allowedBlocks, templateLock },
	clientId,
	context: { 'tabs/activeTab': activeTab },
	isSelected,
	setAttributes,
} ) {
	const { tabNumber, hasChildBlocks, isTabSelected } = useSelect(
		( select ) => {
			const {
				getBlockIndex,
				getBlockOrder,
				getBlockRootClientId,
				hasSelectedInnerBlock,
			} = select( blockEditorStore );

			const hasAnyBlockSelected =
				isSelected || hasSelectedInnerBlock( clientId, true );
			const tabIndex = getBlockIndex( clientId );
			const showDefaultTab =
				! hasSelectedInnerBlock(
					getBlockRootClientId( clientId ),
					true
				) && tabIndex + 1 === activeTab;

			return {
				tabNumber: tabIndex + 1,
				hasChildBlocks: getBlockOrder( clientId ).length > 0,
				isTabSelected: hasAnyBlockSelected || showDefaultTab,
			};
		},
		[ activeTab, clientId, isSelected ]
	);
	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		renderAppender: hasChildBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	useEffect( () => {
		__unstableMarkNextChangeAsNotPersistent();
		setAttributes( {
			isActive: tabNumber === activeTab,
			tabNumber,
		} );
	}, [
		activeTab,
		tabNumber,
		setAttributes,
		__unstableMarkNextChangeAsNotPersistent,
	] );

	return (
		<div
			{ ...innerBlocksProps }
			role="tabpanel"
			aria-labelledby={ `tab-${ tabNumber }` }
			hidden={ ! isTabSelected }
		/>
	);
}
