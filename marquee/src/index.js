import { registerBlockType, registerBlockVariation } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import domReady from "@wordpress/dom-ready";

import "./style.scss";

/**
 * Internal dependencies
 */
import Edit from "./edit";
import save from "./save";
import metadata from "./block.json";

domReady(() => {
	registerBlockVariation("core/group", {
		name: "wpcomsp/marquee-content",
		title: "Marquee Content",
		icon: "editor-table",
		description: __("A marquee content block."),
		scope: ["block", "inserter"],
		attributes: {
			isMarquee: true,
			layout: { type: "flex", flexWrap: "nowrap" },
			className: "wpcomsp-marquee-content",
			allowedBlocks: [
				"core/paragraph",
				"core/heading",
				"core/image",
				"core/buttons",
			],
		},
		isActive: ["layout.type", "isMarquee"],
	});
});

registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
