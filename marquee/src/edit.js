/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { useRef } from "@wordpress/element";

import "./editor.scss";

export default function Edit({ attributes }) {
	const { tagName: TagName = "div", allowedBlocks } = attributes;

	// Hooks.
	const ref = useRef();
	const blockProps = useBlockProps({ ref, attributes });

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		dropZoneElement: ref.current,
		allowedBlocks,
	});

	return (
		<>
			<TagName {...innerBlocksProps} />
		</>
	);
}
