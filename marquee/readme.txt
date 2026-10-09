=== Marquee ===
Contributors:      wpspecialprojects
Tags:              block, marquee, scrolling, ticker, logos
Requires at least: 6.7
Tested up to:      6.7
Stable tag:        0.1.4
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A container block that scrolls its content horizontally in a continuous loop, for logo strips, headlines and announcement tickers.

== Description ==

Marquee is a container block: add any blocks inside it and they scroll across the page in a seamless loop. On the front end, a small script measures the content, duplicates it enough times to fill the track, and a CSS animation scrolls it.

In the editor the content stays still so it's easy to edit. Use **Preview Animation** in the block settings to see it move.

= Settings =

* **Scroll Direction** — left (default) or right.
* **Speed** — 10 to 200 (default 50). Higher is faster.
* **Gap between items** — 0 to 200px (default 20px).
* **Pause on Hover** — on by default.
* **Fade Edges** — fades the left and right edges with a mask, so it works over any background. Off by default.
* **Limit Height** and **Max Height** — caps the marquee and the items inside it, including images, SVGs and videos, at 40 to 800px, so items of mixed sizes sit in a consistent band. Off by default; images are capped at 200px when it's off.
* **Vertical Alignment** — aligns items to the top, center or bottom of the row.

The block also supports wide and full alignment, background, text and gradient colors, padding, and an HTML anchor.

= Behaviour =

* Marquees hidden when the page loads (for example inside a modal, tab or accordion), or added to the page later, start scrolling once they have a size.
* Marquees scrolled out of view pause until they're visible again.
* Several marquees can run on the same page.
* Visitors whose system asks for reduced motion (`prefers-reduced-motion`) see a still row instead, with no repeated content; content wider than the block can be scrolled horizontally, including with the keyboard.

== Installation ==

1. Upload the `marquee` folder to the `/wp-content/plugins/` directory, or install the release zip through **Plugins > Add New > Upload Plugin**.
2. Activate **Marquee** through the **Plugins** screen.
3. In the block editor, insert a **Marquee** block and add blocks inside it.

= Building from source =

Requirements: Node.js 18+.

1. `cd marquee`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Changelog ==

= 0.1.4 =
* Fix: Images past the edge of the row could stay blank, and in Safari never load, because WordPress lazy-loads them and the row clips them. Every image in the row now loads as soon as the row is near the viewport. On 0.1.1 and earlier this left the marquee frozen.
* Fix: The loop distance could be measured before every image had loaded and never corrected, so the row jumped back partway through a loop. Each item is now watched for size changes.
* Fix: A full-width marquee inside a container with root padding stopped short of the right edge.
* Removed the self-update mechanism. Updates are now installed manually from GitHub releases.

= 0.1.3 =
* Add: Respect `prefers-reduced-motion`. The row stays still, shows the content once, and content wider than the block can be scrolled horizontally, including with the keyboard. Fade Edges is turned off while the row is still.

= 0.1.2 =
* Add: Vertical alignment control (top, center, bottom) for marquee items.
* Add: "Limit Height" toggle with a max height value, so items of mixed sizes fit inside a consistent band.
* Fix: The view script could hang the browser when the measured content width was 0 (an empty marquee, or one not laid out yet).
* Update: Marquees hidden at load (modals, tabs, accordions) or injected later now set themselves up. Multiple instances per page are supported, and off-screen instances pause.
* Update: Fade Edges uses a mask, so the fade works over any background instead of only white.
* Update: Gap between items can be set up to 200px.

= 0.1.0 =
* Initial release.
