## 0.4.0

### Added

-   "Show featured video" setting on the Post Featured Image block, so a block (e.g. in a Query Loop) can show the featured image instead (#160)
-   Cover block support: a Cover that uses the featured image plays a Media Library or direct-URL featured video as its background (#160)
-   `wpcomsp_featured_video_show_in_block` filter

### Fixed

-   The playback options (poster, play icon, autoplay, loop, mute, inline, controls) now show in the editor for direct video URLs, not just Media Library videos (#247)

## 0.3.1

### Removed

-   Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.3.0

### Added

-   Support for any post type that supports thumbnails (previously posts only)
-   Featured-video rendering on single post and single page templates
-   External video URL support (oEmbed providers + direct `.mp4`/`.webm`/`.ogv`/`.mov` URLs)
-   Drag-and-drop video uploading in the editor sidebar
-   Per-post playback toggles (autoplay, loop, mute, playsinline, controls)
-   Custom poster image picker
-   Optional play-icon overlay with a click-to-play frontend handler

### Fixed

-   Per-post options no longer clobber the video-ID meta on every change
-   The poster image is now actually rendered on the frontend
-   The options sanitizer now strictly allowlists known keys and casts to the right type

## 0.1.2 (2025-08-04)

### Added

-   Add readme.txt file

## 0.1.1 (2025-08-02)

### Added

-   Update URI
