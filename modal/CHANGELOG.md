## 0.1.6 (2026-11-25)

### Fixed

-   On a page served by a block template, the modals are no longer printed when it shows no Modal button. A search results page or archive that lists titles and excerpts printed every modal, unstyled, below the footer when its first post contained a Modal button: `has_block()` matched that first post, and the block's styles only load where the block renders.

## 0.1.5 (2026-10-09)

### Removed

-   Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.1.4 (2026-09-26)

### Fixed

-   Modal Description field in the block sidebar now uses `TextareaControl` instead of `PlainText`, giving it the same visible input styling (border/background) as the Modal Title field. Previously it was visually indistinguishable from its own label, so editors couldn't tell it was editable.

## 0.1.3 (2026-08-26)

### Fixed

-   Replace deprecated `data-wp-on-async-document` with `data-wp-on-document` and `withSyncEvent()` for outside-click handling.

## 0.1.2 (2025-10-21)

### Fixed

-   Prevent modal from being displayed on password protected posts.

## 0.1.1 (2025-08-02)

### Added

-   Update URI
