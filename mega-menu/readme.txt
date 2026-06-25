=== Mega Menu ===
Contributors:      wpspecialprojects
Tags:              block, navigation, menu, mega-menu, interactivity
Tested up to:      6.8
Stable tag:        0.2.2
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A Navigation block child that adds a menu item which opens a full template-part area as an accessible mega menu.

== Description ==

Mega Menu adds a single block, **Mega Menu**, that lives inside the core Navigation block. Each Mega Menu item shows a clickable label in the navigation bar; clicking it opens a panel that renders a template part you have built in the Site Editor. This lets you compose rich, full-width dropdown menus — columns, headings, images, and any other blocks — using the standard template-part editing workflow rather than a bespoke menu builder.

The plugin registers a dedicated "Mega Menu" template part area (the **Menu** area) so the panels you design are kept separate from headers, footers, and other template parts. The frontend is powered by the WordPress Interactivity API, so opening and closing menus, keyboard handling, and outside-click dismissal all work without writing custom JavaScript.

= Features =

* **Navigation block integration** — the Mega Menu block is registered as a child of `core/navigation` and is added to the Navigation block's allowed blocks, so it appears in the Navigation block's inserter.
* **Template-part driven panels** — each menu item opens a template part you select. Build the panel contents with any blocks in the Site Editor, then point the menu item at it.
* **Dedicated "Mega Menu" template part area** — the plugin adds a custom template part area (the `menu` area, labelled "Mega Menu") so your menu panels are grouped separately from other template parts.
* **Editor controls** — a Settings panel in the block sidebar provides a **Label** field and a **Menu Template** combobox listing every template part in the Menu area. The label can also be edited inline. If no Menu-area template parts exist yet, the editor shows a prompt to create one.
* **Accessible toggle button** — on the frontend the menu renders as an `<li>` with a `<button>` carrying `aria-haspopup`, `aria-expanded`, and `aria-controls`, plus a labelled container `<div>`.
* **Interactivity API behaviour** — clicking the button toggles the panel, opening it moves focus to the first link inside, **Escape** closes the menu and returns focus to the button, and clicking outside the panel closes it. A `mega-menu-open` class is toggled on the page `<body>` while a menu is open.
* **Theming filters** — `a8csp_mega_menu_area_args`, `a8csp_mega_menu_extra_block_wrapper_attributes`, `a8csp_mega_menu_button_classes`, and `a8csp_mega_menu_container_classes` let you adjust the template part area definition and the markup classes/attributes.

== Installation ==

1. Upload the `mega-menu` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. In the Site Editor, create a template part in the **Mega Menu** area and add the blocks you want the panel to contain.
4. Edit your Navigation block, add a **Mega Menu** item, set its **Label**, and choose your template part from the **Menu Template** combobox.

= Building from source =

Requirements: Node.js 18+.

1. `cd mega-menu`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= How do I create the content shown inside a mega menu? =

The panel content is a template part. In the Site Editor, create a new template part and assign it to the **Mega Menu** area, then add any blocks you like (columns, headings, images, links, and so on). That template part becomes selectable on the Mega Menu block.

= Why is the Menu Template dropdown empty? =

The combobox only lists template parts in the Menu area. If you have not created one yet, the block shows a prompt asking you to create a menu template part with the **Mega Menu** category. Create one in the Site Editor and it will appear in the dropdown.

= Where does the Mega Menu block appear in the inserter? =

It is a child of the core Navigation block. Add or edit a Navigation block, then insert **Mega Menu** from within it. It is not intended to be used as a standalone block outside of Navigation.

= How does a visitor close an open menu? =

A menu closes when the visitor clicks its button again, presses the **Escape** key, or clicks anywhere outside the open panel. When closed via Escape, focus returns to the menu button.

= Does this require any custom JavaScript or page builder? =

No. The frontend behaviour is built on the WordPress Interactivity API and ships with the plugin. You only need the block editor and Site Editor to configure menus.

== Changelog ==

= 0.2.2 =
* Mega Menu block (`a8csp/mega-menu`) registered as a child of the core Navigation block, with **Label** and **Menu Template** controls.
* Custom "Mega Menu" template part area for building menu panel content in the Site Editor.
* Interactivity API frontend: toggle, focus management, Escape-to-close, and outside-click dismissal, with a `mega-menu-open` body class.
* Theming filters for the area definition, wrapper attributes, button classes, and container classes.
* Added Update URI for self-hosted plugin updates.

= 0.2.1 =
* Fixed: Ensure the Escape key consistently closes the mega menu regardless of focus position within the menu overlay.

= 0.2.0 =
* Fixed: Update styles so the full-width menu works when center or right aligned, as well as left aligned in the header.
* Fixed: Update view.js so that clicking outside the mega menu closes it.
