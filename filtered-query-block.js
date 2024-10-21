const { InspectorControls } = wp.blockEditor;
const { ToggleControl, PanelBody } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { Fragment, createElement: h } = wp.element;
const { addFilter } = wp.hooks;

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
	extendCategoriesBlockSettings
);

const addIsFilterToggle = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, context, name, setAttributes } = props;

		if (name !== "core/categories" || !context.enhancedPagination) {
			return h(BlockEdit, props);
		}

		const { isFilter } = attributes;

		return h(Fragment, {}, [
			h(BlockEdit, props),
			h(InspectorControls, {}, [
				h(PanelBody, { title: "Settings" }, [
					h(ToggleControl, {
						label: "Enable as filter",
						checked: !!isFilter,
						onChange: () => setAttributes({ isFilter: !isFilter }),
					}),
				]),
			]),
		]);
	};
}, "withIsFilterToggle");

addFilter(
	"editor.BlockEdit",
	"wpcomsp/categories-add-is-filter-toggle",
	addIsFilterToggle
);
