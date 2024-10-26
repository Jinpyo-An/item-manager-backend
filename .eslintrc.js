module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json", tsconfigRootDir: __dirname, sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["plugin:@typescript-eslint/recommended"],
  root: true,
  env: {
    node: true, jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "array-element-newline": ["error", {
      "ArrayExpression": {
        "multiline": true, "minItems": 1,
      },
    },
    ],
    "brace-style": [
      "error",
      "1tbs",
      {
        "allowSingleLine": true,
      },
    ],
    "camelcase": [
      "error",
      {
        "properties": "never",
      },
    ],
    "comma-dangle": [
      "error",
      "always",
    ],
    "eqeqeq": [
      "error",
      "allow-null",
    ],
    "eol-last": "error",
    "function-call-argument-newline": [
      "error",
      "never",
    ],
    "indent": [
      "error",
      4, {
        "SwitchCase": 1,
        "ignoredNodes": ["PropertyDefinition"],
      },
    ],
    "max-len": [
      "error",
      120,
      4,
      {
        "ignoreUrls": true,
      },
    ],
    "no-empty": [
      "error", {
        "allowEmptyCatch": false,
      },
    ],
    "no-multiple-empty-lines": [
      "error", {
        "max": 1,
        "maxEOF": 0,
      },
    ],
    "padding-line-between-statements": [
      "error", {
        "blankLine": "always",
        "prev": "*",
        "next": "return",
      },
    ],
    "object-curly-newline": [
      "error", {
        "ObjectExpression": {
          "multiline": true,
          "minProperties": 1,
        },
        "ObjectPattern": {
          "multiline": true,
          "minProperties": 1,
        },
        "ImportDeclaration": {
          "multiline": true,
          "minProperties": 1,
        },
        "ExportDeclaration": {
          "multiline": true,
          "minProperties": 1,
        },
      },
    ],
    "object-curly-spacing": [
      "error",
      "always",
    ],
    "object-property-newline": [
      "error",
      {
        "allowAllPropertiesOnSameLine": false,
      },
    ],
    "semi": [
      "error",
      "always",
    ],
    "space-before-blocks": [
      "error",
      "always",
    ],
    "space-in-parens": [
      "error",
      "never",
    ],
    "@typescript-eslint/interface-name-prefix": "off",
    // "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "off",
  },
};