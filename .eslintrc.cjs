module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "eslint-config-prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "import"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        // Allow `_`-prefixed args (required positional callback params
        // that we intentionally ignore — e.g. pdfmake `(rowIndex, _node,
        // _columnIndex)`).
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-debugger": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-constant-condition": "warn",

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
  overrides: [
    {
      // shadcn primitives intentionally co-export variants
      // (badgeVariants, buttonVariants, …) and hooks (useFormField)
      // alongside their component. That's the canonical pattern from
      // the upstream generator — fighting the Fast Refresh rule on
      // every shadcn regenerate isn't worth it.
      files: ["src/components/ui/**/*.{ts,tsx}"],
      rules: {
        "react-refresh/only-export-components": "off",
      },
    },
  ],
};
