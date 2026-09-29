# Changelog

All notable changes to this project will be documented in this file.

## 0.2.0

### Added

- Transform the Tabs block into the core Tabs block from the block toolbar. Tab titles, tab order, panel content, anchor, and alignment carry over. Bold and italic in a tab title are kept, but a link is reduced to its text because the core tab list does not accept links. A title with no text falls back to `Tab 1`, `Tab 2`, and so on.

### Changed

- Document that the core Tabs block supersedes this one from WordPress 7.1. The block stays in the inserter, and existing content keeps rendering and stays editable.

## 0.1.3

### Fixed

- Keep the selected tab control focusable so keyboard users can enter and navigate the tablist.

## 0.1.2

### Added

- Tabs and Tab blocks for organizing content into keyboard-navigable tabbed sections.
