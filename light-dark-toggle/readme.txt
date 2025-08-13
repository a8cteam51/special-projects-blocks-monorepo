=== Light Dark Toggle ===
Contributors:      The WordPress Contributors
Tags:              block
Tested up to:      6.7
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Example block scaffolded with Create Block tool.

== Description ==

This is a simple block that adds a toggle which will add a class to the sites HTML tag. This will allow theme developers to toggle between light and dark mode.

== Installation ==

Install the plugin and activate, you should then have access to the block.


== Frequently Asked Questions ==

= What is the default mode =

You can set this when you add the block to your theme. `Light` is the default value.

= What happens when you toggle the button =

This will set a value in the users browsers local storage denoting if the site in dark or light mode.

= What happens to the HTML when the button is toggled. =
This will add a `wpcomsp-light-dark-active` to the sites HTML tags. Based on what is set as the default mode, this could be dark or light mode.

== Developers ==

If you would like to change how the toggle look, it can be styled using the `wp-block-wpcomsp-light-dark-toggle` selector.
The inner of the toggle is controlled by `wp-block-wpcomsp-light-dark-toggle:before`

== Changelog ==

= 1.0.0 =
* Inital release

