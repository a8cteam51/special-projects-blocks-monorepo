/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews';
import { useState, useMemo } from '@wordpress/element';

import './style.scss';

const primaryField = 'id';
const defaultLayouts = {
	table: {
		layout: {
			primaryField,
		},
	},
};

const fields = [
	{
		id: 'post_title',
		label: __( 'Post', 'reactions' ),
		render: ( { item } ) => (
			<a href={ item.post_permalink } target="_blank">
				{ item.post_title }
			</a>
		),
		enableSorting: true,
		enableGlobalSearch: true,
	},
	{
		id: 'reaction_label',
		label: __( 'Reaction', 'reactions' ),
		render: ( { item } ) => (
			<div
				style={ {
					display: 'flex',
					alignItems: 'center',
					gap: '6px',
				} }
			>
				<img
					width="16"
					height="16"
					src={ 'data:image/svg+xml,' + item.reaction_icon }
				/>
				<span>{ item.reaction_label }</span>
			</div>
		),
		enableSorting: true,
		enableGlobalSearch: true,
	},
	{
		id: 'display_name',
		label: __( 'User', 'reactions' ),
		enableSorting: true,
		enableGlobalSearch: true,
	},
	{
		id: 'created_at',
		label: __( 'Date', 'reactions' ),
		render: ( { item } ) => item.created_at_formatted,
		enableSorting: true,
	},
];
const App = () => {
	const [ view, setView ] = useState( {
		type: 'table',
		perPage: 10,
		layout: defaultLayouts.table.layout,
		fields: [
			'post_title',
			'created_at',
			'display_name',
			'reaction_label',
		],
	} );
	const { data: processedData, paginationInfo } = useMemo( () => {
		const dataArray = Object.values( wpcomspReactionsDataViews.data ); // Convert object to array
		return filterSortAndPaginate( dataArray, view, fields );
	}, [ view ] );

	return (
		<>
			<DataViews
				data={ processedData }
				fields={ fields }
				view={ view }
				onChangeView={ setView }
				defaultLayouts={ defaultLayouts }
				paginationInfo={ paginationInfo }
			/>
		</>
	);
};

export default App;
