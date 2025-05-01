// WordPress dependencies.
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

// Internal dependencies.
import { getAttributes, navigationButtons } from './common';

export default function save( { attributes } ) {
	const { layout } = attributes;

	const innerBlocksProps = useInnerBlocksProps.save(
		useBlockProps.save( getAttributes() ),
		{
			orientation: layout?.orientation ?? 'horizontal',
		}
	);

	return (
		<div { ...innerBlocksProps }>{ navigationButtons( attributes ) }</div>
	);
}
