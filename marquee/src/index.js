import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";

/**
 * Internal dependencies
 */
import Edit from "./edit";
import save from "./save";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
