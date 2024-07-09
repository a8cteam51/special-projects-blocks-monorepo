import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { title, textAlign, level, iconPosition } = attributes;
	const TagName = 'h' + level;

	const className = clsx( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	const blockProps = useBlockProps.save( {
		className: className,
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
