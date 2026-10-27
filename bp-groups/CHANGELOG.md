# Changelog

All notable changes to this project will be documented in this file.

## 0.2.3

### Fixed

- PHP notice on group pages ("Object of class BP_Groups_Group could not be converted to int"): the current group is now checked with `instanceof` instead of being compared with an integer.
- The Progress Bar fill was transparent on themes without a `primary` palette colour. It now falls back to the block's text colour.

## 0.2.2

### Removed

- Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.1.0

### Added

- BuddyPress-gated blocks for group lists, contributors, progress bars, and group variations, plus the `buddypress/v1/group-types` REST route and group block bindings.
