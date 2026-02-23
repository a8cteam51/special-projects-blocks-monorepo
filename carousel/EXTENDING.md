# Extending the Carousel Block

The Carousel block supports adding third-party or custom blocks as carousel tracks via the standard WordPress `blocks.registerBlockType` filter. This guide explains how to integrate a custom block so that slide counting, pagination, and navigation all work correctly.

## Requirements

1. **Add your block to `allowedBlocks`.** Use the `blocks.registerBlockType` filter to append your block's name to the Carousel's `allowedBlocks` list.

2. **Apply the track class name.** The block that acts as the carousel track **must** have the CSS class `wp-block-wpcomsp-carousel-track`. This is how both the editor and the front-end identify which element contains the slides.

3. **Each direct child = one slide.** The carousel counts slides by looking at the direct children of the track element (`wp-block-wpcomsp-carousel-track > *`). Structure your block so that each slide is a direct child of the track.

## Example: Adding a Custom Block as a Track

```js
import { addFilter } from '@wordpress/hooks';

/**
 * Allow `my-plugin/my-block` inside the Carousel.
 */
addFilter(
	'blocks.registerBlockType',
	'my-plugin/carousel-allowed-blocks',
	( settings, name ) => {
		if ( name !== 'wpcomsp/carousel' ) {
			return settings;
		}

		return {
			...settings,
			allowedBlocks: [
				...( settings.allowedBlocks ?? [] ),
				'my-plugin/my-block',
			],
		};
	}
);
```

When inserting the block into a Carousel in the editor, ensure it carries the required class name. You can set this in the block's `className` attribute:

```js
// When creating the block programmatically:
createBlock( 'my-plugin/my-block', {
	className: 'wp-block-wpcomsp-carousel-track',
} );
```

Or apply the class manually through the block's **Advanced > Additional CSS class(es)** panel in the editor.

## How Item Counting Works

### Editor

The editor uses `findContentBlock()` to locate the track block inside the Carousel's inner blocks tree. It matches by:

1. **Class name** (primary) — any block whose `className` attribute includes `wp-block-wpcomsp-carousel-track`.
2. **Block type** (fallback) — wrapper blocks like `core/query` and `woocommerce/product-collection` whose child template block carries the track class.

Once found, the item count is determined by:

- **`core/query` / `woocommerce/product-collection`** — queries the REST API to count matching posts/products.
- **All other blocks** — counts `innerBlocks.length`.

If your block renders its children server-side (so `innerBlocks` is empty in the editor), the count will be `0` in the editor. The front-end corrects this automatically (see below).

### Front-end

On page load, `ensureItemCount()` counts the track's direct children in the DOM and updates the `--item-count` CSS custom property. This works for all block types, including server-rendered blocks whose child count isn't known in the editor.

If a pagination block is present, `ensurePaginationButtons()` creates any missing pagination buttons to match the actual slide count.

## CSS Custom Properties

These custom properties are set on the `.wp-block-wpcomsp-carousel` element and can be used for theming:

| Property             | Description                                 | Default                          |
|----------------------|---------------------------------------------|----------------------------------|
| `--animation-speed`  | Duration of slide transitions               | `0.3s`                           |
| `--item-count`       | Number of slides (set by JS)                | `0`                              |
| `--item-gap`         | Gap between slides                          | `var(--wp--preset--spacing--20)` |
| `--track-height`     | Height of the track (gallery variation only) | `430px`                          |

Sub-blocks expose additional properties:

| Property               | Block           | Description                |
|------------------------|-----------------|----------------------------|
| `--button-size`        | Carousel Nav    | Size of navigation buttons |
| `--button-background`  | Carousel Nav    | Button background color    |
| `--icon-color`         | Carousel Nav    | Button icon color          |
| `--button-size`        | Carousel Pagination | Size of pagination dots |
| `--button-background`  | Carousel Pagination | Active dot color       |
