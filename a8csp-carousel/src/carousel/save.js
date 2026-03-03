// WordPress dependencies.
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

// Internal dependencies.
import { getHTMLAttributes } from './common';

export default function save( { attributes } ) {
	const { children, ...innerBlockProps } = useInnerBlocksProps.save(
		useBlockProps.save( getHTMLAttributes( attributes ) )
	);

	return <div { ...innerBlockProps }>{ children }</div>;
}
