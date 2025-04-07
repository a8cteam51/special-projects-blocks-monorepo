// WordPress dependencies.
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

// Internal dependencies.
import { getAttributes, prevNextButtons, paginationButtons } from './common';

export default function save( { attributes } ) {
	const { prevNext, pagination, itemCount } = attributes;
	const { children, ...innerBlockProps } = useInnerBlocksProps.save(
		useBlockProps.save( getAttributes( attributes ) )
	);

	return (
		<div { ...innerBlockProps }>
			{ prevNext && prevNextButtons() }
			{ pagination && paginationButtons( itemCount ) }
			{ children }
		</div>
	);
}
