## 0.1.6 (2026-10-27)

### Fixed

-   A Modal button in a template part (such as the header or footer) or a Navigation block now opens its modal on pages whose content has no Modal block. The modal templates are output whenever a Modal button renders, not only when the post content contains one.
-   A Modal button with an extra CSS class (e.g. `wp-element-button`) no longer closes its modal on the click that opens it.
-   Clicking the backdrop beside modal content that is narrower than the screen now closes the modal. Clicks on content (text, media, controls, or anything with a background, border or shadow) still don't.
-   The modal starts below the admin bar for logged-in users, so the close button is no longer covered by it.

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
