import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
} from '@wordpress/block-editor';
import clsx from 'clsx';

export default function Edit( { attributes } ) {
	const { allowedBlocks, templateLock } = attributes;
	const blockProps = useBlockProps();
	const borderProps = useBorderProps( attributes );
	const colorProps = useColorProps( attributes );
	const spacingProps = useSpacingProps( attributes );
	const shadowProps = useShadowProps( attributes );

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
				<InnerBlocks
					allowedBlocks={ allowedBlocks }
					template={ [
						[
							'core/paragraph',
							{
								placeholder:
									'Accordion item content goes here.',
							},
						],
					] }
					templateLock={ templateLock }
				/>
			</div>
		</div>
	);
}
