## 0.3.0 (2026-10-21)

### Added

-   "Open on hover" setting. When it is on, a mouse pointer opens the panel on its item, and the panel closes 120ms after the pointer leaves the item and the panel. Clicking a panel opened on hover keeps it open. Hover is ignored on touch screens and inside the open Navigation overlay; click and keyboard work as before (#226).

### Fixed

-   Opening a panel inside the open Navigation overlay at 600px and wider no longer collapses the overlay into the header. In the overlay the panel opens in the flow of the menu, below its button, as it does on small screens (#223).
-   The toggle button takes the navigation's font family, weight, line height, letter spacing and text transform, and no longer turns grey (`#ccc`) when open. The button reset no longer reaches buttons inside the panel (#224).
-   Images in a closed panel no longer use up WordPress's eager-loading threshold or take `fetchpriority="high"`, so the page's own first-screen image is no longer lazy-loaded. Panel images get `fetchpriority="low"`, as core gives images in the Navigation overlay. The new `a8csp_mega_menu_panel_image_attributes` filter can lazy-load them instead (#225).

## 0.2.3 (2026-10-09)

### Removed

-   Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.2.2 (2025-08-02)

### Added

-   Update URI.

## 0.2.1 (2025-04-09)

### Fixed

-   Ensure ESC key consistently closes mega menu regardless of focus position within the menu overlay.

## 0.2.0 (2025-02-27)

### Fixed

-   Update styles so the full width menu works when center or right aligned, as well as left aligned in the header.
-	Update view.js so that if a user clicks outside the mega menu it closes.
