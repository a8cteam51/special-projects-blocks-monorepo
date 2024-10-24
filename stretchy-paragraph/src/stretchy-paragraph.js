import { registerBlockVariation } from "@wordpress/blocks";
import { addFilter } from "@wordpress/hooks";
import { InspectorControls } from "@wordpress/block-editor";
import { BaseControl, ToggleControl } from "@wordpress/components";
import { createHigherOrderComponent } from "@wordpress/compose";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

registerBlockVariation("core/paragraph", {
	name: "paragraph-stretchy",
	title: "Stretchy Paragraph",
	attributes: {
		isStretchy: true,
		style: {
			spacing: {
				margin: {
					top: "0",
					bottom: "0",
				},
			},
		},
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

			// Content can be a string or an object.
			const isNotEmpty = content?.trim() || content?.text;

			const stretchyControls = (
				<InspectorControls group="advanced">
					<BaseControl label="Experimental">
						<ToggleControl
							label={__("Stretchy")}
							help={__(
								"Enable this option to make the paragraph stretchy and fit its container width.",
							)}
							checked={!!isStretchy}
							onChange={() => setAttributes({ isStretchy: !isStretchy })}
						/>
					</BaseControl>
				</InspectorControls>
			);

			const blockProps = useBlockProps({
				"aria-hidden": "true",
			});

			return (
				<>
					{isStretchy && isNotEmpty ? (
						<div class="wpcomsp-stretchy-paragraph">
							<div>
								<BlockEdit {...props} />
								{stretchyControls}
							</div>
							<RichText {...blockProps} tagName="p" value={content} />
						</div>
					) : (
						<>
							<BlockEdit {...props} />
							{stretchyControls}
						</>
					)}
				</>
			);
		};
	}, "withIsStretchyToggle"),
);
