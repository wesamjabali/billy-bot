module.exports = {
	env: {
		es2022: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	overrides: [
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: [
		'@typescript-eslint'
	],
	rules: {
		quotes: ['error', 'single'],
		'quote-props': ['error', 'as-needed'],
		'max-len': ['error', { code: 100 }],
	},
 	excludeFiles: ['build/**/*']
}
