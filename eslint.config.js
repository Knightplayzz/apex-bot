const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

const globals = {
    __dirname: 'readonly',
    Buffer: 'readonly',
    clearInterval: 'readonly',
    clearTimeout: 'readonly',
    console: 'readonly',
    describe: 'readonly',
    expect: 'readonly',
    jest: 'readonly',
    module: 'readonly',
    process: 'readonly',
    require: 'readonly',
    setInterval: 'readonly',
    setTimeout: 'readonly',
    test: 'readonly',
};

module.exports = [
    {
        ignores: ['node_modules/**', 'src/SECURITY/**'],
    },
    js.configs.recommended,
    {
        files: ['**/*.{js,cjs,mjs,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            globals,
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-require-imports': 'off',
            indent: ['error', 4],
            'linebreak-style': ['error', 'windows'],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
        },
    },
];
