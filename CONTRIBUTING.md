# Contributing

Thanks for contributing to the WordPress.com Special Projects Blocks Monorepo. This
guide is the canonical, repo-level reference. Longer-form background lives in the
[project wiki](https://github.com/a8cteam51/special-projects-blocks-monorepo/wiki).

- [Before you start: do you actually need a new block?](#before-you-start-do-you-actually-need-a-new-block)
- [How the monorepo works](#how-the-monorepo-works)
- [Local setup](#local-setup)
- [Creating a new block](#creating-a-new-block)
- [Updating an existing block](#updating-an-existing-block)
- [Coding standards](#coding-standards)
- [Submitting a pull request](#submitting-a-pull-request)
- [Releases and auto-updates](#releases-and-auto-updates)

## Before you start: do you actually need a new block?

The gold standard for block development is **not creating a new block**. Every block
we add is maintenance we carry forever. Before proposing one, confirm the need can't
be met with tools that already exist:

- **Patterns** — for reusable layouts of existing blocks.
- **The Block Bindings API** — for binding block attributes to dynamic data.
- **The Interactivity API** — for front-end interactivity on existing blocks.
- **Block styles / variations / filters** — for restyling or extending core blocks.

See [How to extend a WordPress block](https://developer.wordpress.org/news/2024/08/15/how-to-extend-a-wordpress-block/).
If a new block is genuinely required, open a **New block proposal** issue first so an
engineering lead can sign off before development starts.

## How the monorepo works

- Each top-level directory is an **independent, separately-releasable plugin**. There
  are no npm workspaces — you work inside one plugin directory at a time.
- The root `special-projects-blocks-monorepo.php` is an optional autoloader. On
  `plugins_loaded` it includes `<dir>/<dir>.php` **only for directories that contain a
  `build/` directory**. Running `npm run build` in a plugin is what makes it load.
- `.github/workflows/make-plugin-release.yml` cuts a GitHub release for each changed
  top-level directory on pushes to `trunk`. The release tag is
  `<dir>@<plugin-header-version>` and the release body is that plugin's `readme.txt`.
- `.utilities/class-wpcomsp-blocks-self-update.php` is the shared self-update class
  copied into each plugin.

See the [README](./README.md) for the full plugin inventory.

## Local setup

The monorepo is designed to be cloned into the `wp-content/plugins/` directory of a
local WordPress install:

1. Clone this repository into `wp-content/plugins/`.
2. In wp-admin, activate **WordPress.com Special Projects Blocks Monorepo Autoloader**.
3. For each plugin you want to work on:
   ```sh
   cd <plugin-directory>
   npm ci
   npm run build   # creates build/ — the autoloader now loads this plugin
   npm run start   # development build with file watching
   ```

For PHP coding standards, install the root Composer dependencies once:

```sh
composer run-script packages-install
```

## Creating a new block

Scaffold from the **monorepo root**:

```sh
npm run new-block -- <plugin-slug> "Block Title" [--dynamic]
```

This wraps `@wordpress/create-block` (pinned, `--namespace a8csp`) and then applies all
the monorepo conventions for you, so a new package starts correct rather than being
hand-patched. It sets up:

- the `a8csp` namespace and a matching `<plugin-slug>/<plugin-slug>.php` entry file;
- the canonical plugin header (Author, Author URI, `Update URI`, GPL-2.0-or-later,
  Text Domain);
- the shared self-update class in `classes/` plus the `wpcomsp_installed_blocks` wiring;
- a non-boilerplate `readme.txt` (with a "Building from source" section) and a
  `CHANGELOG.md`.

Use `--dynamic` for a server-rendered block (`render.php`); omit it for a static
(`save.js`) block.

You still own the block itself — fill in the source and follow these rules:

- **Keep blocks project-agnostic.** No project names, data, or project-specific styling.
- **One block plugin per directory.** The only exception is tightly-coupled block
  families (e.g. a `tabs` container with its child `tab` block).
- **Keep styling minimal and structural.** Blocks should read like wireframes and
  render un-broken in the latest `twenty-*` theme. Ship structural CSS only; project
  styling belongs in the project via
  [block stylesheets](https://developer.wordpress.org/themes/features/block-stylesheets/).
  Block-level style *controls* (e.g. colour controls) are fine.
- **Add PHP filters generously** for dynamically-rendered output — think about the next
  developer reusing this block in their project.
- **Write verbose plugin and `block.json` descriptions.** These are reused in automated
  tooling, so be clear and specific.
- **Add a `screenshot.png`** (1200×800) at the plugin root showing the block's purpose.
  This is used in automated tooling.
- **Use `counter` and `table-plus` as reference plugins** for structure and `readme.txt`.

## Updating an existing block

Blocks here can be installed on many sites, so changes must benefit all users — not
just your current project. Project-specific styles and data go in the project, not the
block.

- **Static blocks:** if you change `edit`/`save` output, add a
  [block deprecation](https://developer.wordpress.org/news/2023/03/10/block-deprecation-a-tutorial/)
  so existing content doesn't break.
- **Dynamic blocks:** no deprecation needed, but reason carefully about how the change
  affects sites already using the block.
- **Test an upgrade path:** verify on `trunk` first, then switch to your branch to
  simulate a plugin update, in the latest `twenty-*` theme.

If you need a list of Special Projects sites using a block to test against, ask an
engineering lead.

## Coding standards

- **PHP:** PHPCS with WordPress-Extra plus our extras, via the root `.phpcs.xml`:
  ```sh
  vendor/bin/phpcs --standard=.phpcs.xml <plugin-directory>
  ```
- **JS/CSS:** the tools provided by
  [`@wordpress/scripts`](https://www.npmjs.com/package/@wordpress/scripts). Each plugin
  exposes:
  ```sh
  npm run lint:js
  npm run lint:css
  npm run format
  ```
  Do **not** add per-plugin `.eslintrc`/`.prettierrc`/`.stylelintrc` files — `wp-scripts`
  ships the shared config we rely on.

## Submitting a pull request

`trunk` is protected; every PR is reviewed. Before opening one:

1. Your PR represents a **single block plugin** (block-family exception aside).
2. PHP passes **PHPCS + WPCS** against `.phpcs.xml`.
3. JS/CSS is **linted and formatted** with `@wordpress/scripts`.
4. You've **tested in the latest `twenty-*` theme**, and added deprecations for any
   static-block `edit`/`save` changes.
5. Bump the plugin header `Version:` and add a `CHANGELOG.md`/`readme.txt` changelog
   entry when releasing changes — the release workflow reads the **PHP header version**.

## Releases and auto-updates

Releases are automatic on merge to `trunk` (see [How the monorepo works](#how-the-monorepo-works)).
To make a plugin self-update on installed sites:

1. Add the update URI to the plugin header so its hostname matches the update filter:
   ```
   Update URI: https://opsoasis.wpspecialprojects.com/<plugin-slug>/
   ```
2. Copy `.utilities/class-wpcomsp-blocks-self-update.php` into the plugin's `classes/`
   directory and wire it up in the entry PHP file:
   ```php
   // If no other WPCOMSP block plugin already loaded the self-update class, load it.
   if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
       require __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

       $wpcomsp_blocks_self_update = WPCOMSP_Blocks_Self_Update::get_instance();
       $wpcomsp_blocks_self_update->hooks();
   }

   add_filter(
       'wpcomsp_installed_blocks',
       function ( $blocks ) {
           $blocks[] = '<plugin-slug>'; // enables auto-updates for this plugin.
           return $blocks;
       }
   );
   ```

Registering the slug on the `wpcomsp_installed_blocks` filter keeps auto-updates working
even when a site has several monorepo plugins installed.
