# Architecture

This repository is a monorepo of **independently releasable, independently
installable** WordPress plugins. Each top-level directory is its own plugin: it has
its own plugin header (`<dir>/<dir>.php`), its own `package.json` +
`package-lock.json`, builds to its own `build/` directory, ships as its own GitHub
release zip, and self-updates on installed sites via
`opsoasis.wpspecialprojects.com` (see `.utilities/class-wpcomsp-blocks-self-update.php`).

The root `special-projects-blocks-monorepo.php` autoloader is an optional
convenience for local development: on `plugins_loaded` it includes
`<dir>/<dir>.php` for every directory that has a `build/`. In production, each
plugin is installed and runs on its own — the monorepo is a development and release
container, not a runtime dependency.

## Decision: no npm workspaces; one `package.json` + `package-lock.json` per package

There are **no npm workspaces** here. Every plugin directory has its own
`package.json`, its own committed `package-lock.json`, and (during development) its
own `node_modules`. There is no root workspace manifest, no dependency hoisting, and
no shared root `node_modules` for the plugins. This is deliberate, and it surprises
people arriving from a workspaces monorepo (Turborepo/Nx/Lerna/`npm workspaces`).

### Context

Tooling already assumes per-package isolation:

- `.github/workflows/make-plugin-release.yml` builds each changed plugin with
  `npm ci --prefix <dir> && npm run build --prefix <dir>` and zips **just that
  directory** as the release artifact.
- `.scripts/build-all.js` runs `npm install && npm run build && rm -rf node_modules`
  **inside each plugin directory** in turn.
- The PR CI (`pr-lint.yml`, `pr-build.yml`) lints and builds per changed directory
  using the same `--prefix <dir>` pattern.

### Rationale

- **Independent dependency and tooling versions.** Each plugin pins its own
  `@wordpress/scripts` (and therefore its own webpack/Babel/ESLint toolchain) and
  any runtime deps. A stable plugin can stay on an older toolchain while a new one
  adopts the latest — upgrades are decoupled, not lockstep. Workspaces push toward a
  single hoisted version of each dependency, which is the opposite of what we want.
- **Self-contained release artifacts.** A release is a single plugin directory
  zipped as-is. With per-package lockfiles and no hoisting, `npm ci --prefix <dir>`
  reproduces exactly that plugin's dependency tree; nothing lives in a root
  `node_modules` that the zip would miss.
- **Low-friction contribution.** A contributor installs and builds only the one
  plugin they are touching (`cd <dir> && npm ci`) — no root install of every
  plugin's dependencies.
- **Trivial extraction.** Because a plugin is fully self-describing (its own
  manifest + lockfile), it can be lifted out into a standalone repository with no
  dependency detangling.

### Consequences / trade-offs

- `node_modules` is duplicated across plugins during development; there is no
  cross-package dedup or hoisting.
- No workspace-level local linking between packages — but plugins here are
  intentionally project-agnostic and don't depend on one another.
- Each plugin's `package-lock.json` is maintained on its own. Keep it in sync with
  `package.json` (run `npm install` after changing dependencies and commit the
  lockfile) — `npm ci` in CI and releases will fail on an out-of-date lockfile.
- CI installs dependencies per changed package; the changed-files matrix scopes this
  to only the directories a PR actually touches, so the cost stays proportional.

### When this would change

If plugins ever needed to share substantial internal JavaScript (a common
components/utilities package consumed by several blocks), workspaces would become
worth reconsidering. Today they don't: each block is self-contained and styled by
the consuming project, so the isolation above is a net win.
