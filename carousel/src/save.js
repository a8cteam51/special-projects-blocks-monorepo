// WordPress dependencies.
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save() {
	const { children, ...innerBlockProps } = useInnerBlocksProps.save(
		useBlockProps.save()
	);

	return (
		<div { ...innerBlockProps }>
			{ children }
		</div>
	);
}
