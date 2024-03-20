import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

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
	);
}
