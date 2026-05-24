module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["/lib/**/*", "/generated/**/*", "/.eslintrc.js"],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        // Allow `_`-prefixed args (positional callback params we need
        // to declare but intentionally don't use — e.g. pdfmake
        // `fillColor(rowIndex, _node, _columnIndex)`).
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-debugger": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-constant-condition": "warn",
    "import/no-unresolved": "off",
    "require-jsdoc": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "new-cap": "off",

    "import/order": [
      "error",
      {
        groups: [["builtin", "external", "internal"]],
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
      },
    ],
  },
};
