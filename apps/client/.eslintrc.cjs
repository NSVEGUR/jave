module.exports = {
	...require('config/eslint-sveltekit'),
	parserOptions: {
		root: true,
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json']
	}
};
