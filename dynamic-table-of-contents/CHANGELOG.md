# Changelog

All notable changes to this project will be documented in this file.

## 0.5.0 - 2026-10-21

### Added

- Heading level settings: six **Include H1 headings** to **Include H6 headings** toggles in the block's Settings panel choose which heading levels the table lists. The Settings panel is now a tools panel, so each setting can be reset from its menu. They're stored as the `includeH1` to `includeH6` attributes, all on by default, so existing blocks keep listing every level. The `a8csp_dynamic_table_of_contents_heading_selectors` filter now receives only the enabled levels, and still has the last word. With no levels enabled the block renders nothing, rather than falling back to every level.
- **Hide from table of contents** toggle on the Heading block, in its own "Table of contents" panel. It adds or removes the existing `hide-from-toc` class, so headings that already have the class show the toggle switched on and saved markup doesn't change.

## 0.4.1 - 2026-10-09

### Removed

- Self-update mechanism. Updates are now installed manually from GitHub releases.

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
