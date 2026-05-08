import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { tableRowDelete, tableColumnDelete } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'wpcomsp/table-plus-row' ];
const TEMPLATE = [
	[
		'wpcomsp/table-plus-row',
		{},
		[
			[ 'wpcomsp/table-plus-cell', {} ],
			[ 'wpcomsp/table-plus-cell', {} ],
			[ 'wpcomsp/table-plus-cell', {} ],
		],
	],
];

// Translate the core border-support attributes (style.border.*, borderColor)
// into the --tp-border-* CSS variables consumed by cells. Returned as a style
// object suitable for spreading into useBlockProps. Skipped serialization on
// the supports.__experimentalBorder declaration means core won't try to write
// these to the wrapper itself.
function buildBorderVars( attributes ) {
	const border = attributes.style?.border ?? {};
	const presetSlug = attributes.borderColor;

	const color =
		border.color ??
		( presetSlug ? `var(--wp--preset--color--${ presetSlug })` : undefined );

	const vars = {};
	if ( border.width ) {
		vars[ '--tp-border-width' ] = border.width;
	}
	if ( border.style ) {
		vars[ '--tp-border-style' ] = border.style;
	}
	if ( color ) {
		vars[ '--tp-border-color' ] = color;
	}

	return vars;
}

export default function Edit( { clientId, attributes } ) {
	const blockProps = useBlockProps( { style: buildBorderVars( attributes ) } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
	} );

	const { selectedRowClientId, columnCellClientIds } = useSelect(
		( select ) => {
			const {
				getSelectedBlockClientId,
				getBlockRootClientId,
				getBlockIndex,
				getBlockName,
				getBlockOrder,
			} = select( 'core/block-editor' );

			const selectedId = getSelectedBlockClientId();
			const rows = getBlockOrder( clientId );

			if ( ! selectedId ) {
				return { selectedRowClientId: null, columnCellClientIds: [] };
			}

			const selectedName = getBlockName( selectedId );
			let rowId = null;
			let colIndex = null;

			if ( selectedName === 'wpcomsp/table-plus-cell' ) {
				rowId = getBlockRootClientId( selectedId );
				colIndex = getBlockIndex( selectedId );
			} else if ( selectedName === 'wpcomsp/table-plus-row' ) {
				rowId = selectedId;
			}

			const colCells =
				colIndex !== null
					? rows
							.map( ( rowClientId ) => {
								const cells = getBlockOrder( rowClientId );
								return cells[ colIndex ];
							} )
							.filter( Boolean )
					: [];

			return {
				selectedRowClientId: rowId,
				columnCellClientIds: colCells,
			};
		},
		[ clientId ]
	);

	const { removeBlock, removeBlocks } = useDispatch( 'core/block-editor' );

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ tableRowDelete }
						label={ __( 'Delete row', 'table-plus' ) }
						onClick={ () =>
							selectedRowClientId &&
							removeBlock( selectedRowClientId )
						}
						disabled={ ! selectedRowClientId }
					/>
					<ToolbarButton
						icon={ tableColumnDelete }
						label={ __( 'Delete column', 'table-plus' ) }
						onClick={ () =>
							columnCellClientIds.length > 0 &&
							removeBlocks( columnCellClientIds )
						}
						disabled={ columnCellClientIds.length === 0 }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
