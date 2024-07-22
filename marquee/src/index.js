import {
	registerBlockType,
	registerBlockVariation,
	unregisterBlockVariation,
} from "@wordpress/blocks";
import { __, _x } from "@wordpress/i18n";
import { row } from "@wordpress/icons";

import "./style.scss";

/**
 * Internal dependencies
 */
import Edit from "./edit";
import save from "./save";
import metadata from "./block.json";

setTimeout(() => {
	unregisterBlockVariation("core/group", ["group-row"]);

	registerBlockVariation("core/group", {
		name: "wpcomsp/marquee-content",
		title: "Marquee Content",
		icon: "editor-table",
		description: __("A marquee content block."),
		scope: ["block"],
		attributes: {
			layout: { type: "flex", flexWrap: "nowrap" },
			className: "wpcomsp-marquee-content",
			allowedBlocks: [
				"core/paragraph",
				"core/heading",
				"core/image",
				"core/buttons",
			],
		},
		isActive: (blockAttributes) =>
			blockAttributes.layout?.type === "flex" &&
			(!blockAttributes.layout?.orientation ||
				blockAttributes.layout?.orientation === "horizontal"),
	});

	// re-register the Row block variation
	registerBlockVariation("core/group", {
		name: "group-row",
		title: _x("Row", "single horizontal line"),
		description: __("Arrange blocks horizontally."),
		attributes: { layout: { type: "flex", flexWrap: "nowrap" } },
		scope: ["block", "inserter", "transform"],
		isActive: (blockAttributes) =>
			blockAttributes.layout?.type === "flex" &&
			(!blockAttributes.layout?.orientation ||
				blockAttributes.layout?.orientation === "horizontal"),
		icon: row,
	});
}, 1000);

registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
