import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	Button,
	PanelBody,
	ToggleControl,
	PanelRow,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';

import { useMemo } from '@wordpress/element';

/* Internal dependencies */
import ListItem from './components/list-item';

const ALL_HEADING_LEVELS = [ 1, 2, 3, 4, 5, 6 ];

// Mirrors the frontend's default opt-out class. Selectors changed through the
// `a8csp_dynamic_table_of_contents_exclude_selectors` filter are not reflected
// in the editor.
const EXCLUDE_CLASS = 'hide-from-toc';

// Set by `wpcomsp_dynamic_table_of_contents_editor_settings()`.
const allowCustomTitles =
	window.wpcomspDynamicTOCEditor?.allowCustomTitles !== false;

const stripHTML = ( html ) => {
	const doc = new window.DOMParser().parseFromString( html, 'text/html' );
	return doc.body.textContent ?? '';
};

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   props               Props passed to the block, including attributes and setAttributes function.
 * @param {Object}   props.attributes    The current attributes of the block.
 * @param {Function} props.setAttributes Function to update the block's attributes.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { headingLevels, title, customTitles } = attributes;

	// An empty selection falls back to every level, matching render.php.
	const levels = headingLevels?.length ? headingLevels : ALL_HEADING_LEVELS;
	const showCustomTitles = allowCustomTitles && customTitles;

	// Heading blocks the frontend would list: skip headings in template parts
	// (outside the post content) and any opted out with the exclude class.
	const allHeadingBlocks = useSelect( ( select ) => {
		const {
			getClientIdsWithDescendants,
			getBlockName,
			getBlockAttributes,
			getBlockParents,
			getBlock,
		} = select( blockEditorStore );

		const hasExcludeClass = ( clientId ) =>
			( getBlockAttributes( clientId )?.className ?? '' )
				.split( /\s+/ )
				.includes( EXCLUDE_CLASS );

		return getClientIdsWithDescendants()
			.filter( ( clientId ) => {
				if ( getBlockName( clientId ) !== 'core/heading' ) {
					return false;
				}

				const parents = getBlockParents( clientId );

				return (
					! parents.some(
						( id ) => getBlockName( id ) === 'core/template-part'
					) && ! [ clientId, ...parents ].some( hasExcludeClass )
				);
			} )
			.map( ( clientId ) => getBlock( clientId ) );
	}, [] );

	const headingBlocks = useMemo(
		() =>
			allHeadingBlocks
				.filter( ( block ) =>
					levels.includes( block.attributes.level )
				)
				.map( ( block ) => ( {
					clientId: block.clientId,
					// `content` is RichTextData (WP 6.5+), a string, or undefined.
					plainTextContent: stripHTML(
						String( block.attributes.content ?? '' )
					),
					customTitle: block.attributes.customTitle,
				} ) ),
		[ allHeadingBlocks, levels ]
	);

	const updateHeadingLevels = ( level ) => {
		const newHeadingLevels = levels.includes( level )
			? levels.filter( ( l ) => l !== level )
			: [ ...levels, level ];

		// Keep at least one level selected.
		if ( ! newHeadingLevels.length ) {
			return;
		}

		setAttributes( { headingLevels: newHeadingLevels } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'dynamic-table-of-contents' ) }
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __(
							'Include headings nested in other blocks',
							'dynamic-table-of-contents'
						) }
						help={ __(
							'List headings that come from wrapper blocks such as accordions, which split their title across extra elements. These headings have no anchor of their own, so one is generated from the heading text on the frontend.',
							'dynamic-table-of-contents'
						) }
						checked={ !! attributes.includeNestedHeadings }
						onChange={ ( includeNestedHeadings ) =>
							setAttributes( { includeNestedHeadings } )
						}
					/>
					<h3>
						{ __(
							'Headings to include',
							'dynamic-table-of-contents'
						) }
					</h3>
					<div
						style={ {
							display: 'flex',
							flexWrap: 'wrap',
							gap: '4px',
						} }
					>
						{ ALL_HEADING_LEVELS.map( ( level ) => (
							<Button
								key={ level }
								size="compact"
								variant="secondary"
								isPressed={ levels.includes( level ) }
								onClick={ () => {
									updateHeadingLevels( level );
								} }
							>
								H{ level }
							</Button>
						) ) }
					</div>
					{ allowCustomTitles && (
						<>
							<h3 style={ { marginTop: '2em' } }>
								{ __(
									'Custom Titles',
									'dynamic-table-of-contents'
								) }
							</h3>
							<PanelRow>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __(
										'Enable Custom titles',
										'dynamic-table-of-contents'
									) }
									help={
										customTitles
											? __(
													'Custom titles enabled.',
													'dynamic-table-of-contents'
											  )
											: __(
													'Custom titles disabled.',
													'dynamic-table-of-contents'
											  )
									}
									checked={ customTitles }
									onChange={ ( newValue ) => {
										setAttributes( {
											customTitles: newValue,
										} );
									} }
								/>
							</PanelRow>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<RichText
					tagName="h2"
					placeholder={ __(
						'Table of Contents Title',
						'dynamic-table-of-contents'
					) }
					value={ title }
					onChange={ ( newTitle ) =>
						setAttributes( { title: newTitle } )
					}
					className="table-of-contents-title"
				/>
				<ul className="table-of-contents-list">
					{ headingBlocks.length > 0 ? (
						headingBlocks.map( ( block ) => {
							return (
								<ListItem
									key={ block.clientId }
									id={ block.clientId }
									title={
										block.plainTextContent ||
										__(
											'Untitled Heading',
											'dynamic-table-of-contents'
										)
									}
									showCustomTitles={ showCustomTitles }
									customTitle={ block.customTitle }
								/>
							);
						} )
					) : (
						<li>
							{ __(
								'No headings found. Please add some headings to your content.',
								'dynamic-table-of-contents'
							) }
						</li>
					) }
				</ul>
			</div>
		</>
	);
}
