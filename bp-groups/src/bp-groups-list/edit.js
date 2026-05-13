/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __, _x } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	useInnerBlocksProps,
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	store as blockEditorStore,
} from '@wordpress/block-editor';

import apiFetch from '@wordpress/api-fetch';
import { useDispatch, useSelect } from '@wordpress/data';

import { useEffect, useState, memo } from '@wordpress/element';

import {
	ToolbarGroup,
	SelectControl,
	PanelBody,
	RangeControl,
} from '@wordpress/components';

import { list, grid } from '@wordpress/icons';

import { addQueryArgs } from '@wordpress/url';

const TEMPLATE = [
	[
		'core/image',
		{
			aspectRatio: '3/2',
			scale: 'cover',
			metadata: {
				bindings: {
					url: {
						source: 'bp-groups/group-cover-image',
					},
				},
			},
		},
	],
	[
		'core/heading',
		{
			metadata: {
				bindings: {
					content: {
						source: 'bp-groups/group-heading',
					},
				},
			},
		},
	],
	[
		'core/paragraph',
		{
			metadata: {
				bindings: {
					content: {
						source: 'bp-groups/group-description',
					},
				},
			},
		},
	],
];

function PostTemplateInnerBlocks( { classList } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx( 'a8csp-bp-group', classList ) },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <li { ...innerBlocksProps } />;
}

function PostTemplateBlockPreview( { blocks, classList, isHidden } ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: clsx( 'a8csp-bp-group', classList ),
		},
	} );

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return <li { ...blockPreviewProps } tabIndex={ 0 } style={ style } />;
}

const MemoizedPostTemplateBlockPreview = memo( PostTemplateBlockPreview );

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object} props Props passed from the editor.
 *
 * @return {Element} Element to render.
 */
export default function Edit( props ) {
	const {
		attributes,
		setAttributes,
		layout,
		clientId,
		__unstableLayoutClassNames,
	} = props;
	const { groupType, groupOrder, perPage } = attributes;
	const { type: layoutType, columnCount = 3 } = layout || {};

	const blockProps = useBlockProps( {
		className: clsx( __unstableLayoutClassNames, {
			[ `columns-${ columnCount }` ]:
				layoutType === 'grid' && columnCount,
		} ),
	} );

	const { blocks } = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			return {
				blocks: getBlocks( clientId ),
			};
		},
		[ clientId ]
	);

	const [ groupTypes, setGroupTypes ] = useState( [] );
	const [ blockContexts, setBlockContexts ] = useState( [] );
	const [ orderBy, setOrderBy ] = useState( groupOrder );

	useEffect( () => {
		apiFetch( { path: '/buddypress/v1/group-types' } ).then( ( types ) => {
			setGroupTypes( types );
		} );
	}, [] );

	const { receiveEntityRecords } = useDispatch( 'core' );

	useEffect( () => {
		const queryParams = { type: orderBy, per_page: perPage };

		if ( groupType && 'active' !== groupType ) {
			queryParams.group_type = groupType;
		}

		apiFetch( {
			path: addQueryArgs( '/buddypress/v1/groups', queryParams ),
		} ).then( ( groups ) => {
			setBlockContexts( groups );
		} );
	}, [ orderBy, groupType, perPage, receiveEntityRecords ] );

	const groupTypeOptions = () => {
		if ( groupTypes.length === 0 ) {
			return [];
		}

		const groupTypesSelect = groupTypes.map( ( type ) => ( {
			label: type.name,
			value: type.slug,
		} ) );

		groupTypesSelect.unshift(
			{
				label: __( 'All Groups', 'bp-groups-blocks' ),
				value: '',
			},
			{
				label: __( 'Active Groups', 'bp-groups-blocks' ),
				value: 'active',
			}
		);

		return groupTypesSelect;
	};

	const GroupOrderOptions = [
		{
			label: __( 'Last Active', 'bp-groups-blocks' ),
			value: 'active',
		},
		{
			label: __( 'Most Members', 'bp-groups-blocks' ),
			value: 'popular',
		},
		{
			label: __( 'Newly Created', 'bp-groups-blocks' ),
			value: 'newest',
		},
		{
			label: __( 'Alphabetical', 'bp-groups-blocks' ),
			value: 'alphabetical',
		},
		{
			label: __( 'Random', 'bp-groups-blocks' ),
			value: 'random',
		},
	];

	const setDisplayLayout = ( newDisplayLayout ) =>
		setAttributes( {
			layout: { ...layout, ...newDisplayLayout },
		} );

	const displayLayoutControls = [
		{
			icon: list,
			title: _x( 'List view', 'Post template block display setting' ),
			onClick: () => setDisplayLayout( { type: 'default' } ),
			isActive: layoutType === 'default' || layoutType === 'constrained',
		},
		{
			icon: grid,
			title: _x( 'Grid view', 'Post template block display setting' ),
			onClick: () =>
				setDisplayLayout( {
					type: 'grid',
					columnCount,
				} ),
			isActive: layoutType === 'grid',
		},
	];

	return (
		<>
			<BlockControls group="other">
				<ToolbarGroup controls={ displayLayoutControls } />
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Group Types', 'bp-groups-blocks' ) }>
					{ groupTypes.length > 0 && (
						<>
							<SelectControl
								label={ __(
									'Select a group type',
									'bp-groups-blocks'
								) }
								options={ groupTypeOptions() }
								value={ groupType }
								onChange={ ( value ) =>
									setAttributes( { groupType: value } )
								}
							/>
							{ groupType === 'active' && (
								<p>
									{ __(
										'Currently, active groups are those without a specific group type.',
										'bp-groups-blocks'
									) }
								</p>
							) }
						</>
					) }
					<SelectControl
						label={ __(
							'Select a group order',
							'bp-groups-blocks'
						) }
						options={ GroupOrderOptions }
						value={ orderBy }
						onChange={ ( value ) => {
							setOrderBy( value );
							setAttributes( { groupOrder: value } );
						} }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Display', 'bp-groups-blocks' ) }>
					<RangeControl
						label={ __( 'Items per page' ) }
						min={ 1 }
						max={ 100 }
						onChange={ ( newPerPage ) => {
							setAttributes( {
								perPage: parseInt( newPerPage ),
							} );
						} }
						value={ perPage }
					/>
				</PanelBody>
			</InspectorControls>

			<ul { ...blockProps }>
				{ blockContexts &&
					blockContexts.map( ( blockContext ) => (
						<BlockContextProvider
							key={ blockContext.id }
							value={ {
								postId: blockContext.id,
								postType: 'bp_group',
							} }
						>
							{ blockContext.id === blockContexts[ 0 ]?.id ? (
								<>
									<PostTemplateInnerBlocks
										classList={ blockContext.classList }
									/>
								</>
							) : null }
							<MemoizedPostTemplateBlockPreview
								blocks={ blocks }
								classList={ blockContext.classList }
								isHidden={
									blockContext.id === blockContexts[ 0 ]?.id
								}
							/>
						</BlockContextProvider>
					) ) }
			</ul>
		</>
	);
}
