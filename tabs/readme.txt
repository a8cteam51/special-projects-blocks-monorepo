=== Tabs ===
Contributors:      wpspecialprojects
Tags:              block, tabs, accordion, accessibility, gutenberg
Tested up to:      6.8
Stable tag:        0.1.3
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A block that lets you organize content into accessible, keyboard-navigable tabs in the WordPress block editor.

== Description ==

Tabs is a Gutenberg block plugin that lets you split content into a set of switchable tabbed panels. It is built from two nested blocks — a parent **Tabs** block and one or more child **Tab** blocks — so each tab panel can hold any blocks you like and is edited directly through the standard block editor interface.

The tab interface follows the ARIA Authoring Practices Guide tablist pattern, so it is fully keyboard operable and exposes the correct roles and states to assistive technology on the frontend.

= Features =

* **Two-block architecture** — a parent **Tabs** block contains child **Tab** blocks. Each tab panel is an inner-blocks container that accepts any content (it starts with a paragraph by default).
* **Default two-tab layout** — inserting the Tabs block creates two tabs to start from, and you can add or remove tabs as needed.
* **Editable tab titles** — each tab label is edited inline with rich text, supporting bold, italic, link, and inline image formatting.
* **Reorder tabs** — "Move tab left" and "Move tab right" toolbar buttons on the Tabs block reorder the currently active tab; the buttons disable automatically at the ends.
* **Accessible tablist on the frontend** — the saved markup uses `role="tablist"`, `role="tab"`, and `role="tabpanel"` with `aria-selected`, `aria-controls`, and `aria-labelledby` wired up, and inactive panels are `hidden`.
* **Full keyboard navigation** — on the frontend, arrow Left/Right move between tabs (wrapping around at the ends), and Home/End jump to the first/last tab. Selecting a tab reveals its panel and hides the others.
* **Scroll arrows for overflow** — when there are more tabs than fit the available width, left/right scroll arrows appear and smoothly scroll the tab list; they hide automatically at the start, end, or when no scrolling is needed, and respond to window resizing.
* **Block supports** — the Tabs block supports an HTML anchor and wide/full alignment, and is limited to one instance per insertion (it cannot be nested in itself).
* **Interactivity API ready** — the blocks declare interactivity support and ship a view script for frontend behavior.

== Installation ==

1. Upload the `tabs` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Open any post or page in the block editor, click the **+** inserter, and search for **Tabs**.
4. Edit each tab's title inline, add content inside each tab panel, and use the toolbar buttons to reorder tabs.

= Building from source =

Requirements: Node.js 18+.

1. `cd tabs`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= How do I add or remove tabs? =

The Tabs block contains child Tab blocks. Use the block inserter inside the Tabs block to add another Tab, and delete a Tab block to remove it. Inserting the Tabs block starts you off with two tabs.

= How do I change a tab's label? =

Click the tab's label and type. Tab titles are edited with rich text, so you can apply bold, italic, links, and inline images within the label.

= How do I reorder my tabs? =

Select the active tab, then use the **Move tab left** and **Move tab right** buttons in the block toolbar. The buttons are disabled when the active tab is already at the start or end.

= Is the tabbed interface keyboard accessible? =

Yes. On the frontend the tabs implement the ARIA tablist pattern: use the Left and Right arrow keys to move between tabs (wrapping at the ends), and Home or End to jump to the first or last tab. Roles and ARIA states are set so screen readers announce the tabs and panels correctly.

= What happens when there are too many tabs to fit? =

When the tab list overflows its container, left and right scroll arrows appear so you can scroll through the tabs. The arrows hide automatically when you reach the start or end, or when all tabs already fit, and they re-evaluate on window resize.

= Can I put any content inside a tab? =

Yes. Each Tab is an inner-blocks container, so a tab panel can hold any blocks. New tabs start with an empty paragraph that you can replace or build on.

== Changelog ==

= 0.1.3 =
* Fix frontend keyboard focus for tab controls by keeping the selected tab in the tab order.

= 0.1.2 =
* Two-block Tabs / Tab architecture with a default two-tab layout.
* Inline rich-text tab titles (bold, italic, link, image).
* Move tab left / right toolbar controls.
* Accessible frontend tablist following the ARIA Authoring Practices tablist pattern, with arrow-key, Home, and End keyboard navigation.
* Overflow scroll arrows that show/hide based on scroll position and viewport size.
* Anchor and wide/full alignment block supports; single instance per insertion.

= 0.1.0 =
* Release
