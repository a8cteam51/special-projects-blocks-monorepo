# Changelog

All notable changes to this project will be documented in this file.

## 0.2.1

### Removed

- Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.2.0

### Changed

- Number of Columns is now Maximum columns. Setting it to 0 fits as many columns as the minimum width allows.
- Minimum column width and rule width are single fields with a unit selector.
- Column gap uses the core Block spacing control (horizontal), so theme spacing presets are available.
- Rule color uses the theme palette and defaults to the text color.
- Editor markup now matches the front end, so inner blocks are direct children of the block.

### Removed

- The Minimum Number of Columns setting, which had no effect.

### Fixed

- Blocks using the Groove, Ridge, Inset, or Outset rule style became invalid after reloading the editor.
- The first-child margin reset applied to nested elements instead of only direct children.

## 0.1.0

### Added

- Flowing Column block for newspaper-style multi-column text layouts.
