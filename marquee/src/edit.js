/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

import "./editor.scss";

export default function Edit({ attributes }) {
	const { tagName: TagName = "div" } = attributes;

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ["core/group"],
		orientation: "horizontal",
		directInsert: true,
		template: [
			[
				"core/group",
				{
					isMarquee: true,
					layout: { type: "flex", flexWrap: "nowrap" },
					className: "wpcomsp-marquee-content",
				},
			],
		],
	});

	return <TagName {...innerBlocksProps} />;
}
