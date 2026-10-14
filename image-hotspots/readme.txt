=== Image Hotspots ===
Contributors:      wpspecialprojects
Tags:              block, hotspots, image map, map, interactivity
Requires at least: 6.8
Tested up to:      7.1
Requires PHP:      7.4
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

An image with hotspots: markers placed on it, each a button that opens a card of any blocks. Easy to place in the editor, accessible on the page.

== Description ==

Image Hotspots adds two blocks that work as a pair:

* **Image Hotspots** (`a8csp/image-hotspots`) holds an image from the media library, shown at its own aspect ratio across the block's width, and the hotspots on it. It accepts only Hotspot blocks.
* **Hotspot** (`a8csp/image-hotspot`) is one marker and its card. The marker sits at a point on the image, stored as `x` and `y` percentages of the image's width and height, so it stays on the same spot at every screen size. Its `label` is the marker's accessible name. Its card is inner blocks: any blocks, such as an image, a heading with a link and a button.

Typical uses are places on a map (event venues, stores, offices), features on a product photo, or parts of a diagram.

= Editing =

* **Choose the image** from the media library, upload one, or use a URL. **Replace** it from the block toolbar. Set its alternative text and resolution in the sidebar.
* **Add a hotspot by clicking the image.** Choose **Add hotspot** in the block toolbar, then click where it goes; or hold Alt (Option on a Mac) and click the image at any time. The sidebar's **Add hotspot at the center** button, and Enter or Space on the toolbar button, add one at the center, for keyboard users. A new hotspot is selected, its label field (in a small tag beside the marker, on the side away from the card) is focused and selected, ready to type, and its card starts with an image, a heading, a paragraph and a button.
* **Drag a marker to move it**, with a mouse, a pen or a finger. Its position shows in the tag while it moves, to 0.1%.
* **Nudge it with the arrow keys** while the marker has focus: 0.5% a step, 5% with Shift. Arrow keys in the card's text move the caret as usual.
* **Set it exactly** in the sidebar: X and Y, the label, the marker point (its center, or its bottom tip for a pin) and the card position (auto, above, below, left or right).
* **Find hotspots in List View**, where each is listed by its label. Their order there is the order in which keyboard users reach them with Tab on the page; drag them in List View to change it. The editor numbers the markers in that order. The page does not show the numbers.
* **The selected hotspot's card shows** on the image where it will appear, editable in place, placed exactly as on the page: the label field sits in the tag outside the card, not in it. The other cards stay hidden so the image stays readable. **Show all cards**, in the toolbar or the sidebar, shows them all for an overview; it does not change the page.
* **Keep cards inside the image**, in the sidebar, is on by default. Turn it off to let cards extend past the image into the content around it, for example over a hero's text above a map.

= On the page =

* Each marker is a `<button type="button">` named by its label, with `aria-expanded` and `aria-controls` pointing at its card. The hotspots are a list, in List View order.
* A card is hidden until its marker opens it. A click or tap toggles it. Only one card on the page is open at a time.
* With **Open cards on: Hover**, a mouse resting on a marker opens its card, and the card closes shortly after the mouse leaves the marker and the card. Clicking a card that hover opened keeps it open. Touch and the keyboard work as they do with Click.
* Escape closes the open card and returns focus to its marker. A click or tap outside closes it. Focus moving out of the hotspot closes it; focus is never trapped.
* The card is placed beside its marker on the chosen side, or the side with room, and kept inside its bounds. By default the bounds are the image. With **Keep cards inside the image** off, they are the nearest container around the image that clips its overflow (a Cover block, for example), or else the page, never wider than the browser window. A side that does not fit flips to the opposite side. When it fits on no side, as on a narrow phone, the card shows below the image at its full width, and the content below moves down to make room.
* The card's fade-in and the marker's color change only run when the visitor has not asked for reduced motion.
* Built with the Interactivity API: a script module, with no other front-end dependencies.

= Styling =

The block ships wireframe styling only: a white marker with a dark ring, and a white card with a thin border. Restyle it from the theme with these CSS custom properties, set on the block or any element above it:

* `--a8csp-image-hotspots-marker-size`, `-marker-background`, `-marker-color`, `-marker-border-width`, `-pin-tip`, `-focus-color`
* `--a8csp-image-hotspots-card-width`, `-card-padding`, `-card-background`, `-card-color`, `-card-border`, `-card-radius`, `-card-shadow`
* `--a8csp-image-hotspots-gap` (between a marker and its card)
* `--a8csp-image-hotspots-card-bounds`: `image` or `page`, where cards are kept. The block sets it from **Keep cards inside the image**; a rule of the theme's, on `.wp-block-a8csp-image-hotspots` or the card, wins over it, so a theme can change it at a breakpoint. For example, `@media (max-width: 600px) { .wp-block-a8csp-image-hotspots { --a8csp-image-hotspots-card-bounds: image; } }`.

