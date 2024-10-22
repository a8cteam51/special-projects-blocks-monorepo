import { registerBlockVariation } from "@wordpress/blocks";

registerBlockVariation("core/paragraph", {
	name: "paragraph-red",
	title: "Red Paragraph",
	attributes: {
		textColor: "vivid-red",
	},
	isActive: ["textColor"],
});
