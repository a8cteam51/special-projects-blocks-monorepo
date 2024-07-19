import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	RichText,
} from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { level, title, iconPosition } = attributes;
	const TagName = 'h' + level;

	const blockProps = useBlockProps.save();
	const borderProps = getBorderClassesAndStyles( attributes );
	const colorProps = getColorClassesAndStyles( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );
	const shadowProps = getShadowClassesAndStyles( attributes );
	const buttonClassName = clsx(
		`wpsp-accordion-item__toggle`,
		colorProps.className,
		borderProps.className
	);
	const buttonStyle = {
		...borderProps.style,
		...colorProps.style,
		...spacingProps.style,
		...shadowProps.style,
	};

	return (
		<TagName
			{ ...blockProps }
			className={ clsx(
				blockProps.className,
				'wpsp-accordion-item__heading',
				{
					[ `has-custom-font-size` ]: blockProps?.style?.fontSize,
					[ `icon-position-left` ]: iconPosition === 'left',
				}
			) }
			style={ {} }
		>
			<button className={ buttonClassName } style={ buttonStyle }>
				<RichText.Content tagName="span" value={ title } />
			</button>
		</TagName>
	);
}
