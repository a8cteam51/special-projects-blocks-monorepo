# Changelog

## 0.1.1 - 2026-07-15

### Fixed
- Front end no longer loads the block editor and media scripts. Editor-only helpers moved from `imports/utils.js` (shared with the front-end `view.js` bundle) to `imports/editor-utils.js`, so `view.asset.php` no longer declares `wp-block-editor` as a dependency.
- Border overlay is now positioned against its own block on the front end. `position: relative` was only supplied by the editor-only `.dynamic-shape-container` wrapper, so the absolutely positioned overlay resolved against a distant ancestor on Image blocks and Group blocks not using a constrained layout.
- Border overlay is now injected before the block's actual closing tag. The closing tag is read from the rendered markup instead of assumed to be `</div>`, which misplaced or dropped the overlay when a Group block used its `tagName` attribute to render as a `section`, `header`, and so on.
- Custom border colors no longer paint a second, spurious border over the SVG stroke. A custom color is saved as an inline `border-color`, which core's `html :where([style*=border-color])` rule turns into a `border-style: solid`; only the palette equivalent's class was being removed.
- Border colors now fall back to the default palette when a theme defines an empty palette, instead of resolving every border to black.
- Editor no longer over-pads bordered blocks. The `--stroke-width` custom property that feeds the padding calc was set to double the authored width (the value the SVG stroke needs), so content was inset by twice the border width; it now matches the single, visible width used on the front end.
- Editor preview padding no longer drifts below the clipped shape for fractional corner offsets. `getMaxOffset()` truncated custom pixel values with `parseInt` (e.g. `12.5px` became `12`), while the clip path keeps the fractional value; it now uses `parseFloat` to match.
- Front-end padding no longer drifts below the clipped shape for fractional corner offsets. `get_dynamic_shape_padding_value()` cast custom pixel values to `int` (e.g. `12.5px` became `12`), while `view.js` clips the path from the same value with `parseFloat`; the padding now preserves the fractional value.

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
