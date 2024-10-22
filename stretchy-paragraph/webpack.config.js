const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
	...defaultConfig,
	entry: {
		"stretchy-paragraph": "./src/stretchy-paragraph.js",
	},
};
