0.1.8
- Add: Margin (top and bottom) and Border (color, width, style, radius) block supports, so both appear in the Styles panel like they do for Group (COOL-4).
- Update: Fade Edges masks the scrolling content instead of the whole block, so a background colour or border is no longer faded at the edges along with the items.
- Update: The editor's dashed placeholder border is drawn as an outline, so it no longer collides with a border set through the new control.

0.1.7
- Add: Vertical alignment (top, center, bottom) is now also in the block toolbar, matching the Row block (COOL-17). The sidebar control is kept, so both write the same attribute.

0.1.6
- Fix: In Safari, the whole row could blank for a single frame now and then while scrolling, which looked like a flash (COOL-13). Safari tiles the backing store of the wide animated track and could drop those tiles for a frame; each item now sits on its own compositing layer, so the track itself has nothing to paint. Lazy image loading was ruled out as the cause: it reproduced with eager images on 0.1.5.

0.1.5
- Fix: The editor's Preview Animation ran at a different speed than the front end (slower whenever the content was wider than the block). Speed now means the same thing in both places: pixels per second.
- Fix: The front-end speed depended on how many copies of the content were needed to fill the row, so narrow content moved slower than the Speed setting. It now moves at the set speed regardless of content width.
- Fix: The editor preview could fail to move at all depending on stylesheet load order, because the preview and the front end shared a keyframe name.

0.1.4
- Fix: Images past the edge of the row could stay blank, and in Safari never load, because WordPress lazy-loads them and the row clips them. Every image in the row now loads as soon as the row is near the viewport. On 0.1.1 and earlier this left the marquee frozen.
- Fix: The loop distance could be measured before every image had loaded and never corrected, so the row jumped back partway through a loop. Each item is now watched for size changes.
- Fix: A full-width marquee inside a container with root padding stopped short of the right edge.
- Remove: The self-update mechanism. Updates are now installed manually from GitHub releases.

0.1.3
- Add: Respect `prefers-reduced-motion`. The row stays still, shows the content once (no duplicated copies), and content wider than the block can be scrolled horizontally, including with the keyboard (the row becomes a focusable, labelled region while it can scroll). With Limit Height on, the row grows to fit the scrollbar instead of clipping items. Fade Edges is turned off while the row is still, so edge content isn't hidden. The editor's Preview Animation is unaffected.

0.1.2
- Add: Vertical alignment control (top, center, bottom) for marquee items.
- Add: "Limit Height" toggle with a max height value, so items of mixed sizes fit inside a consistent band. Sets the `--marquee-max-height` custom property, which images also respect (defaults to the previous 200px when the toggle is off).
- Fix: The view script could hang the browser main thread. When the measured content width was 0 (empty marquee, or a block not laid out yet), the duplication loop bound evaluated to `Infinity` and spun forever. Widths are now validated before use.
- Update: The view script measures with a ResizeObserver instead of `DOMContentLoaded`, so marquees that are hidden at load time (modals, tabs, accordions) or injected later set themselves up correctly. Multiple instances per page are supported, and off-screen instances pause.
- Update: Fade Edges now applies `mask-image` directly to the block, so the fade works over any background instead of only white.
- Update: Gap between items can now be set up to 200px.
- Update: `@wordpress/scripts` to 31.3.
- Update: `npm run plugin-zip` now includes the `/classes/` directory.

0.1.0
Initial release
