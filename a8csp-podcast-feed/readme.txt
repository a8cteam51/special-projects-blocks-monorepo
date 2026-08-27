=== Podcast Feed ===
Contributors:      The WordPress Contributors
Tags:              block, podcast, rss, audio, feed
Tested up to:      6.7
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Display podcast episodes from any RSS feed with customizable options. Episodes are cached locally and refreshed hourly.

== Description ==

The Podcast Feed block lets editors point at any podcast RSS feed and render its episodes inside a post or page. Display options include cover art, audio player, description, duration, publish date, and episode number, with a choice of list or grid layout.

To keep the front end fast, episodes are mirrored into a hidden custom post type (`a8csp_podcast_item`). The cache is refreshed hourly via WP-Cron, when an editor opens or saves the block, or via a manual "Refresh Feed" button in the block sidebar.

== Installation ==

1. Install and activate the plugin.
2. Add the **Podcast Feed** block to a post or page.
3. Paste your podcast RSS feed URL.
4. Configure display options and layout in the block sidebar.

== Frequently Asked Questions ==

= How often does the feed refresh? =

Hourly via WP-Cron. Editors can also trigger an immediate refresh from the block sidebar.

= Can I filter by season? =

Yes — enter a season number in the **Season** field to limit the displayed episodes.

= Where are episodes stored? =

In a hidden custom post type (`a8csp_podcast_item`) with one post per episode and per-episode metadata.

== Changelog ==

= 0.1.0 =
* Initial release.
