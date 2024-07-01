import clsx from 'clsx';
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 * @return {WPElement} Element to render.
 */
export default function save( { attributes } ) {
	const { title, textAlign, level, iconPosition } = attributes;
	const TagName = 'h' + level;

	const className = clsx( {
		'wpsp-accordion-item__title': true,
		'icon-position-left': iconPosition === 'left',
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<div { ...useBlockProps.save() }>
			<TagName className={ className }>
				<button className="wpsp-accordion-item__toggle">
					<RichText.Content tagName="span" value={ title } />
				</button>
			</TagName>
			<div className="wpsp-accordion-item__content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
