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
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import {
	Panel,
	PanelBody,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

registerBlockVariation( 'core/heading', {
	name: 'bp-members-heading',
	title: __( 'Members Heading', 'bp-members-blocks' ),
	description: __( 'Display a members heading', 'bp-members-blocks' ),
	scope: [ 'inserter', 'transform' ],
	attributes: {
		metadata: {
			bindings: {
				content: {
					source: 'bp-members/member-heading',
				},
			},
		},
	},
	isActive: [ 'metadata.bindings.content' ],
} );

const isMemberAvatarEnabled = getBlockBindingsSources()?.hasOwnProperty(
	'bp-members/member-avatar'
);

if ( isMemberAvatarEnabled ) {
	registerBlockVariation( 'core/image', {
		name: 'bp-members-avatar',
		title: __( 'Members Avatar', 'bp-members-blocks' ),
		description: __( 'Display a members avatar', 'bp-members-blocks' ),
		scope: [ 'inserter', 'transform' ],
		attributes: {
			metadata: {
				bindings: {
					url: {
						source: 'bp-members/member-avatar',
					},
				},
			},
		},
		isActive: [ 'metadata.bindings.url' ],
	} );
}

const isMemberCoverImageEnabled = getBlockBindingsSources()?.hasOwnProperty(
	'bp-members/member-cover-image'
);

if ( isMemberCoverImageEnabled ) {
	registerBlockVariation( 'core/image', {
		name: 'bp-members-cover-image',
		title: __( 'Members Cover Image', 'bp-members-blocks' ),
		description: __( 'Display a members cover image', 'bp-members-blocks' ),
		scope: [ 'inserter', 'transform' ],
		attributes: {
			metadata: {
				bindings: {
					url: {
						source: 'bp-members/member-cover-image',
					},
				},
			},
		},
		isActive: [ 'metadata.bindings.url' ],
	} );
}

registerBlockVariation( 'core/paragraph', {
	name: 'bp-members-x-profile',
	title: __( 'Members X Profile', 'bp-members-blocks' ),
	description: __( 'Display members X Profile field', 'bp-members-blocks' ),
	scope: [ 'inserter', 'transform' ],
	attributes: {
		metadata: {
			bindings: {
				content: {
					source: 'bp-members/member-x-profile',
				},
			},
		},
	},
	isActive: [ 'metadata.bindings.content' ],
} );

export const withBuddypressXProfileControls = ( BlockEdit ) => ( props ) => {
	if (
		props?.attributes?.metadata?.bindings?.content?.source ===
		'bp-members/member-x-profile'
	) {
		const { attributes, setAttributes } = props;
		const { metadata } = attributes;
		const [ fields, setFields ] = useState();
		useEffect( () => {
			// Fetch the list of x-profile fields to populate the dropdown.
			apiFetch( { path: '/buddypress/v1/xprofile/fields' } ).then(
				( data ) => {
					const fieldData = data.map( ( field ) => ( {
						label: field.name,
						value: field.name,
					} ) );

					fieldData.unshift( {
						label: __( 'Select a field', 'bp-members-blocks' ),
						value: '',
					} );

					setFields( fieldData );
				}
			);
		}, [] );

		const updateAttributes = ( fieldId ) => {
			setAttributes( {
				metadata: {
					bindings: {
						content: {
							source: 'bp-members/member-x-profile',
							args: {
								field_id: fieldId,
							},
						},
					},
				},
			} );
		};
		return (
			<>
				<BlockEdit key="edit" { ...props } />
				<InspectorControls>
					<Panel>
						<PanelBody
							title={ __(
								'X Profile Fields',
								'bp-members-blocks'
							) }
						>
							<SelectControl
								label={ __(
									'Select X Profile Field',
									'bp-members-blocks'
								) }
								value={
									metadata?.bindings?.content?.args
										?.field_id || ''
								}
								options={ fields }
								onChange={ updateAttributes }
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
	'core/paragraph',
	withBuddypressXProfileControls
);

export const withBuddypressAvatarControls = ( BlockEdit ) => ( props ) => {
	if (
		props?.attributes?.metadata?.bindings?.url?.source ===
		'bp-members/member-avatar'
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
								source: 'bp-members/member-avatar',
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
								'bp-members-blocks'
							) }
						>
							<ToggleControl
								label={ __(
									'Link to Member Profile',
									'bp-members-blocks'
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

addFilter( 'editor.BlockEdit', 'core/image', withBuddypressAvatarControls );
