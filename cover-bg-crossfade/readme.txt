=== Cover Background Crossfade ===
Contributors:      wpspecialprojects
Tags:              block, video, featured-image, media, post-thumbnail
Tested up to:      6.8.3
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.6
Requires PHP:      7.4

Crossfade background images or videos of multiple cover blocks on a single page based on their scroll position.

== Description ==

The **Cover Background Crossfade** plugin extends WordPress functionality to allow crossfading the background images or videos of multiple cover blocks on a single page based on their scroll position. The background images cover the full screen.

== Installation ==

1. Upload the `cover-bg-crossfade` folder to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress


**How It Works:**

1. Edit any post or page and add cover blocks.
2. Select background images or videos and pick the **Crossfade Background** block style for each cover block.
3. The backgrounds will cover the full screen and will crossfade into view when the cover block is in view.

**Notes:**

- Currently, the cover backgrounds are always visible. Consider adding background colors to the header and footer parts to improve readability. If you want to add content after the cover blocks, consider grouping them and add a background color to the group. Optionally, you can set it to full width to cover the backgrounds.

- The cover backgrounds are displayed behind the content and will not be visible if the post content block or the surrounding containers have a background color assigned to them.


== Changelog ==

= 0.1.0 =
* Initial release
