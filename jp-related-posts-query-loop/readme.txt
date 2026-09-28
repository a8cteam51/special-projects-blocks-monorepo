=== Jetpack Related Posts Query Loop ===
Contributors:      wpspecialprojects
Tags:              query, related posts, jetpack
Tested up to:      6.9.0
Stable tag:        0.2.1
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.7
Requires PHP:      7.4

Display Jetpack's related posts in a Query Loop block, laid out with your own post template.

== Description ==

The **Jetpack Related Posts Query Loop** plugin adds a query block variation named `Related Posts Query` that displays Jetpack's related posts for the current post. You design how each post looks with the block's post template, the same as any Query Loop block, which gives more layout freedom than the default Jetpack Related Posts block. Jetpack decides which posts appear, so only the post count and post type query controls are available.

= Settings =

The block exposes two query controls in the block settings sidebar:

* **Items per page** — how many related posts to show. Default: `4`.
* **Post type** — which post type to show related posts from. Default: `post`.

The block is inserted with wide alignment. The other Query Loop controls (taxonomies, author, keyword, order, sticky posts, offset) are hidden because Jetpack determines which posts are related and in what order.

== Installation ==

1. Upload the `jp-related-posts-query-loop` folder to your `/wp-content/plugins/` directory
2. Activate the plugin **Jetpack Related Posts Query Loop** through the 'Plugins' menu in WordPress


**How It Works:**

1. Edit any post and add the **Related Posts Query** block variation.
 1.1. The block can be added by either typing `/related` in a paragraph and picking the **Related Posts Query** block
 1.2. Or by clicking the **Block Inserter** button (Plus button in the top toolbar) in the editor and selecting **Related Posts Query** from the list of blocks in the Theme section.
2. Design the post template inside the block, and set the post count and post type in the block settings.

**Notes:**

- Jetpack is optional. The block uses Jetpack's Related Posts feature when it is available. If Jetpack isn't active, or it returns no related posts, the block falls back to recent posts of the same post type (excluding the current post), shuffled. The fallback picks from the most recent 3 × the post count posts rather than the whole archive, to keep the query cheap.
- In the editor, the block will display the latest posts.

= Building from source =

Requirements: Node.js 18+.

1. `cd jp-related-posts-query-loop`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Changelog ==

= 0.2.1 =
* Fix: the related posts query filter could leak onto the next Query Loop block on the page when the related posts block rendered without a post template.
* Fix: guard against zero or negative post counts in the related posts query.
* Removed the unused `query_type` attribute from the block variation.
* Docs: document the available settings, the fallback behaviour, and that Jetpack is optional.

= 0.2.0 =
* Fixed incorrect post ID check and incorrect post_type attribute

= 0.1.0 =
* Initial release
