/**
 * WordPress dependencies
 */
import {
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

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
	isSelected,
} ) {
	const { hasChildBlocks, isActive } = useSelect(
		( select ) => {
			const {
				getBlockIndex,
				getBlockOrder,
				getBlockRootClientId,
				hasSelectedInnerBlock,
			} = select( blockEditorStore );

			const isTabSelected =
				isSelected || hasSelectedInnerBlock( clientId, true );
			const showDefaultTab =
				! hasSelectedInnerBlock(
					getBlockRootClientId( clientId ),
					true
				) && getBlockIndex( clientId ) === 0;

			return {
				hasChildBlocks: getBlockOrder( clientId ).length > 0,
				isActive: isTabSelected || showDefaultTab,
			};
		},
		[ clientId, isSelected ]
	);

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		renderAppender: hasChildBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	return <div hidden={ ! isActive } { ...innerBlocksProps } />;
}
