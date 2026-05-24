/**
 * Commitlint config — enforces Conventional Commits on every local
 * commit (via the .husky/commit-msg hook) and on every PR (via the
 * "Lint commits" GitHub workflow).
 *
 * The allowed types here are the SAME ones standard-version reads when
 * deciding the next version + populating CHANGELOG.md, so keep this in
 * sync with `.versionrc.json` if you ever add a new type.
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // new user-facing feature → minor bump
        "fix", // bug fix → patch bump
        "perf", // performance improvement → patch bump
        "revert", // reverts a previous commit → patch bump
        "refactor", // code change that's neither a feat nor a fix → no bump
        "docs", // documentation only → no bump
        "style", // formatting / whitespace only → no bump
        "test", // adding or fixing tests → no bump
        "build", // build system or external deps → no bump
        "ci", // CI config changes → no bump
        "chore", // anything else that's not source code → no bump
      ],
    ],
    // Subject (the part after the colon) — keep it readable.
    "subject-case": [0], // allow any case; bilingual subjects need flexibility
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [0], // long body lines are fine
  },
};
