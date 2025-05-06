// WordPress dependencies.
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

// Internal dependencies.
import { getAttributes, paginationButtons } from './common';

export default function save( { attributes } ) {
	const { layout, count } = attributes;

	const innerBlocksProps = useInnerBlocksProps.save(
		useBlockProps.save( getAttributes( attributes ) ),
		{
			orientation: layout?.orientation ?? 'horizontal',
		}
	);

	return <div { ...innerBlocksProps }>{ paginationButtons( count ) }</div>;
}
