import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
	BlockControls,
	HeadingLevelDropdown,
	RichText,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { level, title, iconPosition, textAlign } = attributes;
	const TagName = 'h' + level;

	const blockProps = useBlockProps();
	const borderProps = useBorderProps( attributes );
	const colorProps = useColorProps( attributes );
	const spacingProps = useSpacingProps( attributes );
	const shadowProps = useShadowProps( attributes );

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<HeadingLevelDropdown
						value={ level }
						onChange={ ( newLevel ) =>
							setAttributes( { level: newLevel } )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			<TagName
				{ ...blockProps }
				className={ clsx(
					blockProps.className,
					colorProps.className,
					borderProps.className,
					'wpsp-accordion-item__heading',
					{
						[ `has-custom-font-size` ]: blockProps.style.fontSize,
						[ `icon-position-left` ]: iconPosition === 'left',
						[ `has-text-align-${ textAlign }` ]: textAlign,
					}
				) }
				style={ {
					...borderProps.style,
					...colorProps.style,
					...shadowProps.style,
				} }
			>
				<button
					className={ clsx(
						'wpsp-accordion-item__toggle',
					) }
					style={ {
						...spacingProps.style,
					} }
				>
					<RichText
						disableLineBreaks
						tagName="span"
						value={ title }
						onChange={ ( newTitle ) =>
							setAttributes( { title: newTitle } )
						}
						placeholder={ __( 'Add text...' ) }
					/>
					<span className={`wpsp-accordion-item__toggle-icon`} style={{
						// TO-DO: make this configurable
						width: `1em`,
						height: `1em`,
					}}/>
				</button>
			</TagName>
		</>
	);
}
