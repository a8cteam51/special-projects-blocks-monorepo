/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	registerBlockVariation,
	getBlockBindingsSources,
} from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { Panel, PanelBody, ToggleControl } from '@wordpress/components';

registerBlockVariation( 'core/heading', {
	name: 'bp-groups-heading',
	title: __( 'Groups Heading', 'bp-groups-blocks' ),
	description: __( 'Display a groups heading', 'bp-groups-blocks' ),
	scope: [ 'inserter', 'transform' ],
	attributes: {
		metadata: {
			bindings: {
				content: {
					source: 'bp-groups/group-heading',
				},
			},
		},
	},
	isActive: [ 'metadata.bindings.content' ],
} );

// Only register the cover image variation if the block bindings source is available.
const isGroupCoverImageEnabled = getBlockBindingsSources()?.hasOwnProperty(
	'bp-groups/group-cover-image'
);

if ( isGroupCoverImageEnabled ) {
	registerBlockVariation( 'core/image', {
		name: 'bp-groups-cover-image',
		title: __( 'Groups Cover Image', 'bp-groups-blocks' ),
		description: __( 'Display a groups cover image', 'bp-groups-blocks' ),
		scope: [ 'inserter', 'transform' ],
		attributes: {
			metadata: {
				bindings: {
					url: {
						source: 'bp-groups/group-cover-image',
					},
				},
			},
		},
		isActive: [ 'metadata.bindings.url' ],
	} );
}

// Only register the avatar variation if the block bindings source is available.
const isGroupAvatarImageEnabled = getBlockBindingsSources()?.hasOwnProperty(
	'bp-groups/group-avatar'
);

if ( isGroupAvatarImageEnabled ) {
	registerBlockVariation( 'core/image', {
		name: 'bp-groups-avatar-image',
		title: __( 'Groups Avatar Image', 'bp-groups-blocks' ),
		description: __( 'Display a groups avatar image', 'bp-groups-blocks' ),
		scope: [ 'inserter', 'transform' ],
		attributes: {
			metadata: {
				bindings: {
					url: {
						source: 'bp-groups/group-avatar',
					},
				},
			},
		},
		isActive: [ 'metadata.bindings.url' ],
	} );
}

registerBlockVariation( 'core/paragraph', {
	name: 'bp-groups-description',
	title: __( 'Groups Description', 'bp-groups-blocks' ),
	description: __( 'Display a groups description', 'bp-groups-blocks' ),
	scope: [ 'inserter', 'transform' ],
	attributes: {
		metadata: {
			bindings: {
				content: {
					source: 'bp-groups/group-description',
				},
			},
		},
	},
	isActive: [ 'metadata.bindings.content' ],
} );

export const withBuddypressGroupAvatarControls = ( BlockEdit ) => ( props ) => {
	if (
		props?.attributes?.metadata?.bindings?.url?.source ===
		'bp-groups/group-cover-image'
	) {
		const { attributes, setAttributes } = props;
		const { metadata, href } = attributes;

		const updateImageLink = ( newValue ) => {
			let newAttributes = { ...attributes };

			if ( newValue ) {
				newAttributes = {
					...newAttributes,
					href: '#',
					linkDestination: 'custom',
					metadata: {
						...newAttributes.metadata,
						bindings: {
							...newAttributes.metadata.bindings,
							href: {
								source: 'bp-groups/group-cover-image',
							},
						},
					},
				};
			} else {
				delete newAttributes.metadata.bindings.href;
				newAttributes.href = undefined;
				delete newAttributes.linkDestination;
			}

			setAttributes( newAttributes );
		};

		return (
			<>
				<BlockEdit key="edit" { ...props } />
				<InspectorControls>
					<Panel>
						<PanelBody
							title={ __(
								'Avatar Settings',
								'bp-groups-blocks'
							) }
						>
							<ToggleControl
								label={ __(
									'Link to Group Page',
									'bp-groups-blocks'
								) }
								checked={ href }
								onChange={ ( newValue ) => {
									updateImageLink( newValue );
								} }
							/>
						</PanelBody>
					</Panel>
				</InspectorControls>
			</>
		);
	} else {
		return <BlockEdit key="edit" { ...props } />;
	}
};

addFilter(
	'editor.BlockEdit',
	'core/image',
	withBuddypressGroupAvatarControls
);
