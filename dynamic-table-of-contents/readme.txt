=== Dynamic Table of Contents ===
Contributors:      wpspecialprojects
Tags:              block, table of contents, navigation, headings, accessibility
Tested up to:      6.8
Stable tag:        0.3.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A dynamic, server-rendered table of contents block that builds itself from your post's headings and highlights the current section as the reader scrolls.

== Description ==

Dynamic Table of Contents is a Gutenberg block plugin that adds a self-building table of contents to your posts. Instead of maintaining a list of links by hand, you drop the block into a post and it generates the navigation on the frontend from the headings already in the post content. As the reader scrolls, the entry for the section currently in view is highlighted automatically.

The list is assembled in the browser at render time from the post's live heading markup, so it always reflects the post as published. Anchor links are wired up automatically: the plugin adds an `id` to any heading that doesn't already have one, derived from the heading text, so every entry in the table links to the correct section.

= Features =

* **Self-building list** — the table of contents is generated on the frontend from the post's headings; there is no manual list to maintain.
* **Automatic heading anchors** — a `render_block` filter adds an `id` (slugified from the heading text) to every `core/heading` that lacks one, so each table entry links to its section. Headings that already have an `id` are left untouched.
* **Headings from wrapper blocks** — an optional **Include headings nested in other blocks** toggle lists headings rendered by blocks such as accordions (which wrap their title in extra elements and so never get a server-side anchor). When enabled, the view script generates an anchor for each such heading and ignores decorative, `aria-hidden` icons when building the label.
* **Scroll-spy highlighting** — an `IntersectionObserver` watches the headings and adds an `active` class to the matching link as each section scrolls into view, so the table tracks the reader's position. The active entry is shown in bold.
* **Editable title** — the block title is editable inline via RichText and defaults to "Table of Contents". An empty title is omitted from the output.
* **Heading selection filter** — by default the table collects all `h1`–`h6` headings inside `.wp-block-post-content`. The `a8csp_dynamic_table_of_contents_heading_selectors` filter lets you change which headings are listed (for example, H2 only).
* **Title filter** — the `wpcomsp_dynamic_table_of_contents_block_title` filter lets you adjust the rendered title.
* **Block supports** — background and text colour, padding / margin / block gap spacing, sticky positioning, and border width, radius, and colour, all through the standard block editor controls.
* **Post-aware rendering** — the block renders only in the context of a post (it requires a `postId`), so it stays out of contexts where a table of contents would not apply.

== Installation ==

1. Upload the `dynamic-table-of-contents` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Open any post in the block editor, click the **+** inserter, and search for **Dynamic Table of Contents**.
4. Place the block where you want the navigation to appear (a sidebar column works well with the sticky position support), set a title if desired, and publish or preview the post to see the list build itself.

= Building from source =

Requirements: Node.js 18+.

1. `cd dynamic-table-of-contents`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= How does the table of contents get its entries? =

The list is built on the frontend from the headings in your post. When the page loads, the block's view script queries the post content for headings (by default every `h1`–`h6` inside `.wp-block-post-content`) and creates a linked entry for each one. You do not add or edit the entries yourself.

= Do I need to add anchor IDs to my headings? =

No. The plugin adds an `id` to any heading that doesn't already have one, generated from the heading's text. Headings that already carry an `id` are left as they are, so existing anchors keep working.

= Which headings appear in the list? =

By default, all heading levels (`h1` through `h6`) inside the post content are included. To change that — for example, to list only H2 headings — use the `a8csp_dynamic_table_of_contents_heading_selectors` filter, which receives the default selectors, the block attributes, and the block object, and must return an array of CSS selectors:

`
add_filter(
    'a8csp_dynamic_table_of_contents_heading_selectors',
    static function ( array $heading_selectors ): array {
        return array( '.wp-block-post-content h2' );
    }
);
`

= Why are accordion (or other wrapper-block) headings missing from the list? =

The automatic anchor only runs on `core/heading` blocks. Headings rendered by other blocks — such as accordions, which wrap their title in a button and extra `span` elements — never receive a server-side `id`, so by default they are skipped. Enable the **Include headings nested in other blocks** toggle in the block's settings to list them; the view script then generates an anchor for each from its text and links the entry to it. Decorative, `aria-hidden` icons (like an accordion toggle's `+`/`-`) are ignored when building the label.

= Why doesn't the block show up on a page or in other contexts? =

The block renders only when it has a post context (a `postId`). It is designed for the singular post view, where a table of contents for the post's headings makes sense, and is intentionally skipped elsewhere.

= How is the current section highlighted? =

The view script uses an `IntersectionObserver` to track which heading is in view and adds an `active` class to the matching link. The active entry is styled in bold, so the table reflects where the reader is in the post as they scroll.

= Can I change the title? =

Yes. The title is editable inline in the editor and defaults to "Table of Contents". Leaving it empty removes it from the output. You can also adjust the rendered title programmatically with the `wpcomsp_dynamic_table_of_contents_block_title` filter.

== Changelog ==

= 0.3.0 =
* Added an **Include headings nested in other blocks** toggle (off by default) that lists headings from wrapper blocks such as accordions, generating an anchor for each from its text.
* Heading labels now ignore decorative, `aria-hidden` icons (for example an accordion toggle's `+`/`-` marker).
* The scroll-spy `IntersectionObserver` no longer throws when a heading has no matching table-of-contents link.

= 0.2.0 =
* Server-rendered table of contents block that builds its list on the frontend from the post's headings.
* Automatic heading anchors: adds an `id` (slugified from the heading text) to any `core/heading` that lacks one.
* Scroll-spy highlighting of the current section via `IntersectionObserver`.
* Editable block title (defaults to "Table of Contents"), with a `wpcomsp_dynamic_table_of_contents_block_title` filter.
* New `a8csp_dynamic_table_of_contents_heading_selectors` filter to customize which headings appear in the rendered table of contents. The filter receives the default selectors, the block attributes, and the block object, and must return an array of selectors that the view script will query against.
* Block supports for colour, spacing, sticky position, and borders.

= 0.1.0 =
* Initial release.
