import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { title, textAlign, level, iconPosition } = attributes;
	const TagName = 'h' + level;

	const className = clsx( {
		'wpsp-accordion-item__title': true,
		'icon-position-left': iconPosition === 'left',
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<>
			<TagName className={ className } { ...useBlockProps.save() }>
				<button className="wpsp-accordion-item__toggle">
					<RichText.Content tagName="span" value={ title } />
				</button>
			</TagName>
			<div className="wpsp-accordion-item__content">
				<InnerBlocks.Content />
			</div>
		</>
	);
}
