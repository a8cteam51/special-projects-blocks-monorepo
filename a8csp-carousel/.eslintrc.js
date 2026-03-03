module.exports = {
	root: true,
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	ignorePatterns: [ 'build/*.js' ],
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': [ 'error', { ignore: [ '^@wordpress/' ] } ],
	},
};
