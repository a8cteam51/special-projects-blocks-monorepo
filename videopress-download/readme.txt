=== Videopress Download ===
Contributors:      wpspecialprojects
Tags:              block
Tested up to:      6.7
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Download button for VideoPress Blocks

== Description ==

This provides a download button for any VideoPress block on a post or page. If there is more than one VideoPress block on a page, 
a panel in the block editor appears with a dropdown list of all VideoPress blocks on the page and one can be selected.

Only videos that have the download setting checked will be downloadable.

** Note **

This block will not work in FSE templates or synced patterns. Underneath the hood, in the block editor it extracts the attributes from
the VideoPress block on a page and uses that to provide the download link. Therefore if there is no VideoPress block on that specific page,
as might be the case for synced patterns and templates, it will not work.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/videopress-download` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


= What about making this work with synced patterns and FSE templates =

It may be possible to grab the needed attributes from the VideoPress file using the `pre_render_block` filter on the front end,
however there is a couple of issues that need to be thought through if this works:

1. If there is more than one VideoPress block on a page, how would this work?
2. When developing this block, one major `Gotcha` was that the url of the video was not always available in the block attributes,
but instead there was an iFrame with the embed url in the block $content. This usually happened when the VideoPress block had been copied and pasted.
To get around this I had to get the url from the media library, which might be more difficult in the front end.

= Building from source =

Requirements: Node.js 18+.

1. `cd videopress-download`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Changelog ==

= 0.1.0 =
* Release
