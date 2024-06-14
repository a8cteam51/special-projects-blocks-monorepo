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
	AlignmentControl,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow } from '@wordpress/components';

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
	const { level, title, textAlign } = attributes;
	const tagName = 'h' + level;

	return (
		<>
		<InspectorControls key="setting">
			<PanelBody title={ __( 'Settings' ) }>
				<PanelRow></PanelRow>
			</PanelBody>
			</InspectorControls>
		<BlockControls>
			<HeadingLevelDropdown
				value={ level }
				onChange={ ( newLevel ) => setAttributes( { level: newLevel } ) }
			/>
			<AlignmentControl
				value={ textAlign }
				onChange={ ( nextAlign ) => {
					setAttributes( { textAlign: nextAlign } );
				} }
			/>
		</BlockControls>
		<div { ...useBlockProps() }>
			<RichText
				className={ `has-text-align-${ textAlign }` }
				identifier={ 'title' }
				tagName={ tagName }
				value={ title }
				onChange={ ( newTitle ) => setAttributes( { title: newTitle } ) }
				placeholder={ __( 'Add text...' ) }
			/>
			<div className="inner">
				<InnerBlocks
					renderAppender={ InnerBlocks.ButtonBlockAppender }
				/>
			</div>
		</div>
	</>
	);
}
