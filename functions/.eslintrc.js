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
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["/lib/**/*", "/generated/**/*"],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "no-debugger": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-constant-condition": "warn",
  },
};
