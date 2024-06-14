/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/
 */
import {
	RichText,
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	HeadingLevelDropdown,
} from '@wordpress/block-editor';
import { TextControl, PanelBody, PanelRow } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes, isSelected } ) {
	const { level, buttonText } = attributes;
	const onChange = ( value ) => {
		setAttributes( { buttonText: value } );
	};

	const tagName = 'h' + level;

	return (
		<div { ...useBlockProps() } className="wpsp-accordion-block">
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Accordion Settings' ) }>
					<PanelRow></PanelRow>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<HeadingLevelDropdown
					value={ level }
					onChange={ ( newLevel ) => setAttributes( { level: newLevel } ) }
				/>
			</BlockControls>
			<RichText
				tagName={ tagName }
				value={ attributes.buttonText }
				onChange={ onChange }
				placeholder={ __( 'Add text...' ) }
			/>
			<div className="inner">
				<InnerBlocks
					renderAppender={ InnerBlocks.ButtonBlockAppender }
				/>
			</div>
		</div>
	);
}
