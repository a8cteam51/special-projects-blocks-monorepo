# Changelog

## 0.1.0

### Added
- Dynamic shape controls (vertical offsets/insets, horizontal insets) for Group, Cover, Image, and Featured Image blocks.
- SVG clip-path generation from shape data, border radius, and block dimensions.
- Border rendering via overlay span with doubled SVG stroke trimmed by clip-path.
- Drop shadow support using `filter: drop-shadow()` that follows the clipped shape.
- Spacing preset support for shape offset/inset values.
- Padding calculation for non-image blocks to account for shape offsets and border width.
- MutationObserver for asynchronously loaded blocks, ResizeObserver for responsive updates.
- Editor controls with preset slider and custom pixel input per corner.
- Caption stripping for image blocks (clipped shapes don't support captions).
- Extensible block support via `a8csp_dynamic_shapes_blocks` filter.

### Architecture
- `--clip-path` custom property set by JS on the block; CSS/inline styles apply it to the correct elements per block type.
- Image blocks clip visual children individually so `filter: drop-shadow()` on the figure follows the clipped shape.
- Non-image blocks clip the block element directly.
- Editor uses `::before` pseudo for clipped backgrounds, `::after` pseudo for clipped border overlay.
- Front end uses PHP-injected `<span>` for border overlay with inline styles.
- Border color resolved from theme palette (hex) since CSS variables don't work in inline SVG data URIs.
