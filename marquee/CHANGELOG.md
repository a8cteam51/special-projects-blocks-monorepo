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
