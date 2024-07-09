import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import clsx from 'clsx';

export default function save( { attributes } ) {
	const { title, textAlign, level, iconPosition } = attributes;
	const TagName = 'h' + level;

	const className = clsx( {
		'icon-position-left': iconPosition === 'left',
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<TagName
			{ ...useBlockProps.save( {
				className: className,
			} ) }
		>
			<button className="wpsp-accordion-item__toggle">
				<RichText.Content tagName="span" value={ title } />
			</button>
		</TagName>
	);
}
