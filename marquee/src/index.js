import {
	registerBlockType,
	registerBlockVariation,
	unregisterBlockVariation,
	getBlockVariations,
} from "@wordpress/blocks";
import { __, _x } from "@wordpress/i18n";

import "./style.scss";

/**
 * Internal dependencies
 */
import Edit from "./edit";
import save from "./save";
import metadata from "./block.json";

// This doesn't seem to do anything?
unregisterBlockVariation("core/group", "group");

const blockVariations = getBlockVariations("core/group");

// This doesn't seem to do anything?
console.log("blockVariations", blockVariations);

registerBlockVariation("core/group", {
	name: "wpcomsp/marquee-content",
	title: "Marquee Content",
	icon: "editor-table",
	description: __("A marquee content block."),
	scope: ["block", "inserter", "transform"],
	isDefault: true,
	attributes: {
		layout: { type: "flex", flexWrap: "nowrap" },
		className: "wpcomsp-marquee-content",
		isMarquee: true,
		allowedBlocks: [
			"core/paragraph",
			"core/heading",
			"core/image",
			"core/buttons",
		],
	},
	isActive: (blockAttributes) =>
		blockAttributes.isMarquee === true &&
		blockAttributes.layout?.type === "flex" &&
		(!blockAttributes.layout?.orientation ||
			blockAttributes.layout?.orientation === "horizontal"),
});

// Here I need to re-register the group variation

registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
