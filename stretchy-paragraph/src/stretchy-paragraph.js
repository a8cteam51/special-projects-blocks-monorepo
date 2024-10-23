import { registerBlockVariation } from "@wordpress/blocks";
import { addFilter } from "@wordpress/hooks";
import { InspectorControls } from "@wordpress/block-editor";
import { ToggleControl, PanelBody } from "@wordpress/components";
import { createHigherOrderComponent } from "@wordpress/compose";
import { RichText } from "@wordpress/block-editor";

registerBlockVariation("core/paragraph", {
	name: "paragraph-stretchy",
	title: "Stretchy Paragraph",
	attributes: {
		isStretchy: true,
	},
	isActive: ["isStretchy"],
});

addFilter(
	"blocks.registerBlockType",
	"wpcomsp/extend-paragraph-block-settings",
	(settings, name) => {
		if (name !== "core/paragraph") {
			return settings;
		}

		settings.attributes.isStretchy = {
			type: "boolean",
			default: false,
		};

		return settings;
	},
);

addFilter(
	"editor.BlockEdit",
	"wpcomsp/paragraph-add-is-stretchy-toggle",
	createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			const { attributes, name, setAttributes } = props;

			if (name !== "core/paragraph") {
				return <BlockEdit {...props} />;
			}

			const { isStretchy, content } = attributes;

			return (
				<>
					{isStretchy ? (
						<div class="wpcomsp-stretchy-paragraph">
							<div>
								<BlockEdit {...props} />
							</div>
							<p aria-hidden="true" {...props}>
								<RichText.Content value={content} />
							</p>
						</div>
					) : (
						<BlockEdit {...props} />
					)}
					<InspectorControls>
						<PanelBody title="Experimental">
							<ToggleControl
								label="Enable stretchy type"
								checked={!!isStretchy}
								onChange={() => setAttributes({ isStretchy: !isStretchy })}
							/>
						</PanelBody>
					</InspectorControls>
				</>
			);
		};
	}, "withIsStretchyToggle"),
);
