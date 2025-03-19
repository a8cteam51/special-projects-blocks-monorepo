/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import {__} from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {useBlockProps, InspectorControls} from '@wordpress/block-editor';
import { PanelBody, ColorPalette } from '@wordpress/components';
import {CSSVars} from "./save";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Settings', 'a8csp')}>
					<p>{__('Background Color', 'a8csp')}</p>
					<ColorPalette
						value={attributes.backgroundColor}
						onChange={(color) => setAttributes({backgroundColor: color})}
					/>
					<p>{__('Progress Bar Color', 'a8csp')}</p>
					<ColorPalette
						value={attributes.progressBarColor}
						onChange={(color) => setAttributes({progressBarColor: color})}
					/>
				</PanelBody>
			</InspectorControls>
			<CSSVars attributes={attributes} />
			<progress value={0.5}></progress>
		</div>
	);
}
