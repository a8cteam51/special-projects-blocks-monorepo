// WordPress dependencies.
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

// Internal dependencies.
import { getAttributes } from './common';

export default function save( { attributes } ) {
	const { children, ...innerBlockProps } = useInnerBlocksProps.save(
		useBlockProps.save( getAttributes( attributes ) ),
		{
			renderAppender: false,
		}
	);

	return <div { ...innerBlockProps }>{ children }</div>;
}
