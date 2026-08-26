=== Modal ===
Contributors:      wpspecialprojects
Tags:              block, modal, dialog, interactivity, accessibility
Requires at least: 6.6
Tested up to:      6.8
Stable tag:        0.1.3
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A modal block that can be toggled open and closed, built with the WordPress Interactivity API and authored as a reusable template part.

== Description ==

Modal adds an `a8csp/modal` block: a button that opens an accessible modal dialog on the frontend. The modal contents are authored once as a template part in a dedicated **Modal** template part area, and the button block simply references that template by slug. This means a single modal can be reused across many posts, pages, and navigation menus, and any block can be placed inside the modal.

The block is powered by the WordPress Interactivity API, so opening, closing, focus management, and click-outside behaviour run on the frontend without custom client scripting. Per-modal title and description text (used by screen readers) are stored in the site `modal_meta` option, so they stay consistent across every instance of the same modal.

= Features =

* **Reusable modal template parts** — modal content lives in a custom "Modal" template part area. Create a modal once and reference it from any number of Modal buttons.
* **Block-based modal content** — because the modal is a template part, you can place any blocks inside it. The template part content is rendered with `do_blocks()` on the frontend.
* **Interactivity API powered** — open, close, keyboard handling, and outside-click detection are driven by the Interactivity API view module, not bespoke JavaScript.
* **Accessible dialog markup** — the modal container renders with `role="dialog"`, `aria-modal="true"`, and `aria-hidden`/`inert` bound to its open state. Per-modal screen-reader title and description are bound from the stored settings.
* **Focus management** — on open, focus moves to the first focusable element inside the modal, or to the close button if there is none. On close, focus returns to the button that originally opened the modal.
* **Page made inert while open** — the rest of the site (`.wp-site-blocks` and the skip link) is marked `inert` while a modal is open, and a `modal-open` class is added to `<body>`.
* **Multiple ways to close** — the modal closes on the Escape key, on the dedicated close button, and when clicking outside the inner modal content.
* **Nested modals** — a Modal button placed inside another modal can open a further modal; focus is returned correctly to the originally clicked button.
* **Screen-reader title & description fields** — the block sidebar provides Modal Title and Modal Description controls; values are saved to the `modal_meta` site option (via the REST/Options API) so they apply to every instance of that modal.
* **Navigation block support** — the Modal button is added to the list of blocks allowed inside the core Navigation block. This can be disabled with the `a8csp_modal_navigation` filter.
* **Password-protected posts respected** — modal templates are not output on posts that require a password.
* **Self-updating** — the plugin registers itself with the WordPress Special Projects blocks self-update mechanism for updates from the monorepo.

== Installation ==

1. Upload the `modal` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. In the Site Editor, create a template part and assign it to the **Modal** area to author your modal content.
4. Open any post or page in the block editor, add the **Modal** block, choose your Modal template, and set the button label.

= Building from source =

Requirements: Node.js 18+.

1. `cd modal`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= How do I create the content of a modal? =

Modal content is a template part. In the Site Editor, create a new template part and assign it to the **Modal** template part area, then add whatever blocks you want inside it. The Modal button block references that template part by its slug.

= Why is my Modal block asking me to create a template? =

The block's sidebar lists template parts in the "Modal" area. If none exist yet, no template can be selected. Create a template part with the **Modal** area/category first, then pick it from the **Modal Template** dropdown in the block settings.

= How does a visitor close the modal? =

Three ways: pressing the Escape key, clicking the close button in the corner of the modal, or clicking outside the inner modal content. In each case, focus returns to the button that opened the modal.

= What are the Modal Title and Modal Description fields for? =

They provide an accessible name and description for the dialog. They are bound to the modal's `aria-label` and `aria-description` for screen-reader users and are saved to the site-wide `modal_meta` option, so the same values apply to every instance of that modal.

= Can I put a Modal button inside a navigation menu? =

Yes. The plugin adds the Modal button to the blocks allowed inside the core Navigation block. You can turn this off by returning `false` from the `a8csp_modal_navigation` filter.

= Can a modal open another modal? =

Yes. A Modal button can be placed inside a modal's content to trigger a second modal. When the second modal closes, focus returns to the button that opened it.

== Changelog ==

= 0.1.3 =
* Fix: Replace deprecated `data-wp-on-async-document` with `data-wp-on-document` and `withSyncEvent()` for outside-click handling.

= 0.1.2 =
* Modal block (`a8csp/modal`) built with the Interactivity API: a button that opens an accessible, reusable modal dialog.
* Modal content authored as template parts in a dedicated "Modal" template part area.
* Accessible dialog markup with focus management, page-inert handling, Escape/close-button/click-outside dismissal, and nested-modal support.
* Per-modal screen-reader title and description stored in the `modal_meta` site option.
* Modal button allowed inside the core Navigation block (filterable).
* Fix: Prevent modal from being displayed on password protected posts.

= 0.1.1 =
* Added: Update URI.

= 0.1.0 =
* Release.
