import { InspectorControls } from "@wordpress/block-editor";
import { registerBlockVariation } from "@wordpress/blocks";
import { ToggleControl, BaseControl } from "@wordpress/components";
import { createHigherOrderComponent } from "@wordpress/compose";
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";

const extendCategoriesBlockSettings = (settings, name) => {
	if (name !== "core/categories") {
		return settings;
	}

	settings.attributes.isFilter = {
		type: "boolean",
		default: false,
	};

	settings.usesContext.push("enhancedPagination");

	return settings;
};

addFilter(
	"blocks.registerBlockType",
	"wpcomsp/extend-categories-block-settings",
	extendCategoriesBlockSettings,
);

const addIsFilterToggle = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, context, name, setAttributes } = props;

		if (name !== "core/categories" || !context.enhancedPagination) {
			return <BlockEdit {...props} />;
		}

		const { isFilter } = attributes;

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls group="advanced">
					<BaseControl label={__("Categories filter")}>
						<ToggleControl
							label={__("Act as a filter")}
							checked={!!isFilter}
							onChange={() => setAttributes({ isFilter: !isFilter })}
							help={__(
								"When enabled, this block will act as a filter for the query block. If not, it will act as a regular categories block.",
							)}
						/>
					</BaseControl>
				</InspectorControls>
			</>
		);
	};
}, "withIsFilterToggle");

addFilter(
	"editor.BlockEdit",
	"wpcomsp/categories-add-is-filter-toggle",
	addIsFilterToggle,
);

registerBlockVariation("core/query", {
	name: "filtered-query",
	title: "Filtered Query Loop",
	attributes: {
		enhancedPagination: true,
	},
	innerBlocks: [
		["core/categories", { isFilter: true }],
		["core/post-template"],
		["core/query-pagination"],
	],
});

registerBlockVariation("core/categories", {
	name: "categories-filter",
	title: "Categories Filter",
	attributes: {
		isFilter: true,
	},
	isActive: ["isFilter"],
});
