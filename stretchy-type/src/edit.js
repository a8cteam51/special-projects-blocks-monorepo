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
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { useRef, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes }) {
	const { content } = attributes;

	const ref = useRef();

	useEffect( () => {
		const width = 200;
		const characters = content.length;
		const size = width / characters;
		
		// Set the font size of the reference element
		ref.current.style.fontSize = `${ size }vw`;
	}, [ content ] );

	const onChange = ( nextContent ) => {
		setAttributes( { content: nextContent } );
		const width = 100;
		const characters = nextContent.length;
		const size = width / characters;
		
		// Set the font size of the reference element
		ref.current.style.fontSize = `${ size }vw`;
	}

	return (
		<RichText tagName="pre"
			{ ...useBlockProps() }
			ref={ ref }
			allowedFormats={ [] }
			disableLineBreaks
			identifier="content"
			placeholder="Stretchy text goes here"
			preserveWhiteSpace
			value={ content }
			onChange={ onChange }
			/>
	);
}
