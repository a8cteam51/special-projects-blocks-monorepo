/**
 * Plain-text view of a core/image caption, for the Photo Caption panel. A
 * caption is a RichTextData when parsed from a saved post and an HTML string
 * when set by a picker; create( { html } ) takes both.
 */
import { create, getTextContent, RichTextData } from '@wordpress/rich-text';

// Core's RichText.isEmpty: an empty RichTextData is truthy, so test length.
export const isCaptionEmpty = ( caption ) => ! caption?.length;

// getTextContent() strips only the first object-replacement character.
const OBJECT_REPLACEMENT = /\uFFFC/g;

/**
 * @param {RichTextData|string|undefined} caption The stored caption.
 *
 * @return {string} The caption as text, line breaks as newlines.
 */
export function captionToText( caption ) {
	if ( isCaptionEmpty( caption ) ) {
		return '';
	}

	return getTextContent( create( { html: caption } ) ).replace(
		OBJECT_REPLACEMENT,
		''
	);
}

/**
 * Whether turning the caption into text would lose anything: bold, links,
 * code, spans and the like. A line break is text, not a format.
 *
 * @param {RichTextData|string|undefined} caption The stored caption.
 *
 * @return {boolean} True if the caption carries formatting.
 */
export function captionHasFormatting( caption ) {
	if ( isCaptionEmpty( caption ) ) {
		return false;
	}

	const { formats, replacements } = create( { html: caption } );

	return formats.some( Boolean ) || replacements.some( Boolean );
}

/**
 * Text back to a caption value. Blank text clears the caption, so no empty
 * figcaption is saved. Never trims otherwise, which would eat typed spaces.
 *
 * RichTextData, not a string: RichText.Content writes a string raw, so "&" and
 * "<" would be saved unescaped.
 *
 * @param {string} text The typed text.
 *
 * @return {RichTextData|undefined} The caption, or undefined to clear it.
 */
export function textToCaption( text ) {
	return text.trim() === '' ? undefined : RichTextData.fromPlainText( text );
}
