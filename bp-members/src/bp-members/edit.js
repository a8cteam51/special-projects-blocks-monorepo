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
			aspectRatio: '1',
			scale: 'cover',
			metadata: {
				bindings: {
					url: {
						source: 'bp-members/member-avatar',
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
						source: 'bp-members/member-heading',
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
						source: 'bp-members/member-x-profile',
					},
				},
			},
		},
	],
];

function PostTemplateInnerBlocks( { classList } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx( 'a8csp-bp-member', classList ) },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <li { ...innerBlocksProps } />;
}

function PostTemplateBlockPreview( { blocks, classList, isHidden } ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: clsx( 'a8csp-bp-member', classList ),
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
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
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
	const { memberType, memberOrder, perPage } = attributes;
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

	const [ memberTypes, setMemberTypes ] = useState( [] );
	const [ blockContexts, setBlockContexts ] = useState( [] );
	const [ orderBy, setOrderBy ] = useState( memberOrder );

	useEffect( () => {
		apiFetch( { path: '/buddypress/v1/member-types' } ).then( ( types ) => {
			setMemberTypes( types );
		} );
	} );

	const { receiveEntityRecords } = useDispatch( 'core' );

	useEffect( () => {
		const queryParams = { type: orderBy, per_page: perPage };

		if ( memberType ) {
			queryParams.member_type = memberType;
		}

		apiFetch( {
			path: addQueryArgs( '/buddypress/v1/members', queryParams ),
		} ).then( ( members ) => {
			setBlockContexts( members );
		} );
	}, [ orderBy, memberType, perPage, receiveEntityRecords ] );

	const memberTypeOptions = () => {
		if ( memberTypes.length === 0 ) {
			return [];
		}

		const memberTypesSelect = memberTypes.map( ( type ) => ( {
			label: type.name,
			value: type.slug,
		} ) );

		memberTypesSelect.unshift( {
			label: __( 'All Member Types', 'a8csp-bp-members' ),
			value: '',
		} );

		return memberTypesSelect;
	};

	const MemberOrderOptions = [
		{
			label: __( 'Last Active', 'a8csp-bp-members' ),
			value: 'active',
		},
		{
			label: __( 'Newest Registered', 'a8csp-bp-members' ),
			value: 'newest',
		},
		{
			label: __( 'Alphabetical', 'a8csp-bp-members' ),
			value: 'alphabetical',
		},
		{
			label: __( 'Random', 'a8csp-bp-members' ),
			value: 'random',
		},
		{
			label: __( 'Online', 'a8csp-bp-members' ),
			value: 'online',
		},
		{
			label: __( 'Popular', 'a8csp-bp-members' ),
			value: 'popular',
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
				<PanelBody title={ __( 'Member Types', 'a8csp-bp-members' ) }>
					{ memberTypes.length > 0 && (
						<SelectControl
							label={ __(
								'Select a member type',
								'a8csp-bp-members'
							) }
							options={ memberTypeOptions() }
							value={ memberType }
							onChange={ ( value ) =>
								setAttributes( { memberType: value } )
							}
						/>
					) }
					<SelectControl
						label={ __(
							'Select a member order',
							'a8csp-bp-members'
						) }
						options={ MemberOrderOptions }
						value={ orderBy }
						onChange={ ( value ) => {
							setOrderBy( value );
							setAttributes( { memberOrder: value } );
						} }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Display', 'a8csp-bp-members' ) }>
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
								postType: 'bp_user',
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
