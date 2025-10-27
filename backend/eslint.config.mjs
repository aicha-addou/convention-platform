// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["node_modules", "dist", "build", "coverage"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // ✅ environnement Node.js
      },
    },
    extends: [
      js.configs.recommended, // ✅ règles JS de base
      prettier,               // ✅ désactive les conflits avec Prettier
    ],
    rules: {
      // ✅ Bonnes pratiques générales
      "no-unused-vars": ["warn"],
      "no-console": "off", // autorisé dans le backend (utile pour logs Render)
      "no-undef": "error",

      // ✅ Style de code
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "eqeqeq": ["warn", "always"],
      "curly": ["warn", "all"],

      // ✅ Qualité
      "consistent-return": "warn",
      "prefer-const": "warn",
      "no-var": "error"
    },
  },
]);
