/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	BlockControls,
	useInnerBlocksProps,
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	PanelBody,
	ToggleControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './editor.scss';
import { Star } from './icons.js';
import { createUid } from './helpers.js';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function edit( {
	clientId,
	attributes,
	setAttributes,
	isSelected,
} ) {
	const { showLabels, showCounts, mode, popoverButtonText } = attributes;

	const modes = [
		{ value: 'default', label: __( 'Default', 'reactions' ) },
		{ value: 'popover', label: __( 'Popover', 'reactions' ) },
	];

	const hasSelectedChild = useSelect(
		( select ) =>
			select( blockEditorStore ).hasSelectedInnerBlock( clientId ),
		[ clientId ]
	);

	const hasAnySelected = isSelected || hasSelectedChild;

	const blockProps = useBlockProps( {
		className: `wp-block-wpcomsp-reactions__${ mode }`,
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		placeholder: __( 'Add a reaction.', 'reactions' ),
		templateLock: false,
		orientation: attributes.layout?.orientation ?? 'horizontal',
		renderAppender: hasAnySelected && InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'reactions' ) }>
					<SelectControl
						label={ __( 'Mode', 'reactions' ) }
						value={ mode }
						options={ modes }
						onChange={ ( value ) =>
							setAttributes( { mode: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show labels', 'reactions' ) }
						checked={ showLabels }
						onChange={ () =>
							setAttributes( { showLabels: ! showLabels } )
						}
					/>
					<ToggleControl
						label={ __( 'Show counts', 'reactions' ) }
						checked={ showCounts }
						onChange={ () =>
							setAttributes( { showCounts: ! showCounts } )
						}
					/>
				</PanelBody>
				{ 'popover' === mode && (
					<PanelBody title={ __( 'Popover Settings', 'reactions' ) }>
						<TextControl
							label={ __( 'Button Text', 'reactions' ) }
							value={ popoverButtonText }
							onChange={ ( value ) =>
								setAttributes( {
									popoverButtonText: value,
								} )
							}
						/>
					</PanelBody>
				) }
			</InspectorControls>

			{ 'default' === mode && (
				<ul { ...innerBlocksProps }>{ children }</ul>
			) }
			{ 'popover' === mode && (
				<div { ...innerBlocksProps }>
					<button>
						<Star />
						{ popoverButtonText }
					</button>
					{ hasAnySelected && <ul>{ children }</ul> }
				</div>
			) }
		</>
	);
}
