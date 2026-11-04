# Changelog

All notable changes to this project will be documented in this file.

## 0.1.2

### Fixed

- The block stylesheet targeted `.wp-block-a8csp-breadcrumbs-block`, but the block's wrapper class is `.wp-block-a8csp-breadcrumbs`, so none of its rules applied. The trail is now a wrapping flex row, and a `0.25em` column gap replaces the spaces between crumbs and separators, which flex layout drops. The editor preview, which had no space between items, now matches the front end.
- PHP notice on pages ("Object of class WP_Post could not be converted to int"): the page is now checked with `instanceof` instead of being compared with an integer.

## 0.1.1

### Removed

- Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.1.0

### Added

- Breadcrumb navigation blocks for BuddyPress and bbPress, covering archive and singular contexts.
