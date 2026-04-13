/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	registerBlockVariation,
	getBlockBindingsSources,
} from '@wordpress/blocks';

registerBlockVariation( 'core/heading', {
	name: 'bp-groups-heading',
	title: __( 'Groups Heading', 'bp-groups' ),
	description: __( 'Display a groups heading', 'bp-groups' ),
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
		title: __( 'Groups Cover Image', 'bp-groups' ),
		description: __( 'Display a groups cover image', 'bp-groups' ),
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
		title: __( 'Groups Avatar Image', 'bp-groups' ),
		description: __( 'Display a groups avatar image', 'bp-groups' ),
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
	title: __( 'Groups Description', 'bp-groups' ),
	description: __( 'Display a groups description', 'bp-groups' ),
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
