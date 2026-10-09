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
