/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { ComboboxControl, PanelBody, TextControl } from '@wordpress/components';

import { useEntityRecords } from '@wordpress/core-data';

/**
 * Internal dependancies
 */
import './editor.scss';

/**
 * The edit function.
 * @param {Object} props The props.
 *
 * @return {JSX.Element} Element to render.
 */
export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { label, menuSlug } = attributes;

	// Fetch all template parts.
	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{ per_page: -1 }
	);

	let menuOptions = [];

	// Filter the template parts for those in the 'menu' area.
	if ( hasResolved ) {
		menuOptions = records
			.filter( ( item ) => item.area === 'menu' )
			.map( ( item ) => ( {
				label: item.title.rendered, // Title of the template part.
				value: item.slug, // Template part slug.
			} ) );
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'mega-menu' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Label', 'mega-menu' ) }
						type="text"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						autoComplete="off"
					/>
					{
						menuOptions.length === 0 ? (
							<p>
								{ __(
									'No menu templates found. Please create a menu template part with the category of "Menu".',
									'mega-menu'
								) }
							</p>
						) : (
							<ComboboxControl
								label={ __( 'Menu Template', 'mega-menu' ) }
								value={ menuSlug }
								options={ menuOptions }
								onChange={ ( slugValue ) =>
									setAttributes( { menuSlug: slugValue } )
								}
							/>
						)
					}
					
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<button className="wp-block-navigation-item__content">
					<RichText
						identifier="label"
						className="wp-block-navigation-item__label"
						value={ label }
						onChange={ ( labelValue ) =>
							setAttributes( {
								label: labelValue,
							} )
						}
						aria-label={ __(
							'Mega menu link text',
							'mega-menu'
						) }
						placeholder={ __(
							'Add label…',
							'mega-menu'
						) }
						allowedFormats={ [] }
					/>
				</button>
			</div>
		</>
	);
}
