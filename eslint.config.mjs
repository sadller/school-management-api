import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended, // Use ESLint recommended settings
  prettier, // Disable conflicting rules between ESLint & Prettier
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'no-prototype-builtins': 'off',
      'no-redeclare': 'off',
      'eqeqeq': 'off',
    },
  },
  {
    ignores: ['node_modules'],
  },
];
