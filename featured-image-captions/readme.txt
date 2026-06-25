=== Featured Image Captions ===
Contributors:      The WordPress Contributors
Tags:              block, featured-image, caption, image
Requires at least: 6.1
Tested up to:      6.7
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Adds caption support to the core Featured Image block.

== Description ==

Extends the core Featured Image block with optional caption display. A toolbar button in the editor allows toggling the caption on or off. When enabled, a caption field appears below the image in the editor. If left blank, the image's media library caption is used as a fallback. On the frontend, the caption renders inside the `<figure>` element with the `wp-element-caption` class.

== Installation ==

1. Install and activate the plugin.
2. Add the Featured Image block to a template.
3. Click the caption toggle button in the block toolbar to enable caption display.
4. Optionally enter a custom caption in the field that appears. If left blank, the image's media library caption will be used.

= Building from source =

Requirements: Node.js 18+.

1. `cd featured-image-captions`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Changelog ==

= 1.0.0 =
* Initial release.