For a callout tail, the script sets two properties on a placed card: `--a8csp-image-hotspots-card-marker-x` and `--a8csp-image-hotspots-card-marker-y`, the marker's center measured from the card's top-left corner, in pixels. They follow the card when it is slid sideways to stay in its bounds, so a tail drawn from them still points at the marker. Draw it on the side the card's `data-placement` names. For a card above its marker:

`.wp-block-a8csp-image-hotspots__card[data-placement="above"]::after { content: ""; position: absolute; top: 100%; left: var(--a8csp-image-hotspots-card-marker-x); border: 8px solid transparent; border-top-color: #fff; transform: translateX(-50%); }`

Or style the classes: `.wp-block-a8csp-image-hotspots__canvas`, `__image`, `__markers`, `__marker`, `__marker-icon`, `__marker-label` (visually hidden) and `__card`, and `.wp-block-a8csp-image-hotspot` with `is-anchor-center` or `is-anchor-bottom`, and `is-open`. The card carries `data-placement` (`above`, `below`, `left`, `right` or `stacked`). The Hotspot block's color and typography settings apply to its card. Register block styles for the Hotspot block in the theme, for example for different kinds of pin.

= Filters =

* `a8csp_image_hotspots_image_attributes` and `a8csp_image_hotspots_image_html`: the image's attributes and markup.
* `a8csp_image_hotspots_image_allowed_html`: the HTML the image may contain.
* `a8csp_image_hotspots_context`: the block's Interactivity API context, `openOn` and `closeDelay` (milliseconds; 300 by default).
* `a8csp_image_hotspots_marker_attributes`: the marker button's attributes, directives included.
* `a8csp_image_hotspots_marker_content`: what is inside the marker button. By default an empty icon element and the visually hidden label.
* `a8csp_image_hotspots_marker_allowed_html`: the HTML the marker may contain (the post allowlist plus inline SVG).
* `a8csp_image_hotspots_card_attributes`: the card's attributes.
* `a8csp_image_hotspots_hotspot_html`: the whole markup of one hotspot.

== Installation ==

1. Upload the `image-hotspots` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Open any post or page in the block editor, click the **+** inserter, and search for **Image Hotspots**.

= Building from source =

Requirements: Node.js 18+.

1. `cd image-hotspots`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= How do I add a hotspot with the keyboard? =

Select the Image Hotspots block and press **Add hotspot at the center** in the sidebar, or press Enter on **Add hotspot** in the block toolbar. The new hotspot's label field has focus. Press Shift+Tab to reach its marker, then move it with the arrow keys (Shift for 5% steps), or type X and Y in the sidebar.

= Why does clicking the image not add a hotspot? =

So that clicking the image can select the block. Choose **Add hotspot** in the toolbar first, or hold Alt (Option on a Mac) as you click.

= In what order do keyboard and screen reader users reach the hotspots? =

In their List View order, which the editor's numbers show, not by their place on the image. Reorder them in List View, or with the block toolbar's move buttons, so that the order makes sense, for example west to east on a map.

= What should a hotspot's label say? =

What the marker stands for, short and specific: a place name, a product feature. It names the marker button for screen readers, and the hotspot in List View. It is required: a marker without a label is announced only as "Hotspot".

= Where do I put the marker's point for a pin? =

Choose **Bottom tip (pin)** as the marker point, then place X and Y on the spot the pin points at. The marker sits above the point with its tip on it.

= Why is a card below the image instead of beside its marker? =

It does not fit beside the marker within its bounds on any side, which happens on narrow screens or with tall cards. Below the image, it has the image's full width, and the content below moves down to make room. A narrower card (`--a8csp-image-hotspots-card-width`), shorter content, or turning off **Keep cards inside the image** lets it fit beside the marker more often.

= Can a card extend past the image, over the text above a map? =

Yes: turn off **Keep cards inside the image** in the block's sidebar. Cards may then extend up to the nearest container around the image that clips its overflow, such as a Cover block, or else the page, within the browser window's width. A theme can switch between the two at a breakpoint with `--a8csp-image-hotspots-card-bounds`.

= How do I draw a callout tail that points at the marker? =

Use `data-placement` on the card for the side, and `--a8csp-image-hotspots-card-marker-x` and `-y` for where the marker is. See Styling above.

= Can cards open on hover? =

Yes: set **Open cards on** to **Hover** in the block's sidebar. Hover only applies to a mouse; touch screens and the keyboard open cards on tap, click, Enter or Space.

= Can I change the marker's markup, for example to add an icon? =

Use the `a8csp_image_hotspots_marker_content` filter. Keep the label inside the button, or give the button an `aria-label` with `a8csp_image_hotspots_marker_attributes`. Or draw the icon in CSS on `.wp-block-a8csp-image-hotspots__marker-icon`.

= Does the block work without the theme's styles? =

Yes. It ships the structural CSS it needs and a plain look; the theme restyles it with the custom properties and classes above.

== Changelog ==

= 0.1.0 =
* Initial release: the Image Hotspots and Hotspot blocks.
