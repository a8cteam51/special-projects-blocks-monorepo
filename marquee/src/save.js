import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

export default function save({ attributes: { tagName: Tag } }) {
	return <Tag {...useInnerBlocksProps.save(useBlockProps.save())} />;
}
