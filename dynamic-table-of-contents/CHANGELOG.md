# Changelog

All notable changes to this project will be documented in this file.

## 0.3.0 - 2026-06-26

### Added

- New **Include headings nested in other blocks** toggle (off by default). When enabled, the table of contents also lists headings rendered by wrapper blocks such as accordions, which split their title across child elements and never receive a server-side anchor. The view script generates an anchor for each such heading from its text and links to it.

### Fixed

- Heading labels no longer include decorative, `aria-hidden` icons (for example an accordion toggle's `+`/`-` marker), so entries read as the heading text alone.
- The scroll-spy `IntersectionObserver` no longer throws when a heading has no matching table-of-contents link.

## 0.2.0 - 2026-04-27

### Added

- New `a8csp_dynamic_table_of_contents_heading_selectors` filter to customize which headings appear in the rendered table of contents. The filter receives the default selectors, the block attributes, and the block object, and must return an array of selectors that the view script will query against.
