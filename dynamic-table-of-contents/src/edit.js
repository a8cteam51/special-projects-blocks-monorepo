import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	BaseControl,
	CheckboxControl,
	Notice,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

const HEADING_LEVELS = [ 1, 2, 3, 4, 5, 6 ];

const HEADING_LEVELS_GRID_STYLE = {
	display: 'grid',
	gridTemplateColumns: 'repeat( 3, 1fr )',
	gap: '12px 16px',
};

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
	const headingLevelsHelpId = `dynamic-table-of-contents-heading-levels-help-${ useInstanceId(
		Edit
	) }`;
	const hasNoLevels = ! HEADING_LEVELS.some( ( level ) =>
		isLevelIncluded( attributes, level )
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'dynamic-table-of-contents' ) }
				>
					<fieldset
						aria-describedby={ headingLevelsHelpId }
						style={ { border: 0, margin: '0 0 16px', padding: 0 } }
					>
						<BaseControl.VisualLabel as="legend">
							{ __(
								'Heading levels',
								'dynamic-table-of-contents'
							) }
						</BaseControl.VisualLabel>
						<div style={ HEADING_LEVELS_GRID_STYLE }>
							{ HEADING_LEVELS.map( ( level ) => (
								// Each checkbox gets its own wrapper so the inspector's
								// margin between controls doesn't push rows out of line.
								<div key={ level }>
									<CheckboxControl
										__nextHasNoMarginBottom
										label={ sprintf(
											/* translators: %d: heading level, 1 to 6. */
											__(
												'H%d',
												'dynamic-table-of-contents'
											),
											level
										) }
										checked={ isLevelIncluded(
											attributes,
											level
										) }
										onChange={ ( checked ) =>
											setAttributes( {
												[ `includeH${ level }` ]:
													checked,
											} )
										}
									/>
								</div>
							) ) }
						</div>
						<p
							id={ headingLevelsHelpId }
							className="components-base-control__help"
						>
							{ __(
								'Only headings at the checked levels are listed.',
								'dynamic-table-of-contents'
							) }
						</p>
					</fieldset>
					{ hasNoLevels && (
						<Notice status="warning" isDismissible={ false }>
							{ __(
								'No heading levels are checked, so the table of contents will not show on the site.',
								'dynamic-table-of-contents'
							) }
						</Notice>
					) }
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
				</PanelBody>
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
