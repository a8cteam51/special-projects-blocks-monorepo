=== Featured Video ===
Contributors:      wpspecialprojects
Tags:              block, video, featured-image, media, post-thumbnail
Tested up to:      6.8.2
Stable tag:        0.3.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.6
Requires PHP:      7.4

Replace featured images with featured videos in your WordPress posts. This plugin allows you to set a video as the featured media for posts, which will automatically replace the featured image in post displays.

== Description ==

The **Featured Video** plugin extends WordPress functionality to allow you to use videos as featured media instead of just images. When you set a featured video for a post, it will automatically replace the featured image in post displays, providing a more dynamic and engaging visual experience.

**Key Features:**

* **Easy Setup**: Upload a video, drag-and-drop a file, or paste an external URL
* **Automatic Replacement**: Featured videos automatically replace featured images in post displays
* **Per-Post Playback Options**: Toggle autoplay, loop, mute, inline playback, and native controls
* **Play-Icon Overlay**: Optionally show a centered play button overlay for click-to-play UX
* **Custom Poster Image**: Pick any image from the media library as the video's poster
* **External Sources**: Use a direct video URL (.mp4/.webm/.ogv/.mov) or any oEmbed provider (YouTube, Vimeo, etc.)
* **Works on All Thumbnail-Supporting Post Types**: Posts, pages, and any CPT with thumbnail support
* **Accessibility**: Fallback text for unsupported browsers and an accessible play-icon button

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

Autoplay is opt-in per post in the Featured Video panel. When you enable autoplay the plugin automatically enables Mute too, because browsers refuse to autoplay videos with sound.

= Can I use a YouTube or Vimeo URL? =

Yes. Switch the "Video Source" select to "External Video" and paste the URL. Any provider that WordPress's oEmbed system supports will work. Direct video URLs (.mp4, .webm, .ogv, .mov) are rendered as a native HTML5 `<video>` element and respect all the playback toggles.

= Do the playback options apply to embedded providers? =

No. Autoplay, loop, mute, inline, controls, and the play-icon overlay only apply to videos uploaded to the media library or pasted as a direct video URL. Provider embeds (YouTube, Vimeo, etc.) use the provider's own player.

= Can I still use featured images? =

Yes! If no featured video is set, the plugin will fall back to the regular featured image.

= Is the video responsive? =

Yes, the video is fully responsive and will adapt to different screen sizes while maintaining its aspect ratio.

= What happens if a browser doesn't support video? =

The plugin includes fallback text that will display if the browser doesn't support the video tag.

= This plugin doesn't do something it says it should in this readme.txt file?

If something described here is not working as expected, please open an issue in the repository and we will investigate.


== Developers ==

The plugin uses WordPress's post meta system to store the featured video ID. The video replacement happens through the `render_block_core/post-featured-image` filter.

**Key Functions:**
- `wpcomsp_featured_video_register_post_meta()` - Registers the custom post meta
- `wpcomsp_featured_video_render_post_featured_image()` - Handles the video replacement logic

**CSS Classes:**
- Videos use the class `wp-post-video` in addition to the standard `wp-post-image` class
- The `intrinsic-ignore` class is added for proper responsive behavior

== Changelog ==

= 0.3.0 =
* Add support for any post type that supports thumbnails (previously posts only)
* Add featured-video rendering on single post and single page templates
* Add external video URL support (oEmbed providers + direct .mp4/.webm/.ogv/.mov URLs)
* Add drag-and-drop video uploading in the editor sidebar
* Add per-post playback toggles (autoplay, loop, mute, playsinline, controls)
* Add custom poster image picker
* Add optional play-icon overlay with a click-to-play frontend handler
* Fix: per-post options were overwriting the video-ID meta on every change
* Fix: poster image is now actually rendered on the frontend
* Fix: options sanitizer now strictly allowlists known keys and casts to the right type

= 0.1.2 =
* Add readme.txt file

= 0.1.1 =
* Update URI

= 0.1.0 =
* Initial release
