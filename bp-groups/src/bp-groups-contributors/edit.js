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
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';

import {
	TextControl,
	RangeControl,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

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
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Props passed from the editor.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		perPage,
		countText,
		allMembersText,
		avatarSize,
		showAvatars,
		showMemberCount,
		memberLink,
	} = attributes;

	const avatars = perPage ? [ ...Array( perPage ).keys() ] : [];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'bp-groups-blocks' ) }>
					<h3>{ __( 'Avatar Settings', 'bp-groups-blocks' ) }</h3>
					<ToggleControl
						label={ __( 'Show avatars', 'bp-groups-blocks' ) }
						checked={ showAvatars }
						onChange={ ( value ) =>
							setAttributes( { showAvatars: value } )
						}
					/>
					{ showAvatars && (
						<>
							<TextControl
								label={ __(
									'Contributors per page',
									'bp-groups-blocks'
								) }
								type="number"
								value={ perPage }
								onChange={ ( value ) =>
									setAttributes( {
										perPage: parseInt( value ),
									} )
								}
								help={ __(
									'Number of contributors to display before the show more button appears.',
									'bp-groups-blocks'
								) }
							/>
							<RangeControl
								label={ __(
									'Avatar Size',
									'bp-groups-blocks'
								) }
								value={ avatarSize }
								onChange={ ( value ) =>
									setAttributes( { avatarSize: value } )
								}
								min={ 10 }
								max={ 150 }
							/>
							<ToggleControl
								label={ __(
									'Show member link',
									'bp-groups-blocks'
								) }
								checked={ memberLink }
								onChange={ ( value ) =>
									setAttributes( { memberLink: value } )
								}
								help={ __(
									'If enabled, clicking on a contributor avatar will take the user to their profile page.',
									'bp-groups-blocks'
								) }
							/>
						</>
					) }
					<h3>{ __( 'Member Count', 'bp-groups-blocks' ) }</h3>
					<ToggleControl
						label={ __( 'Show member count', 'bp-groups-blocks' ) }
						checked={ showMemberCount }
						onChange={ ( value ) =>
							setAttributes( { showMemberCount: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<p>
					{ `${
						perPage && showMemberCount ? perPage * 2 + ' ' : ''
					}` }
					<RichText
						tagName="span"
						value={ countText }
						onChange={ ( value ) =>
							setAttributes( { countText: value } )
						}
						placeholder={ __(
							'Contributors count text',
							'bp-groups-blocks'
						) }
					/>
					{ showAvatars && (
						<RichText
							tagName="button"
							value={ allMembersText }
							onChange={ ( value ) =>
								setAttributes( { allMembersText: value } )
							}
							placeholder={ __(
								'All members text',
								'bp-groups-blocks'
							) }
							className="bp-groups-contributors__view-all"
						/>
					) }
				</p>
				{ showAvatars && (
					<ul className="bp-groups-contributors__avatars">
						{ avatars.map( ( _, index ) => (
							<li
								key={ index }
								className="bp-groups-contributors__avatar"
								style={ {
									backgroundColor: '#ccc',
									width: avatarSize,
									height: avatarSize,
								} }
							></li>
						) ) }
					</ul>
				) }
			</div>
		</>
	);
}
