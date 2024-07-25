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
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToolbarGroup,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import {
	caret,
	chevron,
	chevronRight,
	circlePlus,
	plus,
} from '../accordion-item/icons';

const ICONS = {
	plus,
	circlePlus,
	chevron,
	chevronRight,
	caret,
};

export default function Edit( { attributes, setAttributes } ) {
	const { level, title, textAlign, icon, iconPosition } = attributes;
	const TagName = 'h' + level;

	const blockProps = useBlockProps();
	const borderProps = useBorderProps( attributes );
	const colorProps = useColorProps( attributes );
	const spacingProps = useSpacingProps( attributes );
	const shadowProps = useShadowProps( attributes );

	const Icon = ICONS[ icon ];

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
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Settings' ) }>
					<ToggleGroupControl
						isBlock
						label={ __( 'Icon' ) }
						value={ icon }
						onChange={ ( value ) =>
							setAttributes( { icon: value } )
						}
					>
						<ToggleGroupControlOptionIcon
							label=""
							icon={ false }
							value={ false }
						/>
						<ToggleGroupControlOptionIcon
							label="plus"
							icon={ plus }
							value="plus"
						/>
						<ToggleGroupControlOptionIcon
							label="chevron"
							icon={ chevron }
							value="chevron"
						/>
						<ToggleGroupControlOptionIcon
							label="circle-plus"
							icon={ circlePlus }
							value="circlePlus"
						/>
						<ToggleGroupControlOptionIcon
							label="caret-down"
							icon={ caret }
							value="caret"
						/>
						<ToggleGroupControlOptionIcon
							label="chevron-right"
							icon={ chevronRight }
							value="chevronRight"
						/>
					</ToggleGroupControl>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						isBlock
						label={ __( 'Icon Position' ) }
						value={ iconPosition }
						onChange={ ( value ) => {
							setAttributes( { iconPosition: value } );
						} }
					>
						<ToggleGroupControlOption label="Left" value="left" />
						<ToggleGroupControlOption label="Right" value="right" />
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>
			<TagName
				{ ...blockProps }
				className={ clsx(
					blockProps.className,
					colorProps.className,
					borderProps.className,
					'wpcomsp-accordion-item__heading',
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
					className={ clsx( 'wpcomsp-accordion-item__toggle' ) }
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
					<span
						className={ clsx(
							`wpcomsp-accordion-item__toggle-icon`,
							{
								[ `has-icon-${ icon }` ]: icon,
							}
						) }
						style={ {
							// TO-DO: make this configurable
							width: `1.2em`,
							height: `1.2em`,
						} }
					>
						{ Icon && (
							<Icon width={ `1.2em` } height={ `1.2em` } />
						) }
					</span>
				</button>
			</TagName>
		</>
	);
}
