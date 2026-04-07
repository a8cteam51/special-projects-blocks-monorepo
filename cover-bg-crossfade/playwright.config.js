const { defineConfig } = require( '@playwright/test' );

module.exports = defineConfig( {
	testDir: './tests',
	use: {
		baseURL: 'about:blank',
	},
} );
