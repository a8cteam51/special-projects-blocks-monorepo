import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
	HeadingLevelDropdown,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';

export default function Edit( {
	attributes: { level, title, iconPosition, templateLock },
	setAttributes,
} ) {
	// const { openByDefault, level, title, iconPosition } = attributes;
	const TagName = 'h' + level;

	const headingClassName = clsx( {
		'wpsp-accordion-item__heading': true,
		'icon-position-left': iconPosition === 'left',
	} );

	const blockProps = useBlockProps( {
		className: headingClassName,
	} );
	console.log( blockProps );

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
				{ ...useBlockProps( {
					className: headingClassName,
				} ) }
			>
				<button className="wpsp-accordion-item__toggle">
					<RichText
						disableLineBreaks
						tagName="span"
						value={ title }
						onChange={ ( newTitle ) =>
							setAttributes( { title: newTitle } )
						}
						placeholder={ __( 'Add text...' ) }
					/>
				</button>
			</TagName>
		</>
	);
}
