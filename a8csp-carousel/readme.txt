=== Carousel ===
Contributors:      The WordPress Contributors
Tags:              block, carousel, slider
Tested up to:      7.1
Stable tag:        1.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.7
Requires PHP:      8.0

Create responsive image, post, product, or custom content carousels with optional navigation and pagination controls.

== Description ==

Display a horizontal series of content, including:

- Posts, using the Query block;
- Images, using the Gallery block;
- Free-form content cards;
- WooCommerce products.

The Carousel block allows users to navigate content by dragging or swiping, with optional controls provided by the Carousel Navigation and Carousel Pagination blocks.

It supports a screen reader-friendly title, customizable overflow visibility, animation, end behavior, and background color and spacing styles.

The block accepts inner blocks such as Column and Group for flexible layouts, along with Heading and Paragraph for visible titles and descriptions.

Both the Carousel Navigation and Pagination blocks offer customizable colors, sizes, icons, and built-in accessibility support.

== Installation ==

1. Install and activate the plugin.
2. Add the Carousel Block to any post or page.

== Changelog ==

= 1.2.0 =
* Added a Slides per view setting, with its own value for carousels narrower than 600px.
* Added Either side and Left column styles to the Carousel Navigation block, and an icon size setting.
* Pagination: one button per slide on the page; the buttons for slides in view carry `aria-current` instead of `aria-disabled`.
* Fixed the Posts variation putting the track class on the Query Loop as well as its Post Template. Carousels saved that way work again.
* Fixed focus being lost when it returns to a slide out of view, such as when core's image lightbox closes.
* The track no longer moves past its last slide, and Post Template and product tracks get the item gap.
* Fixed navigation stopping after the first move when there is no transition (reduced motion).
* Opening a post no longer marks it as edited when its stored slide count differs.

= 1.1.2 =
* Removed the self-update mechanism. Updates are now installed manually from GitHub releases.

= 0.1.0 =
* Release
