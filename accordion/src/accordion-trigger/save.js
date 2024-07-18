import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { level, title, iconPosition } = attributes;
	const TagName = 'h' + level;

	const headingClassName = clsx( {
		'wpsp-accordion-item__heading': true,
		'icon-position-left': iconPosition === 'left',
	} );

	return (
		<TagName { ...useBlockProps.save( { className: headingClassName } ) }>
			<button className="wpsp-accordion-item__toggle">
				<RichText.Content tagName="span" value={ title } />
			</button>
		</TagName>
	);
}
