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

## Avaibable filters:

### wpcomsp_override_post_links_post_types

`apply_filters( 'wpcomsp_override_post_links_post_types', array $post_types );`

Array of post types that are supported for the link override. Default 'post'

### wpcomsp_override_post_links_redirect_url

`apply_filters( 'wpcomsp_override_post_links_redirect_url', string $blog_archive, string $override_url );`

Where the post single should be redirected to if accessed directly. Default 'Blog Archive'. Leave blank for no-redirect.


== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/override-post-links` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 0.1.0 =
* Release

== Arbitrary section ==

You may provide arbitrary sections, in the same format as the ones above. This may be of use for extremely complicated
plugins where more information needs to be conveyed that doesn't fit into the categories of "description" or
"installation." Arbitrary sections will be shown below the built-in sections outlined above.
