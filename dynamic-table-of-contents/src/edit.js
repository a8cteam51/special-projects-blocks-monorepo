import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   root0               The component props.
 * @param {Object}   root0.attributes    The block attributes.
 * @param {Function} root0.setAttributes Function to update block attributes.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		includeH1,
		includeH2,
		includeH3,
		includeH4,
		includeH5,
		includeH6,
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Heading Levels',
						'dynamic-table-of-contents'
					) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __(
							'Include H1 headings',
							'dynamic-table-of-contents'
						) }
						checked={ includeH1 }
						onChange={ ( newIncludeH1 ) =>
							setAttributes( { includeH1: newIncludeH1 } )
						}
					/>
					<ToggleControl
						label={ __(
							'Include H2 headings',
							'dynamic-table-of-contents'
						) }
						checked={ includeH2 }
						onChange={ ( newIncludeH2 ) =>
							setAttributes( { includeH2: newIncludeH2 } )
						}
					/>
					<ToggleControl
						label={ __(
							'Include H3 headings',
							'dynamic-table-of-contents'
						) }
						checked={ includeH3 }
						onChange={ ( newIncludeH3 ) =>
							setAttributes( { includeH3: newIncludeH3 } )
						}
					/>
					<ToggleControl
						label={ __(
							'Include H4 headings',
							'dynamic-table-of-contents'
						) }
						checked={ includeH4 }
						onChange={ ( newIncludeH4 ) =>
							setAttributes( { includeH4: newIncludeH4 } )
						}
					/>
					<ToggleControl
						label={ __(
							'Include H5 headings',
							'dynamic-table-of-contents'
						) }
						checked={ includeH5 }
						onChange={ ( newIncludeH5 ) =>
							setAttributes( { includeH5: newIncludeH5 } )
						}
					/>
					<ToggleControl
						label={ __(
							'Include H6 headings',
							'dynamic-table-of-contents'
						) }
						checked={ includeH6 }
						onChange={ ( newIncludeH6 ) =>
							setAttributes( { includeH6: newIncludeH6 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<RichText
					tagName="h2"
					placeholder={ __(
						'Table of Contents Title',
						'dynamic-table-of-contents'
					) }
					value={ title }
					onChange={ ( newTitle ) =>
						setAttributes( { title: newTitle } )
					}
					className="table-of-contents-title"
				/>
				<ul className="table-of-contents-list">
					<li className="table-of-contents-list-item">
						{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid -- Not a valid link, just preview. */ }
						<a href="#" className="active">
							This is an example.
						</a>
					</li>
					<li className="table-of-contents-list-item">
						{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid -- Not a valid link, just preview. */ }
						<a href="#">Of the block appearance.</a>
					</li>
					<li className="table-of-contents-list-item">
						{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid -- Not a valid link, just preview. */ }
						<a href="#">When used in your post.</a>
					</li>
				</ul>
			</div>
		</>
	);
}
