=== Counter Block ===
Contributors:      wpspecialprojects
Tags:              block, counter, animation, numbers
Tested up to:      6.7
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A simple counter block that animates numbers from a start value to an end value within a set duration. Includes options for pre/post text, typography, and spacing.

== Description ==

The Counter Block allows you to display an animated counter that transitions from a **start number** to an **end number** over a set duration.
It supports **integer and float values** and allows you to add optional **pre- and post-text**, making it easy to integrate into full sentences.

This block also supports WordPress' **typography and spacing controls**, allowing for full customization.

== Installation ==

1. Install and activate the plugin.
2. Add the Counter Block to any post or page.
3. Configure the start/end values, duration, and optional pre/post text.
4. Customize spacing and typography to match your design.

= Building from source =

Requirements: Node.js 18+.

1. `cd counter`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= What values can I use for the counter? =

You can use both **integer** (e.g., `100`) and **float** (e.g., `99.99`) values.

= Can I change the speed of the counter? =

Yes! The duration setting lets you **control how long** (in seconds) the counter animation takes.

= How does the pre/post text work? =

You can add **text before and after** the counter value.
For example:
**"You have earned $100 in rewards!"**
Here, **"$"** is the pre-text, **"100"** is the counter, and **" in rewards!"** is the post-text.

= Can I style the counter text? =

Yes! The block supports **typography and spacing controls**, so you can change font size, line height, padding, margins, and more.

== Developers ==

- The block wrapper uses the class `wp-block-counter-block`.
- The animated number is wrapped inside a `<span class="wp-counter-number">`.
- You can style pre- and post-text using `.wp-counter-pre` and `.wp-counter-post`.

== Changelog ==

= 1.0.0 =
* Initial release
