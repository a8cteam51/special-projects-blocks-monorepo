# Changelog

## 1.1.1 (2026-02-25)

### Breaking

- Rename plugin slug from `carousel` to `a8csp-carousel` to avoid conflict with an unrelated WordPress.org plugin flagged as vulnerable by security scanners.
- Rename block namespace from `wpcomsp` to `a8csp` (block names, context keys, CSS classes).
- Update text domain to `a8csp-carousel` throughout.

### Added

- Filterable item count resolvers (`a8csp.carousel.itemCountResolvers`) for third-party carousel tracks.
- Support for third-party blocks as carousel tracks via the `blocks.registerBlockType` filter.
- Developer documentation (`EXTENDING.md`) for extending the carousel with custom blocks.
- ESLint configuration for the carousel directory.
- Home/End keyboard navigation.
- `has-overflow-both` CSS clip-path rule.

### Fixed

- `--item-gap` CSS variable producing invalid values for non-preset gaps.
- Phantom `render.php` reference in block.json.
- Dead `pagination` attribute write and unused `dragState` property.
- `paginationButtons` NodeList truthy checks (NodeList is always truthy).
- `mousedown` `preventDefault` blocking text selection during drag.
- Front-end i18n for dynamically created pagination buttons.
- `ensurePaginationButtons` now works when starting from zero buttons.
- WooCommerce Product Collection variation handling.
- Copy-paste error in carousel-pagination common.js comment.

### Changed

- Carousel Nav icon changed from `code` to `controls-back`.
- Removed unused `$plugin_data` call in carousel.php.

## 0.1.1 (2025-05-01)

### Added

- Carousel Navigation and Carousel Pagination refactored as inner blocks with their own controls for colors, sizes, borders, and custom icons.
- Layout support for the carousel block.
- Infinite scroll mode and end behavior control.
- Drag/swipe navigation.
- Animation speed control.
- Screen reader title support.
- Pagination button state handling.
- Left, right, and both overflow visibility options.
- Track height control for gallery carousels.
- Custom icon upload for navigation buttons.
- Common carousel track selector.
- Front-end `--item-count` CSS variable accuracy.

### Fixed

- Sticky post handling in item count logic.
- Clip path on overflow right rule.
- Product Collection block selector.
- Track container name.
- Focus management during slide animations.
- Non-visible slide children removed from tab order.
- Column gap handling.
- Grid area style selectors.
- Transition listener cleanup.

### Changed

- Major view script refactor for better infinite mode handling.
- Updated Author URI and Update URI.

## 0.1.0 (2025-04-07)

- Initial release with Images, Posts, Cards, and Products carousel variations.
- Front-end carousel functionality with keyboard and drag navigation.
- PHP server-side rendering.
