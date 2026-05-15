=== Exclude Current Post from Query ===
Contributors:      wpspecialprojects
Tags:              query, related posts, single post
Tested up to:      6.8.3
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.6
Requires PHP:      7.4

Excludes the current post from core Query Loop block results on singular pages.

== Description ==

The **Exclude Current Post from Query** plugin automatically excludes the current post ID from every core Query Loop block when rendered on a singular page (single post, page, or custom post type).

This is useful for "related posts" or "more from this category" queries placed inside a single post template, where the current post should never appear in the list.

The plugin has no settings and no UI — once activated, it filters all Query Loop blocks on singular templates.

== Installation ==

1. Upload the `exclude-current-post-from-query` folder to your `/wp-content/plugins/` directory.
2. Activate the plugin **Exclude Current Post from Query** through the 'Plugins' menu in WordPress.

== Changelog ==

= 0.1.0 =
* Initial release
