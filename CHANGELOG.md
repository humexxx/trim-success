# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.1](https://github.com/humexxx/trim-success/compare/v1.0.0...v1.0.1) (2026-05-26)


### Performance Improvements

* **build:** split vendor bundles + deps + dependabot off ([5ffde5b](https://github.com/humexxx/trim-success/commit/5ffde5b80b68a14f0d7b9d45278d4aec3085a3c8))

## [1.0.0](https://github.com/humexxx/trim-success/compare/v0.50.2...v1.0.0) (2026-05-24)


### ⚠ BREAKING CHANGES

* Material UI removed completely. Downstream code
depending on @mui/* packages or the old theme tokens must migrate
to the shadcn/ui equivalents under src/components/ui/**. The chart
color mapping is also new — read colorForCategory() from
src/lib/categoryColors.ts instead of hardcoded hex.

### Features

* ship v1.0 — complete MUI → shadcn migration ([6320fdc](https://github.com/humexxx/trim-success/commit/6320fdc5870a61378246aab61db01bdf07e84156)), closes [#244](https://github.com/humexxx/trim-success/issues/244) [#244](https://github.com/humexxx/trim-success/issues/244)

### 0.50.2 (2025-02-14)

### 0.50.1 (2025-02-14)

### 0.48.7 (2025-02-14)

### 0.48.6 (2025-02-14)

### 0.48.5 (2025-02-14)

### 0.48.4 (2025-02-14)

### 0.48.5 (2025-02-14)

### 0.48.4 (2025-02-14)

### Bug Fixes

- add check wait for automerge prs from dependabot ([9f03cbd](https://github.com/humexxx/trim-success/commit/9f03cbd7b4a46172c3a6f0ab8e26f11e9be520b6))

### 0.48.3 (2025-02-14)

### 0.48.2 (2025-02-09)

### Bug Fixes

- standarize app ([#150](https://github.com/humexxx/trim-success/issues/150)) ([ea6ea82](https://github.com/humexxx/trim-success/commit/ea6ea8287e1a9194d8f2a2851a61638f8bb57b9b))

### 0.48.1 (2025-02-09)

## 0.48.0 (2025-02-09)

### Features

- add missing pages, refactor routes ([2bad54c](https://github.com/humexxx/trim-success/commit/2bad54c6c0b9821ef27317ce826f757fc17a2b00))
