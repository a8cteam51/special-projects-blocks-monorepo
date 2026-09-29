/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import {
	create,
	getTextContent,
	removeFormat,
	toHTMLString,
} from '@wordpress/rich-text';

const TAB_BLOCK_NAME = 'wpcomsp/tab';
const CORE_TABS_BLOCK_NAME = 'core/tabs';
const CORE_TAB_LIST_BLOCK_NAME = 'core/tab-list';
const CORE_TAB_PANELS_BLOCK_NAME = 'core/tab-panels';
const CORE_TAB_PANEL_BLOCK_NAME = 'core/tab-panel';

const LINK_FORMAT_NAME = 'core/link';

/**
 * Converts a tab title into a label the core tab list accepts.
 *
 * @param {string} title Tab title, as rich text.
 * @param {number} index Position of the tab, starting at 0.
 *
 * @return {string} Label as rich text.
 */
function toTabLabel( title, index ) {
	const value = create( { html: title ?? '' } );

	if ( ! getTextContent( value ).trim() ) {
		return sprintf(
			/* translators: %d: position of the tab, starting at 1. */
			__( 'Tab %d', 'tabs' ),
			index + 1
		);
	}

	// The core tab list edits labels with `withoutInteractiveFormatting`, and a
	// link inside its tab button would be interactive content nested in a control.
	return toHTMLString( {
		value: removeFormat( value, LINK_FORMAT_NAME, 0, value.text.length ),
	} );
}

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ CORE_TABS_BLOCK_NAME ],
			transform: ( { align, anchor }, innerBlocks ) => {
				const tabBlocks = innerBlocks.filter(
					( block ) => block.name === TAB_BLOCK_NAME
				);
				const labels = tabBlocks.map( ( { attributes }, index ) =>
					toTabLabel( attributes.title, index )
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
