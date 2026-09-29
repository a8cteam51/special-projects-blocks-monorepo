=== Sibling Pages List ===
Contributors:      wpspecialprojects
Tags:              block, pages, navigation, sibling, menu
Tested up to:      6.8
Stable tag:        0.1.1
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A dynamic block that displays a list of the current page's sibling pages, automatically built from the page hierarchy.

== Description ==

Sibling Pages List is a single Gutenberg block that outputs a list of every page sharing the same parent as the page being viewed. It is a server-rendered (dynamic) block, so the list is generated on each page load from the live page hierarchy — there is nothing to maintain by hand. Add the block once to a page (or to a template applied to your pages) and it adapts to wherever it appears.

The block reads the current page's `postId` and `postType` from the editor/template context. It only renders on the `page` post type, looks up that page's parent, and lists the parent's child pages ordered by their menu order. The page currently being viewed appears as plain text, while every other sibling is rendered as a link to its permalink.

= Features =

* **Automatic sibling list** — lists all pages that share the same parent as the current page, with no manual page selection required.
* **Server-rendered output** — the list is generated at render time from the current page hierarchy, so it always reflects the live set of sibling pages.
* **Ordered by menu order** — siblings are sorted by their `menu_order` value, matching the order you set in the page editor.
* **Current page highlighted** — the page being viewed is output as plain text, while the other siblings are output as links to their permalinks.
* **Page-aware** — the block only renders on pages; it is skipped on other post types and when the current page has no parent.
* **Editor placeholder** — in the block editor the block shows a short descriptive placeholder, since the real list depends on frontend context.

== Installation ==

1. Upload the `sibling-pages-list` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Edit a child page (or a template applied to your pages), click the **+** inserter, and search for **Sibling Pages List**.

= Building from source =

Requirements: Node.js 18+.

1. `cd sibling-pages-list`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= Which pages does the block list? =

It lists all pages that share the same parent as the page currently being viewed — that is, the page's siblings within the page hierarchy. The current page is included in the list, shown as plain text rather than a link.

= Why does the block not show anything? =

The block renders only on the `page` post type and only when the current page has a parent page. If you place it on a top-level page (one with no parent), on a post, or on another post type, it produces no output.

= In what order are the sibling pages shown? =

Siblings are sorted by their `menu_order` value, which is the same order you can set on each page in the editor. Adjusting a page's order there changes its position in the list.

= How is the current page displayed differently? =

Every sibling other than the page being viewed is rendered as a link to its permalink. The current page is rendered as plain text with no link, so visitors can see where they are in the list.

= Do I need to configure anything? =

No. The block has no settings to configure — it derives the list entirely from the page hierarchy at render time. Just insert it on a child page or page template.

== Changelog ==

= 0.1.1 =
* Added an Update URI so the plugin can receive automatic updates from the WordPress.com Special Projects blocks monorepo.

= 0.1.0 =
* Initial version.
* Dynamic block that lists the current page's sibling pages, ordered by menu order, with the current page shown as plain text and other siblings as links.
