/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

import { PanelBody, TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getIcon } from './helpers';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const { name, label } = attributes;

	const Icon = getIcon( name, context.iconset );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'reactions' ) }>
					<TextControl
						label={ __( 'Text', 'reactions' ) }
						help={ __(
							'The text is only visible when enabled from the parent Reactions block.',
							'reactions'
						) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<li { ...useBlockProps() }>
				<button aria-label={ name }>
					<span className="wp-block-wpcomsp-reaction__icon">
						{ Icon }
					</span>
					{ label && context.showLabels && (
						<span className="wp-block-wpcomsp-reaction__text">
							{ label }
						</span>
					) }
					{ context.showCounts && (
						<span className="wp-block-wpcomsp-reaction__count">
							0
						</span>
					) }
				</button>
			</li>
		</>
	);
}
