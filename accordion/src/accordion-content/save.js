import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
} from '@wordpress/block-editor';
import clsx from 'clsx';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	const borderProps = getBorderClassesAndStyles( attributes );
	const colorProps = getColorClassesAndStyles( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );
	const shadowProps = getShadowClassesAndStyles( attributes );

	return (
		<div
			{ ...blockProps }
			className={ clsx(
				blockProps.className,
				colorProps.className,
				borderProps.className,
				{
					[ `has-custom-font-size` ]: blockProps?.style?.fontSize,
				}
			) }
			style={ {
				...borderProps.style,
				...colorProps.style,
				...shadowProps.style,
			} }
		>
			<div
				className="wpsp-accordion-content__wrapper"
				style={ {
					...spacingProps.style,
				} }
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
