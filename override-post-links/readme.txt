=== Override Post Links ===
Contributors:      The WordPress Contributors
Tags:              block
Tested up to:      6.7
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Add a panel in the WP Admin allowing the user to enter a link which overrides the post links to the new link.

== Description ==

- Adds a side panel in the post section that allows the user to enter an external news link and the source - saved as post meta
- Filters the post/title, post-featured-image, read-more & post-excerpt blocks so that the post link is replaced with the external news source link and makes it open in a new window if the link is set
- Hooks into the template_redirect filter to make sure the post single is not accessible and is returned to the posts archive page by default.
- Add a block variation & block bindings to display the news source

== Available filters ==

= wpcomsp_override_post_links_post_types =

`apply_filters( 'wpcomsp_override_post_links_post_types', array $post_types );`

Array of post types that support the link override. Default `post`.

= wpcomsp_override_post_links_redirect_url =

`apply_filters( 'wpcomsp_override_post_links_redirect_url', string $blog_archive, string $override_url );`

Where the post single should be redirected to if accessed directly. Default the blog archive. Leave blank for no redirect.


== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/override-post-links` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress

= Building from source =

Requirements: Node.js 18+.

1. `cd override-post-links`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Screenshots ==

1. The Override Post Links panel in the post editor sidebar, with the external news link and source fields.

== Changelog ==

= 0.1.0 =
* Release
