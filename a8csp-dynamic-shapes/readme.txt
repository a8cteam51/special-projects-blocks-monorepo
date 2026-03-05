=== Dynamic Shapes ===
Contributors:      The WordPress Contributors
Tags:              editor plugin, group, image
Tested up to:      6.7
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Extends the core Group, Image, and Featured Image blocks with controls for adjusting corners to create unique shapes.

== Description ==

Dynamic Shapes extends the WordPress block editor with shape customization tools for the core Group, Image, and Featured Image blocks, enabling designers to create unique layouts.

## Features

* **Custom Shapes**: Create unique shapes by adjusting vertical and horizontal offsets for each corner
* **Block Support**: Works with Group, Image, and Post Featured Image blocks
* **Border Radius Integration**: Integrates with WordPress border radius controls
* **Borders & Backgrounds**: Full support for borders and backgrounds on the Group block
* **Drop Shadows**: Apply shape-respecting drop shadows to image blocks (the outline drop shadow is not currently supported)
* **Padding Adjustments**: Automatic padding calculations for group blocks to account for shape offsets
* **Preset Support**: Use spacing presets or custom values for precise control

## How It Works

The plugin adds a "Dynamic Shape" panel to the block inspector, allowing you to adjust corner offsets independently. These offsets create a custom SVG clip-path that shapes your block content. The shape respects border radius settings and can be combined with borders, backgrounds, and shadows for rich visual effects.

## Filters

### a8csp_dynamic_shapes_blocks

Filters the list of block types that support dynamic shape functionality.

**Parameters:**
* `$blocks` (array<string>) - Array of block names that support dynamic shapes. Default: `array( 'core/group', 'core/image', 'core/post-featured-image' )`

**Returns:** `array<string>` - Array of block names that should support dynamic shapes.

**Example:**

```php
add_filter( 'a8csp_dynamic_shapes_blocks', function( $blocks ) {
	// Remove support from the Image block.
	$blocks = array_diff( $blocks, array( 'core/image' ) );

	return $blocks;
} );
```

== Installation ==

1. Grab this plugin's [latest release](https://github.com/a8cteam51/special-projects-blocks-monorepo/releases) from the repo, and install the main asset ZIP file as a regular plugin
2. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= Which blocks support dynamic shapes? =

The plugin supports the core Group, Image, and Post Featured Image blocks.

= How are the custom shapes rendered? =

A clip path - or an SVG background - is generated via JavaScript based on the configured corner settings and the width and height of the block.

For Group blocks, corner adjustments are additive - that is, compensated for with additional padding - so as not to cut off any content.

= Can I use preset spacing values with dynamic shapes? =

Yes! The plugin supports both WordPress spacing presets and custom pixel values. You can switch between preset and custom modes using the settings icon next to each corner control.

= How do borders work with dynamic shapes? =

Borders are applied using SVG strokes that follow the custom clip path. The border width is doubled internally to account for the stroke being centered on the path, then trimmed in half by the clip-path. Note that SVG strokes can only accommodate a single width value, so if you have different border widths per side, only the top width will be used.

NOTE: Only the Group block currently supports borders.

= What happens to padding when using dynamic shapes on group blocks? =

The plugin automatically calculates padding adjustments for group blocks to account for the dynamic shape offsets. The padding calculation includes your set padding values, border width (if present), and the maximum dynamic shape offset for each side.

= Can I use dynamic shapes with custom block types? =

While the `a8csp_dynamic_shapes_blocks` filter allows for adding support for custom block types, the result may be undesirable.

= Why does my corner radius look funny?

Arcs in the generated path assume a 90% angle, yielding poor results on corners configured to very acute or obtuse angles. I wouldn't be upset if someone better at math wanted to take a crack at improving this.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 0.1.0 =
* Release
