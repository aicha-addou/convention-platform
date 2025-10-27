// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["node_modules", "dist", "build", "coverage"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // ✅ pour les fichiers de test
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      prettier, // ✅ désactive les conflits avec Prettier
    ],
    rules: {
      // ✅ Règles adaptées à React 17+
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",

      // ✅ Bonnes pratiques
      "no-unused-vars": ["warn"],
      "no-console": ["warn"],

      // ✅ Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: {
        version: "detect", // ✅ détecte automatiquement la version de React
      },
    },
  },
]);
