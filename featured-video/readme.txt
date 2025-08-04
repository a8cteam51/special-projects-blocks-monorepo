=== Featured Video ===
Contributors:      The WordPress Contributors
Tags:              block, video, featured-image, media, post-thumbnail
Tested up to:      6.8.2
Stable tag:        0.1.2
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.6
Requires PHP:      7.4

Replace featured images with featured videos in your WordPress posts. This plugin allows you to set a video as the featured media for posts, which will automatically replace the featured image in post displays.

== Description ==

The **Featured Video** plugin extends WordPress functionality to allow you to use videos as featured media instead of just images. When you set a featured video for a post, it will automatically replace the featured image in post displays, providing a more dynamic and engaging visual experience.

**Key Features:**

* **Easy Setup**: Simply upload a video and set it as your featured video
* **Automatic Replacement**: Featured videos automatically replace featured images in post displays
* **Responsive Design**: Videos are responsive and maintain proper aspect ratios
* **Autoplay Support**: Videos can autoplay with muted audio for better user experience
* **Cross-Browser Compatibility**: Works across all modern browsers
* **Accessibility**: Includes fallback text for browsers that don't support video

**How It Works:**

The plugin hooks into WordPress's featured image system and automatically replaces the featured image with your selected video when displaying posts. The video maintains the same styling and responsive behavior as featured images.

== Installation ==

1. Upload the `featured-video` folder to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Edit any post and you'll see the option to set a featured video
4. Upload or select a video file to use as your featured video
5. The video will automatically replace the featured image in post displays

== Frequently Asked Questions ==

= How do I set a featured video? =

Edit any post and look for the "Featured Video" option in the post settings panel. You can upload a new video or select an existing one from your media library.

= What video formats are supported? =

The plugin supports all video formats that WordPress supports, including MP4, WebM, and OGV files.

= Will the video autoplay? =

Yes, the featured video will autoplay with muted audio and loop continuously for a dynamic effect.

= Can I still use featured images? =

Yes! If no featured video is set, the plugin will fall back to the regular featured image.

= Is the video responsive? =

Yes, the video is fully responsive and will adapt to different screen sizes while maintaining its aspect ratio.

= What happens if a browser doesn't support video? =

The plugin includes fallback text that will display if the browser doesn't support the video tag.

= This plugin doesn't do something it says it should in this readme.txt file?

Let's blame that on AI for now, wink wink, and report it as an issue and we'll take a look.


== Developers ==

The plugin uses WordPress's post meta system to store the featured video ID. The video replacement happens through the `render_block_core/post-featured-image` filter.

**Key Functions:**
- `wpcomsp_featured_video_register_post_meta()` - Registers the custom post meta
- `wpcomsp_featured_video_render_post_featured_image()` - Handles the video replacement logic

**CSS Classes:**
- Videos use the class `wp-post-video` in addition to the standard `wp-post-image` class
- The `intrinsic-ignore` class is added for proper responsive behavior

== Changelog ==

= 0.1.2 =
* Add readme.txt file

= 0.1.1 =
* Update URI

= 0.1.0 =
* Initial release
