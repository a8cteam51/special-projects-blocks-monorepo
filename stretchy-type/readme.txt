=== Stretchy Type ===
Contributors:      wpspecialprojects
Tags:              block, typography, svg, responsive, heading
Tested up to:      6.8
Stable tag:        0.1.3
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A block that displays a single line of text scaled to fill the full width of its container.

== Description ==

Stretchy Type is a Gutenberg block that stretches a single line of text so it always fills the width of its container. The text is rendered inside an SVG `<foreignObject>` and a `viewBox` is recalculated whenever the container is resized, so the type scales fluidly with the layout instead of being pinned to a fixed font size.

Because the size is driven entirely by the available width, there is no font-size control. Everything else behaves like a normal text block: it inherits the supports of the core Paragraph block, and you can convert existing Paragraph or Heading blocks into Stretchy Type (and back) with a single click.

= Features =

* **Width-filling text** — a single line of rich text is rendered inside an SVG `<foreignObject>` and scaled so it always fills the width of its container.
* **Live resizing** — a `ResizeObserver` recomputes the SVG `viewBox` in both the editor and on the frontend, so the text rescales automatically when the container or viewport changes.
* **Single-line by design** — line breaks are disabled and whitespace is preserved, keeping the text on one continuous line so it can stretch edge to edge.
* **Inherits Paragraph supports** — the block reuses the block supports of `core/paragraph` (such as color and spacing), with the font-size control intentionally removed because sizing is controlled by the container width.
* **Block transforms** — convert a core Paragraph or Heading block into Stretchy Type, and convert a Stretchy Type block back into a Paragraph, from the block toolbar.
* **Self-updating** — ships with an update mechanism (via the plugin `Update URI`) that pulls new releases from the Automattic Special Projects blocks monorepo.

== Installation ==

1. Upload the `stretchy-type` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Open any post or page in the block editor, click the **+** inserter, and search for **Stretchy Type**.

= Building from source =

Requirements: Node.js 18+.

1. `cd stretchy-type`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= How does the text get sized? =

The block does not use a font-size setting. Your text is rendered inside an SVG `<foreignObject>`, and the SVG `viewBox` is recalculated to match the text's dimensions, so the type scales up or down to fill the width of whatever container it sits in.

= Why is there no font-size control? =

Font size is determined automatically by the container width, so a manual font-size control would have no effect. For that reason the font-size option is removed, while the block keeps the other supports inherited from the core Paragraph block.

= Can I use more than one line of text? =

No. The block is designed for a single stretched line, so line breaks are disabled. Whitespace is preserved, but the text stays on one continuous line.

= Can I convert existing text blocks into Stretchy Type? =

Yes. You can transform a core Paragraph or Heading block into Stretchy Type from the block toolbar, and you can transform a Stretchy Type block back into a Paragraph.

= Does the text resize when the screen changes? =

Yes. A `ResizeObserver` watches the container in both the editor and on the frontend and updates the SVG `viewBox` whenever the container is resized, so the text rescales automatically.

== Changelog ==

= 0.1.3 =
* Single-block plugin providing the **Stretchy Type** block, which scales a single line of rich text to fill the width of its container using an SVG `<foreignObject>` and a `ResizeObserver`-driven `viewBox`.
* Font-size control removed; remaining block supports inherited from the core Paragraph block.
* Block transforms to and from core Paragraph (and from core Heading).
* Self-update support via the plugin `Update URI`.

= 0.1.2 (2025-08-02) =
* Fixed front-end class not applying.

= 0.1.1 (2025-08-02) =
* Added Update URI.
