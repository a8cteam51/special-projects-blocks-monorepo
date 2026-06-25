=== Table Plus ===
Contributors:      wpspecialprojects
Tags:              block, table, gutenberg
Requires at least: 6.8
Tested up to:      6.8
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A structured, flexible table block for the WordPress block editor with per-cell editing, header/footer rows, and customisable borders.

== Try it in WordPress Playground ==

[Open the Table Plus demo in WordPress Playground](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/a8cteam51/special-projects-blocks-monorepo/trunk/table-plus/blueprint.json) — spins up a fresh WordPress, installs the latest release, and lands you in the editor on a populated demo post. No install required.

== Description ==

Table Plus is a Gutenberg block plugin that replaces the core Table block with a more flexible, composable alternative. It is built from three nested inner blocks — Table Plus, Table Plus Row, and Table Plus Cell — so each part of the table is independently editable and stylable through the standard block editor interface.

= Features =

* **Structured inner blocks** — the table is composed of Row blocks, each containing Cell blocks. Add, reorder, or delete rows and columns without losing content.
* **Header / footer rows** — toggle any row to a header or footer using the block toolbar. On the frontend, header rows render inside `<thead>` (with `<th scope="col">` cells), footer rows inside `<tfoot>`, and the rest inside `<tbody>`, regardless of source order.
* **Add row below** — a toolbar button on each Row block inserts a new row immediately below, matching the current column count.
* **Add column right** — a toolbar button on each Cell block inserts a new column to the right across all rows simultaneously.
* **Delete row / Delete column** — toolbar buttons on the parent Table Plus block remove the currently selected row or column.
* **Tab key navigation** — pressing Tab while editing a cell moves focus to the next cell to the right, wrapping to the first cell of the next row.
* **Cell border controls** — a "Cell Borders" panel in the block sidebar lets you set border width (0–10 px), border style (solid, dashed, dotted, or none), and border colour. Borders are applied at the cell level using CSS custom properties, so all four sides of every cell are consistent.
* **Typography** — font size can be set on the Table Plus block (applies to all cells) and on individual Row blocks.
* **Colour** — background and text colour can be set on the Table Plus block and on individual Row blocks.
* **Inter font** — the block loads the Inter typeface (400, 600, and 800 weights) via Google Fonts. Bold text inside cells uses Inter 800 (Extra Bold).
* **Semantic frontend output** — in the editor the block renders `<div>` elements to avoid browser table-layout quirks; on the frontend it renders clean, accessible `<table>` HTML grouped into `<thead>`, `<tbody>`, and `<tfoot>` sections via a server-side render callback.

== Installation ==

1. Upload the `table-plus` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Open any post or page in the block editor, click the **+** inserter, and search for **Table Plus**.

= Building from source =

Requirements: Node.js 18+.

1. `cd table-plus`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= How do I add a new row? =

Click on a row to select it, then click the **+** (Add row below) button in the block toolbar. A new row with the same number of empty cells is inserted immediately below.

= How do I add a new column? =

Click on any cell to select it, then click the **Add column right** button (grid-with-arrow icon) in the block toolbar. A new column is inserted to the right of that cell across every row.

= How do I delete a row or column? =

Select any cell or row inside the table, then select the parent **Table Plus** block (click the Table Plus label in the block breadcrumb or the toolbar). The **Delete row** and **Delete column** toolbar buttons will become active.

= How do I mark a row as a header or footer? =

Click on a row to select it, then click the **Header row** or **Footer row** button in the block toolbar. Header rows are rendered inside `<thead>` (with `<th scope="col">` cells) and footer rows inside `<tfoot>` on the frontend; everything else falls into `<tbody>`. Click the same button again to clear the designation.

= How do I navigate between cells with the keyboard? =

While editing a cell, press **Tab** to move to the next cell on the right. At the end of a row, Tab jumps to the first cell of the next row.

= How do I change the table border? =

Select the Table Plus block, then open the **Styles** tab (half-circle icon) in the right sidebar. The **Cell Borders** panel lets you adjust border width, style, and colour. The border is applied to every cell edge, so all four sides of the table are covered.

== Screenshots ==

1. Table Plus block in the editor showing header cells, data rows, and the Cell Borders sidebar panel.
2. Frontend output with Inter typography and custom cell borders.

== Changelog ==

= 0.1.0 =
* Initial release.
* Three-block architecture: Table Plus, Table Plus Row, Table Plus Cell.
* Add/delete row and column toolbar buttons.
* Header / footer row toggle with `<thead>` / `<tfoot>` server-side rendering.
* Tab key navigation between cells.
* Cell border controls (width, style, colour) via CSS custom properties.
* Inter font (400/600/800) loaded via Google Fonts.
* Color and typography block supports on Table Plus and Table Plus Row.
