const postcssPlugins = require( '@wordpress/postcss-plugins-preset' );

module.exports = () => {
	return {
		parser: false,
		plugins: [
			...(
				[
					require( 'postcss-preset-env' )( {
						features: {
							'nesting-rules': false, // Defer to `postcss-nested` to handle nesting.
						},
					} ),
					require( 'postcss-nested' ),
				]
			),
			...postcssPlugins,
		]
	};
};
