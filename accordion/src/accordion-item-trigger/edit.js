import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	BlockControls,
	HeadingLevelDropdown,
} from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	const { level, title, iconPosition } = attributes;
	const TagName = 'h' + level;

	const headingClassName = clsx( {
		'icon-position-left': iconPosition === 'left',
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
