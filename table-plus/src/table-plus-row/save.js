import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save() {
	return <tr { ...useInnerBlocksProps.save( useBlockProps.save() ) } />;
}
