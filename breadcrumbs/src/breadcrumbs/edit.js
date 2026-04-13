import { InspectorControls, useBlockProps } from '@wordpress/block-editor'
import { CheckboxControl, PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import './editor.scss'

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {JSX.Element} Element.
 */
export default function Edit(props) {
	const { attributes, setAttributes } = props
	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody
					key={'breadcrumb-settings'}
					title={__('Settings', 'breadcrumbs')}
					initialOpen={true}
				>
					<CheckboxControl
						label={__(
							'Hide single breadcrumb	',
							'breadcrumbs',
						)}
						help={__(
							"Hide the breadcrumb trail when there's only one item (the root/home).",
							'breadcrumbs',
						)}
						checked={attributes.hideSingleBreadcrumb}
						onChange={(value) =>
							setAttributes({ hideSingleBreadcrumb: value })
						}
					/>
					<CheckboxControl
						label={__(
							'Hide home breadcrumb',
							'breadcrumbs',
						)}
						help={__(
							"Hide the breadcrumb for the site's home page.",
							'breadcrumbs',
						)}
						checked={attributes.hideHomeBreadcrumb}
						onChange={(value) =>
							setAttributes({ hideHomeBreadcrumb: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div className='community-breadcrumb'>
				<p className='breadcrumbs'>
					<a
						href='http://audrey.test'
						rel='bookmark'
						className='breadcrumb-item'
					>
						{__('Home', 'breadcrumbs')}
					</a>
					<span className='bp-breadcrumb-sep'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='5'
							height='8'
							viewBox='0 0 5 8'
							fill='none'
						>
							<path
								d='M0.636231 7L3.36351 3.99999L0.63623 1'
								stroke='#767676'
							></path>
						</svg>
					</span>
					<span className='breadcrumb-item current'>
						{__('Group', 'breadcrumbs')}
					</span>
				</p>
			</div>
		</div>
	)
}
