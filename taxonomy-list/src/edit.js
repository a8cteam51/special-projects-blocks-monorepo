/**
 * WordPress dependencies
 */
import {
	PanelBody,
	Placeholder,
	Spinner,
	ToggleControl,
	VisuallyHidden,
	SelectControl,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import { withSelect } from '@wordpress/data';

export default function TaxonomyListEdit( {
	attributes: {
		selectedTaxonomy,
		displayAsDropdown,
		showHierarchy,
		showPostCounts,
		showOnlyTopLevel,
		showEmpty,
		label,
		showLabel,
	},
	setAttributes,
	className,
} ) {
	const selectId = useInstanceId(
		TaxonomyListEdit,
		'blocks-category-select'
	);
	const query = { per_page: -1, hide_empty: ! showEmpty, context: 'view' };
	if ( showOnlyTopLevel ) {
		query.parent = 0;
	}

	/*
	 * Creates a control object for selecting a taxonomy.
	 * @return {Object[]} A formatted SelectControl.
	 */
	const TaxonomySelectControl = withSelect( ( select ) => {
		const taxonomies = select( 'core' ).getTaxonomies();

		return {
			taxonomies,
		};
	} )( ( { taxonomies, onChange, value } ) => {
		const taxonomyOptions = taxonomies.map( ( taxonomy ) => ( {
			label: taxonomy.labels.singular_name + ' (' + taxonomy.slug + ')',
			value: taxonomy.slug,
		} ) );

		return (
			<SelectControl
				__nextHasNoMarginBottom
				label={ __( 'Select Taxonomy' ) }
				options={ taxonomyOptions }
				value={ value }
				onChange={ onChange }
			/>
		);
	} );

	const { records: terms, isResolving } = useEntityRecords(
		'taxonomy',
		selectedTaxonomy,
		query
	);

	const getTermsList = ( parentId ) => {
		if ( ! terms?.length ) {
			return [];
		}
		if ( parentId === null ) {
			return terms;
		}
		return terms.filter( ( { parent } ) => parent === parentId );
	};

	const toggleAttribute = ( attributeName ) => ( newValue ) =>
		setAttributes( { [ attributeName ]: newValue } );

	const renderTermName = ( name ) =>
		! name ? __( '(Untitled)' ) : decodeEntities( name ).trim();

	const renderTermList = () => {
		const parentId = showHierarchy ? 0 : null;
		const termsList = getTermsList( parentId );
		return termsList.map( ( category ) =>
			renderTermListItem( category )
		);
	};

	const renderTermListItem = ( category ) => {
		const childTerms = getTermsList( category.id );
		const { id, link, count, name } = category;
		return (
			<li key={ id } className={ `cat-item cat-item-${ id }` }>
				<a href={ link } target="_blank" rel="noreferrer noopener">
					{ renderTermName( name ) }
				</a>
				{ showPostCounts && ` (${ count })` }
				{ showHierarchy && !! childTerms.length && (
					<ul className="children">
						{ childTerms.map( ( childCategory ) =>
							renderTermListItem( childCategory )
						) }
					</ul>
				) }
			</li>
		);
	};

	const renderTermDropdown = () => {
		const parentId = showHierarchy ? 0 : null;
		const termsList = getTermsList( parentId );
		return (
			<>
				{ showLabel ? (
					<RichText
						className="wp-block-categories__label"
						aria-label={ __( 'Label text' ) }
						placeholder={ __( 'Terms' ) }
						withoutInteractiveFormatting
						value={ label }
						onChange={ ( html ) =>
							setAttributes( { label: html } )
						}
					/>
				) : (
					<VisuallyHidden as="label" htmlFor={ selectId }>
						{ label ? label : __( 'Terms' ) }
					</VisuallyHidden>
				) }
				<select id={ selectId }>
					<option>{ __( 'Select Term' ) }</option>
					{ termsList.map( ( category ) =>
						renderTermDropdownItem( category, 0 )
					) }
				</select>
			</>
		);
	};

	const renderTermDropdownItem = ( category, level ) => {
		const { id, count, name } = category;
		const childTerms = getTermsList( id );
		return [
			<option key={ id } className={ `level-${ level }` }>
				{ Array.from( { length: level * 3 } ).map( () => '\xa0' ) }
				{ renderTermName( name ) }
				{ showPostCounts && ` (${ count })` }
			</option>,
			showHierarchy &&
				!! childTerms.length &&
				childTerms.map( ( childCategory ) =>
					renderTermDropdownItem( childCategory, level + 1 )
				),
		];
	};

	const TagName =
		!! terms?.length && ! displayAsDropdown && ! isResolving
			? 'ul'
			: 'div';

	let classes = className;
	classes +=
		!! terms?.length && ! displayAsDropdown && ! isResolving
			? 'wp-block-taxonomy-list-terms'
			: '';
	classes +=
		!! terms?.length && displayAsDropdown && ! isResolving
			? 'wp-block-taxonomy-list-terms-dropdown'
			: '';

	const blockProps = useBlockProps( {
		className: classes,
	} );

	return (
		<TagName { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<TaxonomySelectControl
						value={ selectedTaxonomy }
						onChange={ toggleAttribute( 'selectedTaxonomy' ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Display as dropdown' ) }
						checked={ displayAsDropdown }
						onChange={ toggleAttribute( 'displayAsDropdown' ) }
					/>
					{ displayAsDropdown && (
						<ToggleControl
							__nextHasNoMarginBottom
							className="wp-block-categories__indentation"
							label={ __( 'Show label' ) }
							checked={ showLabel }
							onChange={ toggleAttribute( 'showLabel' ) }
						/>
					) }
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show post counts' ) }
						checked={ showPostCounts }
						onChange={ toggleAttribute( 'showPostCounts' ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show only top level terms' ) }
						checked={ showOnlyTopLevel }
						onChange={ toggleAttribute( 'showOnlyTopLevel' ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show empty terms' ) }
						checked={ showEmpty }
						onChange={ toggleAttribute( 'showEmpty' ) }
					/>
					{ ! showOnlyTopLevel && (
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Show hierarchy' ) }
							checked={ showHierarchy }
							onChange={ toggleAttribute( 'showHierarchy' ) }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			{ isResolving && (
				<Placeholder label={ __( 'Taxonomy Terms' ) }>
					<Spinner />
				</Placeholder>
			) }
			{ ! isResolving && terms?.length === 0 && (
				<p>
					{ __(
						'Your site does not have any posts, so there is nothing to display here at the moment.'
					) }
				</p>
			) }
			{ ! isResolving &&
				terms?.length > 0 &&
				( displayAsDropdown
					? renderTermDropdown()
					: renderTermList() ) }
		</TagName>
	);
}
