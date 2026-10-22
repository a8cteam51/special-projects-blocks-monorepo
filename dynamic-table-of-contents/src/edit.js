import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Notice,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanelItem as ToolsPanelItem, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';

const HEADING_LEVELS = [ 1, 2, 3, 4, 5, 6 ];

/**
 * Whether a heading level is listed. Blocks saved before 0.5.0 have no
 * includeH* attributes, so a missing one counts as included.
 *
 * @param {Object} attributes Block attributes.
 * @param {number} level      Heading level, 1 to 6.
 * @return {boolean} Whether the level is included.
 */
function isLevelIncluded( attributes, level ) {
	return false !== attributes[ `includeH${ level }` ];
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block edit props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Updates block attributes.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const hasNoLevels = ! HEADING_LEVELS.some( ( level ) =>
		isLevelIncluded( attributes, level )
	);

	const resetAll = () =>
		setAttributes( {
			includeH1: true,
			includeH2: true,
			includeH3: true,
			includeH4: true,
			includeH5: true,
			includeH6: true,
			includeNestedHeadings: false,
		} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'dynamic-table-of-contents' ) }
					resetAll={ resetAll }
				>
					{ HEADING_LEVELS.map( ( level ) => {
						const attribute = `includeH${ level }`;
						const label = sprintf(
							/* translators: %d: heading level, 1 to 6. */
							__(
								'Include H%d headings',
								'dynamic-table-of-contents'
							),
							level
						);

						return (
							<ToolsPanelItem
								key={ attribute }
								label={ label }
								hasValue={ () =>
									! isLevelIncluded( attributes, level )
								}
								onDeselect={ () =>
									setAttributes( { [ attribute ]: true } )
								}
								isShownByDefault
							>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ label }
									checked={ isLevelIncluded(
										attributes,
										level
									) }
									onChange={ ( checked ) =>
										setAttributes( {
											[ attribute ]: checked,
										} )
									}
								/>
							</ToolsPanelItem>
						);
					} ) }
					{ hasNoLevels && (
						// ToolsPanel lays its children out on a grid; span every column.
						<div style={ { gridColumn: '1 / -1' } }>
							<Notice status="warning" isDismissible={ false }>
								{ __(
									'No heading levels are included, so the table of contents will not show on the site.',
									'dynamic-table-of-contents'
								) }
							</Notice>
						</div>
					) }
					<ToolsPanelItem
						label={ __(
							'Include headings nested in other blocks',
							'dynamic-table-of-contents'
						) }
						hasValue={ () => !! attributes.includeNestedHeadings }
						onDeselect={ () =>
							setAttributes( { includeNestedHeadings: false } )
						}
						isShownByDefault
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
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<RichText
					tagName="h2"
					placeholder={ __(
						'Table of Contents Title',
						'dynamic-table-of-contents'
					) }
					value={ attributes.title }
					onChange={ ( title ) => setAttributes( { title } ) }
					className="table-of-contents-title"
				/>
				{ /* A static preview: the real list is built on the front end, so these links go nowhere. */ }
				{ /* eslint-disable jsx-a11y/anchor-is-valid */ }
				<ul className="table-of-contents-list">
					<li className="table-of-contents-list-item">
						<a href="#" className="active">
							This is an example.
						</a>
					</li>
					<li className="table-of-contents-list-item">
						<a href="#">Of the block appearance.</a>
					</li>
					<li className="table-of-contents-list-item">
						<a href="#">When used in your post.</a>
					</li>
				</ul>
				{ /* eslint-enable jsx-a11y/anchor-is-valid */ }
			</div>
		</>
	);
}
