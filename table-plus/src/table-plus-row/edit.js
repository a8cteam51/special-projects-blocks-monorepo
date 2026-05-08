import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { plus, tableRowBefore, tableRowAfter } from '@wordpress/icons';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'wpcomsp/table-plus-cell' ];
const TEMPLATE = [
	[ 'wpcomsp/table-plus-cell', {} ],
	[ 'wpcomsp/table-plus-cell', {} ],
	[ 'wpcomsp/table-plus-cell', {} ],
];

const LOCKED = { move: true, remove: false };
const UNLOCKED = { move: false, remove: false };

export default function Edit( { clientId, attributes } ) {
	const { rowType } = attributes;

	const blockProps = useBlockProps( {
		className:
			rowType === 'header'
				? 'is-row-header'
				: rowType === 'footer'
				? 'is-row-footer'
				: undefined,
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		orientation: 'horizontal',
	} );

	const {
		rowIndex,
		parentClientId,
		cellCount,
		siblingRowIds,
		existingHeaderId,
		existingFooterId,
	} = useSelect(
		( select ) => {
			const {
				getBlockRootClientId,
				getBlockIndex,
				getBlockCount,
				getBlockOrder,
				getBlockAttributes,
			} = select( 'core/block-editor' );
			const parentId = getBlockRootClientId( clientId );
			const order = getBlockOrder( parentId );

			let headerId = null;
			let footerId = null;
			for ( const id of order ) {
				const attrs = getBlockAttributes( id ) || {};
				if ( attrs.rowType === 'header' && id !== clientId ) {
					headerId = id;
				}
				if ( attrs.rowType === 'footer' && id !== clientId ) {
					footerId = id;
				}
			}

			return {
				rowIndex: getBlockIndex( clientId ),
				parentClientId: parentId,
				cellCount: getBlockCount( clientId ),
				siblingRowIds: order,
				existingHeaderId: headerId,
				existingFooterId: footerId,
			};
		},
		[ clientId ]
	);

	const { insertBlock, moveBlockToPosition, updateBlockAttributes } =
		useDispatch( 'core/block-editor' );

	const promoteToHeader = () => {
		if ( existingHeaderId ) {
			updateBlockAttributes( existingHeaderId, {
				rowType: 'body',
				lock: UNLOCKED,
			} );
		}
		updateBlockAttributes( clientId, {
			rowType: 'header',
			lock: LOCKED,
		} );
		moveBlockToPosition( clientId, parentClientId, parentClientId, 0 );
	};

	const promoteToFooter = () => {
		if ( existingFooterId ) {
			updateBlockAttributes( existingFooterId, {
				rowType: 'body',
				lock: UNLOCKED,
			} );
		}
		updateBlockAttributes( clientId, {
			rowType: 'footer',
			lock: LOCKED,
		} );
		moveBlockToPosition(
			clientId,
			parentClientId,
			parentClientId,
			Math.max( 0, siblingRowIds.length - 1 )
		);
	};

	const demoteToBody = () => {
		updateBlockAttributes( clientId, {
			rowType: 'body',
			lock: UNLOCKED,
		} );
	};

	const toggleRowType = ( target ) => {
		if ( rowType === target ) {
			demoteToBody();
		} else if ( target === 'header' ) {
			promoteToHeader();
		} else if ( target === 'footer' ) {
			promoteToFooter();
		}
	};

	const addRowBelow = () => {
		// On a footer row, "below" would land outside the locked footer, so
		// insert just above it instead — keeping the footer pinned to the end.
		const insertIndex = rowType === 'footer' ? rowIndex : rowIndex + 1;
		const cells = Array.from( { length: cellCount }, () =>
			createBlock( 'wpcomsp/table-plus-cell', {} )
		);
		insertBlock(
			createBlock( 'wpcomsp/table-plus-row', {}, cells ),
			insertIndex,
			parentClientId
		);
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ tableRowBefore }
						label={ __( 'Header row', 'table-plus' ) }
						isPressed={ rowType === 'header' }
						onClick={ () => toggleRowType( 'header' ) }
					/>
					<ToolbarButton
						icon={ tableRowAfter }
						label={ __( 'Footer row', 'table-plus' ) }
						isPressed={ rowType === 'footer' }
						onClick={ () => toggleRowType( 'footer' ) }
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						icon={ plus }
						label={ __( 'Add row below', 'table-plus' ) }
						onClick={ addRowBelow }
					/>
				</ToolbarGroup>
			</BlockControls>
			{ /* div in edit mode; save() emits <tr>. render.php groups rows into thead/tbody/tfoot on the frontend. */ }
			<div { ...innerBlocksProps } />
		</>
	);
}
