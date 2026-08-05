/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';

const TAB_BLOCK_NAME = 'wpcomsp/tab';
const CORE_TABS_BLOCK_NAME = 'core/tabs';
const CORE_TAB_LIST_BLOCK_NAME = 'core/tab-list';
const CORE_TAB_PANELS_BLOCK_NAME = 'core/tab-panels';
const CORE_TAB_PANEL_BLOCK_NAME = 'core/tab-panel';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ CORE_TABS_BLOCK_NAME ],
			transform: ( { align, anchor }, innerBlocks ) => {
				const tabBlocks = innerBlocks.filter(
					( block ) => block.name === TAB_BLOCK_NAME
				);
				const labels = tabBlocks.map(
					( { attributes }, index ) =>
						attributes.title ||
						sprintf(
							/* translators: %d: position of the tab, starting at 1. */
							__( 'Tab %d', 'tabs' ),
							index + 1
						)
				);

				return createBlock( CORE_TABS_BLOCK_NAME, { align, anchor }, [
					createBlock( CORE_TAB_LIST_BLOCK_NAME, {
						tabs: labels.map( ( label ) => ( { label } ) ),
					} ),
					createBlock(
						CORE_TAB_PANELS_BLOCK_NAME,
						{},
						tabBlocks.map( ( tabBlock, index ) =>
							createBlock(
								CORE_TAB_PANEL_BLOCK_NAME,
								{ label: labels[ index ] },
								tabBlock.innerBlocks
							)
						)
					),
				] );
			},
		},
	],
};

export default transforms;
