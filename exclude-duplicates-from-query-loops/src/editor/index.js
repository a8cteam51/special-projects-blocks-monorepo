import { PanelBody, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

const withInspectorControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { attributes, setAttributes } = props;

		if ( props.name !== 'core/query' ) {
			return <BlockEdit { ...props } />;
		}

		const { query } = attributes;

		const handleChange = ( active ) =>
			setAttributes( {
				query: {
					...query,
					//to update the query inside the editor
					exclude_previous_posts: active,
				},
			} );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __(
							'Exclude Duplicate Posts',
							'a8csp-exclude-duplicates'
						) }
						initialOpen={ !! query.exclude_previous_posts }
					>
						<div
							style={ {
								display: 'flex',
								flexDirection: 'column',
								gap: '1rem',
							} }
						>
							<ToggleControl
								label={ __(
									'Exclude Duplicate Posts',
									'a8csp-exclude-duplicates'
								) }
								help={ __(
									'Excludes duplicate posts from queries that appear before this query loop. Overwrites offset to 0.',
									'a8csp-exclude-duplicates'
								) }
								checked={ !! query.exclude_previous_posts }
								onChange={ ( checked ) =>
									handleChange( checked )
								}
							/>
						</div>
					</PanelBody>
				</InspectorControls>
			</>
		);
	},
	'withInspectorControl'
);

addFilter(
	'editor.BlockEdit',
	'a8csp/exclude-duplicates-from-query-loops',
	withInspectorControls
);
