# Changelog

All notable changes to this project will be documented in this file.

## 0.5.0 - Unreleased

### Added

- **Headings to include** setting: choose which heading levels (H1–H6) the table of contents lists. All levels are selected by default, so existing blocks are unchanged. The editor now previews the real list of headings instead of placeholder entries.
- **Custom titles**: with **Enable Custom titles** turned on, each entry in the editor preview gets an **Edit Title** link for a shorter table of contents label. The title is stored as a `customTitle` attribute in the heading's block comment and added to the rendered heading as `data-toc-title`; it is never saved into the heading's HTML, so headings stay valid if the plugin is deactivated.
- New `a8csp_dynamic_table_of_contents_allow_custom_titles` filter. Returning `false` hides the custom title controls in the editor and makes the table of contents use the heading text on the frontend.

## 0.4.0 - 2026-07-01

### Added

- Per-heading opt-out: adding the `hide-from-toc` CSS class to a heading — or to any block wrapping it, such as a Group or Column — keeps that heading (or every heading in that section) out of the table of contents. The class check runs on the frontend via `element.closest()`.
- New `a8csp_dynamic_table_of_contents_exclude_selectors` filter to customize which selectors exclude a heading. It receives the default selectors, the block attributes, and the block object, and must return an array of selectors that the view script tests each heading against.

## 0.3.0 - 2026-06-26

### Added

- New **Include headings nested in other blocks** toggle (off by default). When enabled, the table of contents also lists headings rendered by wrapper blocks such as accordions, which split their title across child elements and never receive a server-side anchor. The view script generates an anchor for each such heading from its text and links to it.

### Fixed

- Heading labels no longer include decorative, `aria-hidden` icons (for example an accordion toggle's `+`/`-` marker), so entries read as the heading text alone.
- The scroll-spy `IntersectionObserver` no longer throws when a heading has no matching table-of-contents link.

## 0.2.0 - 2026-04-27

### Added

- New `a8csp_dynamic_table_of_contents_heading_selectors` filter to customize which headings appear in the rendered table of contents. The filter receives the default selectors, the block attributes, and the block object, and must return an array of selectors that the view script will query against.
