# WordPress.com Special Projects Blocks Monorepo

This repository is a WordPress plugin monorepo for WordPress.com Special
Projects block plugins and block-adjacent editor/front-end extensions. It
contains a root autoloader plus independently releasable plugin folders.

Additional project documentation may live in the
[repository wiki](https://github.com/a8cteam51/special-projects-blocks-monorepo/wiki).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to set up, build, and submit changes,
and the [wiki](https://github.com/a8cteam51/special-projects-blocks-monorepo/wiki) for
longer-form process docs.

## What is here

- `special-projects-blocks-monorepo.php` is an optional root plugin autoloader.
  On `plugins_loaded`, it scans each top-level directory and includes
  `<directory>/<directory>.php` only when that directory also has a `build/`
  directory.
- Each plugin directory has its own plugin header file, `package.json`,
  `package-lock.json`, `readme.txt`, and usually `src/` block or asset sources.
- `.scripts/build-all.js` is the root build helper used by `npm run build`. It
  finds plugin `src/` directories, runs each plugin build, and removes
  `node_modules` after each build.
- `.github/workflows/make-plugin-release.yml` creates GitHub releases for
  changed top-level plugin directories on pushes to `trunk`.
- `.utilities/class-wpcomsp-blocks-self-update.php` is the shared self-update
  class copied into plugin directories.

## Plugin inventory

| Directory | Tracked plugin evidence |
| --- | --- |
| `bp-breadcrumbs` | `BuddyPressBreadcrumbs`; registers `a8csp/breadcrumbs` for BuddyPress, bbPress, archive, and singular breadcrumbs. |
| `bp-groups` | `BP Groups Blocks`; BuddyPress-gated blocks for group lists, contributors, progress, and variations. Adds `buddypress/v1/group-types`, group block bindings, and a filter-gated group progress extension. |
| `bp-members` | `BP Members`; BuddyPress-gated member list and variation blocks. Adds `buddypress/v1/member-types` and member block bindings. |
| `counter` | `Counter`; registers the `wpcomsp/counter` animated counter block. |
| `cover-bg-crossfade` | Adds the `a8csp-cover-bg-crossfade` style for `core/cover` and front-end crossfade assets. No `block.json` is tracked. |
| `dynamic-table-of-contents` | Registers `wpcomsp/dynamic-table-of-contents` and adds missing IDs to rendered heading blocks. |
| `exclude-duplicates-from-query-loops` | Extends `core/query` behavior with an editor asset and an `exclude_previous_posts` query flag. No `block.json` is tracked. |
| `featured-image-captions` | Extends `core/post-featured-image` with editor caption controls and front-end captions. No `block.json` is tracked. |
| `featured-video` | Extends `core/post-featured-image`; stores `_wpcomsp_featured_video_id` and `_wpcomsp_featured_video_options` post meta for post types with thumbnail support. |
| `flowing-column` | Registers the `a8csp/flowing-column` layout block. |
| `jp-related-posts-query-loop` | Adds a Related Posts variation for `core/query`, using Jetpack related posts when available and falling back to random posts. |
| `light-dark-toggle` | Registers the `wpcomsp/light-dark-toggle` block. |
| `mega-menu` | Registers `a8csp/mega-menu`, adds a `menu` template part area, and allows the block in Navigation blocks. |
| `modal` | Registers `a8csp/modal`, adds a `modal` template part area, and stores modal template metadata in the `modal_meta` option exposed through REST settings. |
| `override-post-links` | Registers `wpcomsp/override-post-links`, stores `wpcomsp_news_data` post meta for filtered post types, rewrites core post links, and registers the `wpcomsp/news-link-source` block binding. |
| `reactions` | Registers `wpcomsp/reactions` and `wpcomsp/reaction`; creates the `wpcomsp_reactions` table, adds `wpcomsp-reactions/v1/react` and `/get-reaction` REST routes, and provides an admin DataViews page. |
| `scroll-progress-bar` | Registers `a8csp/scroll-progress-bar`. |
| `scroll-to-top` | Registers `wpcomsp/scroll-to-top`. |
| `sibling-pages-list` | Registers `wpcomsp/sibling-pages-list`. |
| `stretchy-type` | Registers `wpsp/stretchy-type`. |
| `table-plus` | Registers `wpcomsp/table-plus`, `wpcomsp/table-plus-row`, and `wpcomsp/table-plus-cell`; includes a PHP renderer, PHPUnit tests, and a WordPress Playground blueprint. |
| `tabs` | Registers `wpcomsp/tabs` and `wpcomsp/tab`. |
| `videopress-download` | Registers `wpcomsp/videopress-download` for adding a download button near VideoPress videos. |

No tracked PHP registers custom post types, taxonomies, shortcodes, or WP-CLI
commands.

## Requirements

- Node.js `>=18.0.0` and npm `>=8.0.0` are declared in the root
  `package.json`.
- The root `composer.json` requires PHP `>=7.4` and `ext-json`; the root
  autoloader plugin header requires WordPress `6.1` and PHP `8.0`.
- Individual plugin headers vary. Check the target plugin header and
  `readme.txt`; tracked plugin requirements range from WordPress `6.1` to
  `6.8` and PHP `7.0` to `8.0`.
- Most plugin builds use `@wordpress/scripts`. Some plugins also depend on
  BuddyPress, bbPress, Jetpack related posts, VideoPress, or the WordPress
  Interactivity API based on their tracked PHP and block metadata.

## Local development

There are no npm workspaces declared. Work in the plugin directory you are
changing unless you specifically need the root all-plugin build.

```sh
cd <plugin-directory>
npm ci
npm run start
npm run build
```

Most plugin manifests also define `format`, `lint:js`, `lint:css` or
`lint:styles`, `packages-update`, and `plugin-zip`; use the target plugin's
`package.json` for the exact script names.

The root build is marked for CI use in `package.json`:

```sh
npm ci
npm run build
```

For PHP coding standards, install the root Composer dependencies and run PHPCS
with the tracked ruleset:

```sh
composer run-script packages-install
vendor/bin/phpcs --standard=.phpcs.xml .
```

`table-plus` also has a plugin-local Composer test harness:

```sh
cd table-plus
composer install
composer test
```

To load the monorepo during local WordPress development, activate the root
autoloader plugin after building the plugin directories you need. The autoloader
does not include plugin folders that are missing `build/`.

## Releases and updates

Releases are driven by `.github/workflows/make-plugin-release.yml` on pushes to
`trunk`. The workflow detects changed top-level directories, installs npm
dependencies inside each changed plugin, runs that plugin's build, zips the
plugin folder, and creates a GitHub release tagged as
`<directory>@<plugin-header-version>`. The release body comes from that plugin's
`readme.txt`.

Most plugin directories include the `WPCOMSP_Blocks_Self_Update` class and add
their slug to the `wpcomsp_installed_blocks` filter. The self-update class checks
`https://opsoasis.wpspecialprojects.com/wp-json/opsoasis-blocks-version-manager/v1/update-check`
through the `update_plugins_opsoasis.wpspecialprojects.com` update filter.

## Maintenance notes

- Avoid editing generated or dependency output such as `build/`, `node_modules/`,
  `vendor/`, plugin ZIP files, and PHPUnit cache files.
- Keep plugin header versions and `readme.txt` release content intentional; the
  release workflow reads both.
- When adding a new plugin directory, use a matching `<directory>.php` entry
  point and ensure the build produces the `build/` directory expected by the root
  autoloader.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request. It covers the
"do you actually need a new block?" gate, local setup, scaffolding new blocks with the
`a8csp` namespace, coding standards, and the PR checklist. Use the issue templates to
file bug reports, enhancements, or new-block proposals.

## License

The tracked root `LICENSE` file is MIT. Root package metadata, Composer
metadata, and plugin headers declare `GPL-2.0-or-later`; resolve that mismatch
before relying on a single repository-wide license declaration.
