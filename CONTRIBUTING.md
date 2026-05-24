# Contributing

> One rule: **commit messages drive versioning**. Format them right and version + CHANGELOG happen automatically on merge to `main`.

---

## Commit format (Conventional Commits)

```
<type>(<scope>): <subject>

[optional body]

[optional footer, e.g. BREAKING CHANGE: ...]
```

Examples:

```
feat(sales): add monthly trend chart
fix(import): handle missing storage manifest gracefully
perf(charts): memoize per-category color map
refactor(home): replace corner ribbon with a Beta chip
docs(readme): document the new release flow
```

### Allowed types and what they do

| Type | Version bump | Shows in CHANGELOG |
|------|--------------|--------------------|
| `feat`     | **minor** (0.50.2 → 0.51.0) | ✨ Features |
| `fix`      | **patch** (0.50.2 → 0.50.3) | 🐛 Bug Fixes |
| `perf`     | **patch** | ⚡ Performance |
| `revert`   | **patch** | ⏪ Reverts |
| `refactor` | none      | ♻️ Refactors |
| `docs`     | none      | 📚 Documentation |
| `style`    | none      | hidden |
| `test`     | none      | hidden |
| `build`    | none      | hidden |
| `ci`       | none      | hidden |
| `chore`    | none      | hidden |

**Breaking changes** — any commit with `BREAKING CHANGE: <description>` in the body gets a **major bump** (0.50.2 → 1.0.0) and lands in a "BREAKING CHANGES" section in the CHANGELOG, regardless of type. Use it sparingly.

---

## What's enforced

1. **Local (pre-commit)** — `husky` runs `commitlint` on every `git commit`. A malformed message rejects the commit before it lands.
2. **CI (pull request)** — the `Lint commits` workflow re-runs `commitlint` across every commit in the PR. Bypassing husky with `--no-verify` won't help — the PR check blocks the merge.
3. **CI (merge to main)** — the `Release on Main` workflow runs `standard-version`, which:
   - reads commits since the last tag,
   - decides the bump,
   - regenerates `CHANGELOG.md`,
   - bumps `package.json`,
   - tags the commit (`vX.Y.Z`),
   - pushes the commit + tag back to `main`.

If there's nothing release-worthy (only `style`/`test`/`chore`/`ci`/etc. since the last tag), the workflow runs as a no-op.

---

## Local commands you'll actually use

```bash
# See what version standard-version WOULD cut, without touching anything:
npm run release:dry

# Cut a release locally (commits + tags, but doesn't push):
npm run release

# Lint commit history manually (almost never needed — CI does it):
npx commitlint --from origin/main --to HEAD
```

---

## Why this setup

- **Conventional Commits** — industry standard, AI-friendly, plays nicely with most tooling.
- **commitlint + husky** — fast feedback locally so you never wait for CI to learn you typo'd `feaat:`.
- **standard-version** — runs entirely from local git history, no GitHub App or token juggling, no external service dependency.
- **Hidden noise types** — `chore`/`style`/`test`/`build`/`ci`/`docs (when hidden)` don't pollute the CHANGELOG, so users see only what they care about.
- **Tag push in CI** — `git push --follow-tags` ensures `vX.Y.Z` reaches `origin` so `gh release create` and downstream tooling can find it.
- **Anti-loop guard** — the workflow skips when its own `chore(release):` commit comes back through `push`, so the release doesn't trigger another release.

---

## Cheat sheet (stick this on a Post-it)

```
feat       → minor bump, shows up
fix/perf   → patch bump, shows up
refactor   → no bump, shows up
docs       → no bump, shows up
style/test/build/ci/chore → no bump, hidden
BREAKING CHANGE in body   → major bump, always shown
```
