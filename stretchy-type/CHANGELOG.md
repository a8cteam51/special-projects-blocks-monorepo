## 0.1.6 (2026-10-27)

### Fixed

-   Opening a post that contains the block no longer marks it as having unsaved changes. The editor now syncs the block's `viewBox` only when the measured size has changed, and doesn't record the sync as an edit of its own (#243).

## 0.1.5 (2026-10-09)

### Removed

-   Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.1.4 (2026-09-28)

### Fixed

-   Disable "Edit as HTML" so the block's markup can't be hand-edited into a shape the front-end resizing no longer recognises.
-   The front-end script now also initialises when it loads after `DOMContentLoaded` has already fired.

### Added

-   Settings section in `readme.txt` and a `screenshot.png`.

## 0.1.2  (2025-08-02)

- Fixed front-end class not applying.

## 0.1.1 (2025-08-02)

### Added

-   Update URI
