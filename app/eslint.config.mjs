import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import prettier from "eslint-plugin-prettier"
import unusedImports from "eslint-plugin-unused-imports"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

const eslintConfig = [
  ...compat.extends("next", "next/core-web-vitals", "prettier"),
  {
    plugins: {
      prettier,
      "unused-imports": unusedImports
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },

    rules: {
      "prettier/prettier": "warn", // comment out if it's annoying you
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off"
    }
  }
]

export default eslintConfig
