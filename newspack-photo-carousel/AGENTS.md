# Newspack Photo Carousel agent guide

A single-block plugin in the special-projects-blocks-monorepo: `newspack/photo-carousel`. Behaviour, settings and filters are documented in `readme.txt`; monorepo rules are in the root `CONTRIBUTING.md`.

## Gotchas

- **Build before use.** The block registers from `build/blocks-manifest.php`, and the root autoloader only loads plugins that have `build/`. `build/` is git-ignored output from `npm run build`.

- **`render.php` is a wrapper.** It is included on every render, so it only calls `newspack_photo_carousel_render_block()`. The render logic and helpers live in `includes/render-helpers.php`, loaded once by the main file; defining functions in `render.php` would redeclare them on the second carousel.

- **Two editor scripts.**
  - `src/photo-carousel/index.js` (the block's `editorScript`) registers the block and the caption HOC on `core/image`. Core loads a block's editor script in every editor.
  - `src/credits/index.js` builds separately to `build/credits/` (`npm run build:credits`, run by `build`) and holds the credit box, `attachment-save.js` and the credit preview. PHP enqueues it only while Newspack is active.
  - The block asks for credits through the JS filter `newspackPhotoCarousel.slideCredit` (`src/editor/credit-provider.js`): no provider means no Show credits toggle and no preview. Never import from `src/credits` in the block bundle, or the credit code ships to every site again.

- **The render ignores `$content`.**
  - It reads each child `core/image`'s `inner_html`, because `url`, `alt` and `caption` are HTML-sourced and never hydrated server-side.
  - Echoing `$content` would bring back the image's link and lightbox, and Newspack's `render_block` credit would print twice.

- **Stacked slides defeat `loading="lazy"`.**
  - All slides share one grid cell, so all count as in view. The loading window works by setting `hidden` on slides outside it.
  - `getSlideWindow()` (`slide-window.js`) and the initial window in `newspack_photo_carousel_render_block()` (`[ 0, 1 % $count, $count - 1 ]`) must agree.

- **Credits load only with Newspack.**
  - `newspack_photo_carousel_load_credits()` requires `includes/class-newspack-photo-carousel-credits.php` on `init` (priority 5) only when `Newspack\Newspack_Image_Credits::get_media_credit_string()` exists. Nothing else may reference that class.
  - The render gets credits only through the `newspack_photo_carousel_slide_credit` filter (default `''`); the class adds Newspack's markup at priority 5.
  - Never register the `_media_credit*` meta here; Newspack owns those keys. The class's REST auth filter exists because Newspack registers them without an `auth_callback`.
  - `window.newspackPhotoCarousel` (Newspack's credit label and class) is printed before the credits script, so its module-level reads are safe. The block bundle checks for a provider at render time instead, because the two scripts' print order isn't fixed.

- **The panels are scoped to carousel images.** The caption and credit HOCs check the parent block with `useIsCarouselImage()`. Don't widen them to every `core/image`: other sites' images must stay untouched.

- **The Content tab needs WordPress 7.0.** `InspectorControls group="content"` doesn't exist below that, which is why the header says `Requires at least: 7.0`.

- **Two hard-coded caps must match.** The `@for 0 through 49` loop in `editor.scss` and `MAX_IMAGES = 50` in `edit.js`.

- **Credit edits are saved by `attachment-save.js`.** Core saves attachments only from the multi-entity save dialog, so `editor.preSavePost` saves them, skipping autosaves.
  - It sends only the changed credit keys (`saveEntityRecord` with `{ id, meta }`), never `saveEditedEntityRecord`.
  - The merged `meta` edit carries every registered key. REST refuses protected keys without an `auth_callback` (Newspack's `_navis_media_can_distribute`, and other plugins' keys), and that fails the whole save.

- **No tests by decision.**

## Conventions

- **Prefixes:** `newspack_photo_carousel_` for functions and hooks, `Newspack_Photo_Carousel*` for classes. Text domain `newspack-photo-carousel`.
- **PHP:** the root `.phpcs.xml` (team51 ruleset: WordPress-Extra, long `array()` syntax, full docblocks).
- **JS/CSS:** `@wordpress/scripts` defaults only. Don't add per-plugin `.eslintrc`/`.prettierrc`/`.stylelintrc` files.
- **CSS:** BEM on the block class (`.wp-block-newspack-photo-carousel__*`). Colours and type go theme preset, then classic Newspack theme variable, then `newspack-colors` value. Keep the styles minimal and structural; the block must render un-broken in the latest `twenty-*` theme.
- **Tokens:** copy any new `newspack-colors` token into `_newspack-tokens.scss`. Don't `@use "newspack-colors"`: it prints its `:export` map into the CSS.
- **Comments:** one line for a non-obvious *why*, at most about three lines; never restate the code.
- **Releases:** bump the header `Version:`, `readme.txt` Stable tag and both changelogs together; the release workflow tags `newspack-photo-carousel@<header version>`.

## Commands

```bash
npm ci && npm run build      # block + credits; watch with npm start / npm run start:credits
npm run lint:js && npm run lint:css
npm run format
# PHPCS, from the monorepo root:
composer run-script packages-install
vendor/bin/phpcs --standard=.phpcs.xml newspack-photo-carousel
```
