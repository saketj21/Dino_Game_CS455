import globals from "globals";
import pluginJs from "@eslint/js";
import complexityPlugin from "eslint-plugin-complexity";

export default [
  {
    files: ["/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.browser,
    },
    plugins: {
      complexity: complexityPlugin,  // Assign the plugin object directly
    },
    rules: {
      'complexity': ['error', { 'max': 10 }],
      'max-depth': ['error', 4],
      'max-lines-per-function': ['error', 50],
      'max-params': ['error', 4],
      'max-statements': ['error', 15],
    },
  },
  pluginJs.configs.recommended
];