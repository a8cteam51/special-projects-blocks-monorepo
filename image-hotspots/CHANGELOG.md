# Changelog

All notable changes to this project will be documented in this file.

## 0.1.0

### Added

-   Image Hotspots block (`a8csp/image-hotspots`): an image from the media library with Hotspot blocks placed on it, cards opening on click or hover, built with the Interactivity API.
-   Hotspot block (`a8csp/image-hotspot`): one marker button at `x`/`y` percentages of the image, with a required label, a marker point (center or pin tip), a card position, and a card of any blocks.
-   Editor: add hotspots by clicking the image (Add hotspot, or Alt/Option-click), from the sidebar or with the keyboard; drag markers or nudge them with the arrow keys; hotspots listed by label in List View and numbered in the editor; the selected hotspot's card shown in place; Show all cards.
-   Front end: disclosure buttons with `aria-expanded` and `aria-controls`; one card open at a time; Escape, outside click and focus leaving close it; cards kept inside the image, flipped at the edges, and shown below the image when they fit nowhere; reduced motion respected.
-   Filters for the image, the context, the marker's attributes and content, the card's attributes and each hotspot's markup.
-   Card bounds: **Keep cards inside the image** (the `cardBounds` attribute, `image` or `page`). With `page`, cards may extend past the image up to the nearest ancestor that clips overflow, or the document, within the viewport's width. A theme can override it with `--a8csp-image-hotspots-card-bounds`.
-   Callout tail offsets: a placed card carries `--a8csp-image-hotspots-card-marker-x` and `-y`, the marker's center from the card's top-left corner.
-   Editor: the label field sits in a tag beside the marker, outside the card, so that the editor places cards exactly as the page does.
