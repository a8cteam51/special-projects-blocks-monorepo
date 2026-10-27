## 0.1.3 (2026-10-27)

### Fixed

-   Decimal start and end values animate at their precision instead of in whole numbers, so a counter to 99.9 no longer counts to 100 and then drops to 99.9 (#251).
-   Decimal durations are no longer truncated: 1.5 seconds lasts 1.5 seconds, and durations under a second animate instead of jumping to the end value (#252).
-   The readme's Developers section names the classes the block outputs (#253).
-   The readme's Stable tag matches the plugin version (#254).

## 0.1.2 (2026-10-09)

### Removed

-   Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.1.1 (2025-08-02)

### Added

-   Update URI