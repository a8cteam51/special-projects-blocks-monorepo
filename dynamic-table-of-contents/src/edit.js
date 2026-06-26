import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'dynamic-table-of-contents')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Include headings nested in other blocks', 'dynamic-table-of-contents')}
						help={__(
							'List headings that come from wrapper blocks such as accordions, which split their title across extra elements. These headings have no anchor of their own, so one is generated from the heading text on the frontend.',
							'dynamic-table-of-contents'
						)}
						checked={!!attributes.includeNestedHeadings}
						onChange={(includeNestedHeadings) =>
							setAttributes({ includeNestedHeadings })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				<RichText
					tagName="h2"
					placeholder={__('Table of Contents Title', 'dynamic-table-of-contents')}
					value={attributes.title}
					onChange={(title) => setAttributes({ title })}
					className="table-of-contents-title"
				/>
				<ul className="table-of-contents-list">
					<li className="table-of-contents-list-item">
						<a href="#" className='active'>This is an example.</a>
					</li>
					<li className="table-of-contents-list-item">
						<a href="#">Of the block appearance.</a>
					</li>
					<li className="table-of-contents-list-item">
						<a href="#">When used in your post.</a>
					</li>
				</ul>
			</div>
		</>
	);
}
