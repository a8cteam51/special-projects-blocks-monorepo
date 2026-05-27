import { useBlockProps, RichText } from '@wordpress/block-editor';

// Save as a <div>, not a <td>: orphan <td> elements (outside a <table>) get
// stripped by HTML parsers during block re-validation, blanking out `content`.
// render.php promotes the <div> to <td>/<th> when assembling the table.
export default function save( { attributes } ) {
	const { content } = attributes;

	return (
		<RichText.Content
			tagName="div"
			{ ...useBlockProps.save() }
			value={ content }
		/>
	);
}
