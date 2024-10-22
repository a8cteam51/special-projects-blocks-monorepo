const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
	...defaultConfig,
	entry: {
		"filtered-query-loop": "./src/filtered-query-loop.js",
	},
};
