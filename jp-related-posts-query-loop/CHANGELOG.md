## 0.2.1 (2026-09-28)

### Fixed

-   The related posts query filter could leak onto the next Query Loop block on the page when the related posts block rendered without a post template.
-   Guard against zero or negative post counts in the related posts query.

### Changed

-   Removed the unused `query_type` attribute from the block variation.
-   Readme documents the available settings, the fallback behaviour, and that Jetpack is optional.

## 0.2.0

### Fixed incorrect post ID check and incorrect post_type attribute

## 0.1.0 (2025-11-12)

### Initial release
