/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n'

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
} from '@wordpress/block-editor'

import {
	CheckboxControl,
	RadioControl,
	TextControl,
	ToggleControl,
	RangeControl,
	PanelBody,
} from '@wordpress/components'

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss'

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { perPage, countText, allMembersText, avatarSize } = attributes
	const avatars = perPage ? [...Array(perPage).keys()] : []
	console.log(avatars)
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'bp-groups-contributors')}>
					<TextControl
						label={__(
							'Contributors per page',
							'bp-groups-contributors',
						)}
						type='number'
						value={perPage}
						onChange={(value) =>
							setAttributes({ perPage: parseInt(value) })
						}
						help={__(
							'Number of contributors to display before the show more button appears.',
							'bp-groups-contributors',
						)}
					/>
					<RangeControl
						label={__('Avatar Size', 'bp-groups-contributors')}
						value={avatarSize}
						onChange={(value) =>
							setAttributes({ avatarSize: value })
						}
						min={10}
						max={150}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				<p>
					{`${perPage ? perPage * 2 : 0}`}
					&nbsp;
					<RichText
						tagName='span'
						value={countText}
						onChange={(value) =>
							setAttributes({ countText: value })
						}
						placeholder={__(
							'Contributors count text',
							'bp-groups-contributors',
						)}
					/>
					&nbsp;
					<RichText
						tagName='button'
						value={allMembersText}
						onChange={(value) =>
							setAttributes({ allMembersText: value })
						}
						placeholder={__(
							'All members text',
							'bp-groups-contributors',
						)}
						className='bp-groups-contributors__view-all'
					/>
				</p>
				<ul className='bp-groups-contributors__avatars'>
					{avatars.map((_, index) => (
						<li
							key={index}
							className='bp-groups-contributors__avatar'
							style={{
								backgroundColor: '#ccc',
								width: avatarSize,
								height: avatarSize,
							}}
						></li>
					))}
				</ul>
			</div>
		</>
	)
}
