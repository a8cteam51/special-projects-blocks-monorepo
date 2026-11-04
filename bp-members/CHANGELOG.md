# Changelog

All notable changes to this project will be documented in this file.

## 0.1.2

### Fixed

- The Members List block requested `/buddypress/v1/member-types` on every render in the editor, so requests continued for as long as the post was open. It now fetches the member types once per block.

## 0.1.1

### Removed

- Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.1.0

### Added

- BuddyPress-gated member list and member variation blocks, plus the `buddypress/v1/member-types` REST route and member block bindings.
