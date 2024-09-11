import globals from "globals";
import pluginJs from "@eslint/js";
import complexityPlugin from "eslint-plugin-complexity";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
    },
    plugins: {
      complexity: complexityPlugin,
    },
    rules: {
      'complexity': ['error', { 'max': 10 }],
      'max-depth': ['error', 4],
      'max-lines-per-function': ['error', 100],
      'max-params': ['error', 8],
      'max-statements': ['error', 30],
      'no-undef': 'off',
    },
  },
  pluginJs.configs.recommended
];