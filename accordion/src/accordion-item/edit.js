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
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { openByDefault, level, title, iconPosition } = attributes;
	const TagName = 'h' + level;

	const headingClassName = clsx( {
		'wpsp-accordion-item__heading': true,
		'icon-position-left': iconPosition === 'left',
	} );

	const innerBlocksProps = useInnerBlocksProps( 
		{ className: 'wpsp-accordion-item__content' }
	);

	return (
		<>
			<BlockControls>
				<HeadingLevelDropdown
					value={ level }
					onChange={ ( newLevel ) =>
						setAttributes( { level: newLevel } )
					}
				/>
			</BlockControls>
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Display' ) }>
					<PanelRow>
						<ToggleControl
							label={ __( 'Open by default' ) }
							onChange={ ( value ) => {
								setAttributes( {
									openByDefault: value,
								} );
							} }
							checked={ openByDefault }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<TagName className={ headingClassName }>
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
				<div { ...innerBlocksProps} />
			</div>
		</>
	);
}
