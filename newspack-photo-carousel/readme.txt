=== Newspack Photo Carousel ===
Contributors:      wpspecialprojects
Tags:              block, carousel, slider, gallery, newspack
Requires at least: 7.0
Tested up to:      7.1
Requires PHP:      7.4
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A one-photo-at-a-time carousel of curated images, with a thumbnail rail, per-slide captions and Newspack photo credits.

== Description ==

The Photo Carousel block (`newspack/photo-carousel`) shows a set of Image blocks one photo at a time, with a thumbnail rail under the stage. Each slide has its own caption and, with the [Newspack plugin](https://github.com/Automattic/newspack-plugin) active, its Newspack photo credit. Only the current photo and its neighbours load, so the page weight stays flat however many photos the carousel holds.

= Editing =

* Insert **Photo Carousel** (Media category) and upload or pick images. **Add images** in the block toolbar appends more, up to 50.
* Select a slide, then open the image sidebar's **Content** tab:
  * **Photo Caption** sets this slide's caption. It writes the image block's own caption, so a photo can carry a different caption in each post. A caption with formatting (bold, links) is read-only until **Edit as plain text** is chosen; a caption bound to a data source stays read-only.
  * **Photo Credit** sets the image's Newspack credit, credit URL and organization. It edits the attachment, so the credit follows the image everywhere. It is saved with the post, never by an autosave. This box appears only while Newspack is active.
* Reorder slides in List View or with each image's toolbar.
* A Gallery block converts to a Photo Carousel and back, keeping the images and their captions.

Both boxes appear only on images inside a Photo Carousel; other Image blocks are untouched.

= Settings =

* **Accessible label** (`ariaLabel`, default empty): the region's accessible name. Empty means "Photo carousel".
* **Aspect ratio** (`aspectRatio`, default `16/9`): stage shape, one of `16/9`, `3/2`, `4/3`, `1/1` or `4/5`.
* **Crop images to fill frame** (`imageCrop`, default on): fill the frame (cover) or show the whole photo (contain).
* **Autoplay** (`autoplay`, default off) and **Delay** (`autoplayDelay`, default 5000 ms, floored at 1000): auto-advance. Pauses on hover, on focus and in a hidden tab, and never runs for visitors who prefer reduced motion.
* **Show captions** (`showCaptions`, default on).
* **Show credits** (`showCredits`, default on): shown only while Newspack is active.

= Captions and credits =

* An empty slide caption falls back to the image's Media Library caption, as Newspack's Post Carousel does. The caption box shows that caption as its placeholder.
* Credits come from `Newspack\Newspack_Image_Credits`, which stores them in the attachment meta keys `_media_credit`, `_media_credit_url` and `_navis_media_credit_org`. The front end prints `get_media_credit_string()`, so the site's Newspack credit label and class settings apply.
* A credit stored on the image block's `meta` attribute is used when the attachment has none, matching Newspack's image block.
* Newspack registers the credit keys without an `auth_callback`, so core refuses REST writes to them. While Newspack is active, this plugin lets anyone who can edit the attachment save them, the same check as Newspack's own Media Library fields.
* Credit support loads only while Newspack is active: the PHP that prints credits and allows the REST writes, and the editor's credit script (`build/credits`). Without Newspack none of it loads, and the block shows captions only.

= Front end =

* A dependency-free crossfade engine (about 1.7 KB gzipped, plus `wp-i18n`).
* The arrows are the accessible control, and the arrow keys work anywhere in the carousel. Rail clicks and horizontal touch swipes are pointer shortcuts.
* Slides are stacked in one grid cell, so the browser counts all of them as in view and `loading="lazy"` can't defer them. Slides outside the active slide, its neighbours and the previous slide get `hidden` instead: on load only slides 1, 2 and the last download, and each step fetches one more. A rail thumbnail starts its photo after a 150 ms hover, on press, or on focus.
* The stage uses the `2048x2048` image size and the rail uses `medium`, both without srcset: a width-based pick looks soft under a cover crop and over-fetches tiny thumbnails. Jetpack Carousel's per-image `data-*` attributes are stripped.
* The block is a region with `aria-roledescription="carousel"`, and slides follow the APG slide pattern. A polite live region announces "Slide N of M: caption"; autoplay steps are not announced.

= Styling =

The CSS is structural. Colours and type use the theme's presets first (Newspack Block Theme slugs such as `contrast`, `base-2` and `contrast-3`), then the classic Newspack theme's variables, then `newspack-colors` values. At 782px and wider the arrows flank the stage; below that they sit at the ends of the thumbnail rail. Classes follow BEM on `.wp-block-newspack-photo-carousel__*`, and the stage shape is the custom property `--newspack-photo-carousel-aspect-ratio`.

= Filters =

* `newspack_photo_carousel_image_size` ( string $size ): the stage image size. Default `'2048x2048'`.
* `newspack_photo_carousel_thumbnail_size` ( string $size ): the rail image size. Default `'medium'`.
* `newspack_photo_carousel_slide_credit` ( string $html, int $attachment_id, array $parsed_block ): a slide's credit markup. Default `''`; while Newspack is active, Newspack's credit markup is added at priority 5, so a filter at the default priority receives it.

== Installation ==

1. Upload the `newspack-photo-carousel` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Optional: activate the Newspack plugin for photo credits.
4. Open any post or page in the block editor, click the **+** inserter, and search for **Photo Carousel**.

= Building from source =

Requirements: Node.js 18+.

1. `cd newspack-photo-carousel`
2. `npm install`
3. `npm run build` — production build: the block, then the Newspack credits script
4. `npm start` — development build of the block with file watching; `npm run start:credits` watches the credits script

== Frequently Asked Questions ==

= Why is there no credit box? =

Credits are Newspack's. The credit box and the **Show credits** setting appear only while the Newspack plugin is active.

= Why do only three photos load? =

That is the loading window: the current photo, its neighbours and the last one load first, and each step loads one more. Thumbnails load lazily from the `medium` size.

= Can I change the image sizes? =

Yes, with the `newspack_photo_carousel_image_size` and `newspack_photo_carousel_thumbnail_size` filters.

== Changelog ==

= 0.1.0 =
* Initial release.
