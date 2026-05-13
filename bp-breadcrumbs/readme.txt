=== Breadcrumbs ===
Contributors:      The WordPress Contributors
Tags:              block
Tested up to:      6.8
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Breadcrumbs block for BuddyPress and BBPress, modified from Tremi's Audrey Capital breadcrumb block

== Description ==

Breadcrumbs block that works with BuddyPress and BBPress. It also works with other WordPress pages.

## Settings

There are two setting for this block:

- [ ] Hide single breadcrumb
- [ ] Hide Home breadcrumb

Which hide singluar breadcrumbs and hides the home page breadcrumb respectively

## Filters

There are 5 filters for this plugin

`apply_filters( 'a8csp_skip_breadcrumbs', boolean $skip_breadcrumbs );`

Setting this to true will skip the breadcrumbs (which can be used with conditional checks for certain post types etc)

`apply_filters( 'a8csp_breadcrumbs_items', array $breadcrumbs );`

Allows filtering of the breadcrumbs array

`apply_filters( 'a8csp_breadcrumbs_home_url', string $home_url );`

Allows filtering of the home url to make it different from the standard WordPress `get_home_url()`

`apply_filters( 'a8csp_breadcrumbs_home_label', string $home_text );`

Allows filtering of the home link text value

`apply_filters( 'a8csp_breadcrumbs_separator', string $sep );`

Allows filtering of the seperator between the breadcrumb items. This should be an SVG.


== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/breadcrumbs` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


== Frequently Asked Questions ==

= Can I use this without BuddyPress or BBPress =

Yes, although there might be better solutions out there!

= How do I add breadcrumbs to BBPress pages? =

BBP Style pack has to be installed to make BBPress pages work with FSE. At the time of writing, it does not include blocks that have been added via a template,
it does add blocks that have been added to a page though, and the breadcrumbs show up there.

== Screenshots ==

1. Breadcrumbs in the WP Admin
2. BuddyPress Breadcrumbs on the front end of a site


