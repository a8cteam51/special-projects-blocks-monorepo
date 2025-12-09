=== Jetpack Related Posts Query Loop ===
Contributors:      wpspecialprojects
Tags:              query, related posts, jetpack
Tested up to:      6.8.3
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.6
Requires PHP:      7.4

Display Jetpack's related posts in a query block that can be customized in the editor like any other query block.

== Description ==

The **Jetpack Related Posts Query Loop** plugin adds a query block variation named `Related Posts Query` that displays the related posts from Jetpack in a query block that can be customized like a regular query block in the editor. This allows for more customization options than the default Jetpack Related Posts block.

== Installation ==

1. Upload the `jp-related-posts-query-loop` folder to your `/wp-content/plugins/` directory
2. Activate the plugin **Jetpack Related Posts Query Loop** through the 'Plugins' menu in WordPress


**How It Works:**

1. Edit any post and add the **Related Posts Query** block variation.
 1.1. The block can be added by either typing `/related` in a paragraph and picking the **Related Posts Query** block
 1.2. Or by clicking the **Block Inserter** button (Plus button in the top toolbar) in the editor and selecting **Related Posts Query** from the list of blocks in the Theme section.
2. Customize the query block like any regular query block.

**Notes:**

- This block variation uses Jetpack's Related Posts feature. If Jetpack is not activated or it returns no results, the block will display random posts from the site.
- In the editor, the block will display the latest posts.

== Changelog ==

= 0.1.0 =
* Initial release
