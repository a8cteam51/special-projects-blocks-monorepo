=== Exclude Duplicate Posts from Query Loops ===
Contributors:      wpspecialprojects
Tags:              query, exclude duplicates
Tested up to:      6.8.3
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.6
Requires PHP:      7.4

Exclude posts from query loops that have already been displayed on the current page (in previous query loops).

== Description ==

The **Exclude Duplicate Posts from Query Loops** plugin adds a query block setting to exclude posts from query loops that have already been displayed on the current page in previous query loops. This allows for creating pages with multiple unrelated custom queries and avoiding posts being displayed multiple times on the same page.

== Installation ==

1. Upload the `exclude-duplicates-from-query-loops` folder to your `/wp-content/plugins/` directory
2. Activate the plugin **Exclude Duplicate Posts from Query Loops** through the 'Plugins' menu in WordPress


**How It Works:**

1. Edit any post that has multiple query loops.
2. Select the second or later **Query Loop** block and activate the **Exclude Duplicate Posts** option in the sidebar.
3. These Query Loop blocks will now exclude posts that have already been displayed on the current page in query loops that appear before this Query Loop.

**Notes:**

- Depending on the query loop settings and the available posts, it is possible that a query loop will display no posts because all posts have already been displayed before.

= Building from source =

Requirements: Node.js 18+.

1. `cd exclude-duplicates-from-query-loops`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Changelog ==

= 0.1.0 =
* Initial release
