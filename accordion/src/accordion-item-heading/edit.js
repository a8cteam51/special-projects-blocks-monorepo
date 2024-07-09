import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	BlockControls,
	HeadingLevelDropdown,
	AlignmentControl,
} from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	const { level, title, textAlign, iconPosition } = attributes;
	const TagName = 'h' + level;

	const headingClassName = clsx( {
		'icon-position-left': iconPosition === 'left',
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<>
			<BlockControls>
				<HeadingLevelDropdown
					value={ level }
					onChange={ ( newLevel ) =>
						setAttributes( { level: newLevel } )
					}
				/>
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
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
