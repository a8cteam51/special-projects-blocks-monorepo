import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import {
	tableColumnAfter,
	tableColumnBefore,
	chevronLeft,
	chevronRight,
} from '@wordpress/icons';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch, useRegistry } from '@wordpress/data';
import './editor.scss';

export default function Edit( { clientId, attributes, setAttributes } ) {
	const { content } = attributes;

	const blockProps = useBlockProps();

	const {
		cellIndex,
		columnCount,
		rowClientIds,
		cellsByRow,
		nextCellClientId,
	} = useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlockIndex, getBlockOrder } =
				select( 'core/block-editor' );
			const rowId = getBlockRootClientId( clientId );
			const tableClientId = getBlockRootClientId( rowId );
			const allRows = getBlockOrder( tableClientId );
			const cells = getBlockOrder( rowId );
			const cIdx = getBlockIndex( clientId );
			const rowIdx = allRows.indexOf( rowId );

			let nextCell = null;
			if ( cIdx + 1 < cells.length ) {
				nextCell = cells[ cIdx + 1 ];
			} else if ( rowIdx + 1 < allRows.length ) {
				const nextRowCells = getBlockOrder( allRows[ rowIdx + 1 ] );
				nextCell = nextRowCells[ 0 ] ?? null;
			}

			return {
				cellIndex: cIdx,
				columnCount: cells.length,
				rowClientIds: allRows,
				cellsByRow: allRows.map( ( rId ) => getBlockOrder( rId ) ),
				nextCellClientId: nextCell,
			};
		},
		[ clientId ]
	);

	const { insertBlock, moveBlockToPosition, selectBlock } =
		useDispatch( 'core/block-editor' );
	const registry = useRegistry();

	// Insert a new empty cell at `atIndex` in every row, preserving the
	// invariant that all rows have the same column count.
	const addColumn = ( atIndex ) => {
		registry.batch( () => {
			rowClientIds.forEach( ( rowId ) => {
				insertBlock(
					createBlock( 'wpcomsp/table-plus-cell', {} ),
					atIndex,
					rowId,
					false
				);
			} );
		} );
	};

	const addColumnLeft = () => addColumn( cellIndex );
	const addColumnRight = () => addColumn( cellIndex + 1 );

	// Swap the current column with its left or right neighbour. One
	// moveBlockToPosition per row, batched so the operation lands as a single
	// undo entry. Selection follows clientId so the moved cell stays selected.
	const moveColumn = ( direction ) => {
		const target = cellIndex + direction;
		if ( target < 0 || target >= columnCount ) {
			return;
		}

		registry.batch( () => {
			rowClientIds.forEach( ( rowId, i ) => {
				const cellsInRow = cellsByRow[ i ] ?? [];
				const sourceCell = cellsInRow[ cellIndex ];
				if ( ! sourceCell || target >= cellsInRow.length ) {
					return;
				}
				moveBlockToPosition( sourceCell, rowId, rowId, target );
			} );
		} );
	};

	const handleKeyDown = ( event ) => {
		if ( event.key !== 'Tab' ) {
			return;
		}
		event.preventDefault();
		if ( nextCellClientId ) {
			selectBlock( nextCellClientId );
		}
	};

	const canMoveLeft = cellIndex > 0;
	const canMoveRight = cellIndex + 1 < columnCount;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ tableColumnBefore }
						label={ __( 'Add column left', 'table-plus' ) }
						onClick={ addColumnLeft }
					/>
					<ToolbarButton
						icon={ tableColumnAfter }
						label={ __( 'Add column right', 'table-plus' ) }
						onClick={ addColumnRight }
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						icon={ chevronLeft }
						label={ __( 'Move column left', 'table-plus' ) }
						onClick={ () => moveColumn( -1 ) }
						disabled={ ! canMoveLeft }
					/>
					<ToolbarButton
						icon={ chevronRight }
						label={ __( 'Move column right', 'table-plus' ) }
						onClick={ () => moveColumn( 1 ) }
						disabled={ ! canMoveRight }
					/>
				</ToolbarGroup>
			</BlockControls>
			{ /* tagName="div" matches save(): saving as a real <td> outside a
			     <table> would be stripped by the HTML parser during block
			     re-validation. render.php promotes the <div> to <td>/<th>
			     when assembling the table on the frontend. */ }
			<RichText
				tagName="div"
				{ ...blockProps }
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				placeholder={ __( 'Cell…', 'table-plus' ) }
				onKeyDown={ handleKeyDown }
			/>
		</>
	);
}
