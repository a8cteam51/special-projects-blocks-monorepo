=== Dynamic Table of Contents ===
Contributors:      The WordPress Contributors
Tags:              block
Tested up to:      6.1
Stable tag:        0.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Creates a table of contents that&#39;s dynamically (PHP) rendered.

== Description ==

This is the long description. No limit, and you can use Markdown (as well as in the following sections).

For backwards compatibility, if this section is missing, the full length of the short description will be used, and
Markdown parsed.

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/dynamic-table-of-contents` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


== Frequently Asked Questions ==

= A question that someone might have =

An answer to that question.

= What about foo bar? =

Answer to foo bar dilemma.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Filters ==

= `a8csp_dynamic_table_of_contents_heading_selectors` =

Filters the CSS selectors used by the view script to collect headings for the table of contents.

**Parameters**

* `string[] $default_heading_selectors` - Array of selectors for table of contents headings.
* `array    $attributes`                - Block attributes.
* `WP_Block $block`                     - The block object.

**Return**

An array of selectors.

**Example - limit the TOC to H2 headings only**

`
add_filter(
    'a8csp_dynamic_table_of_contents_heading_selectors',
    static function ( array $heading_selectors ): array {
        return array( '.wp-block-post-content h2' );
    }
);
`

**Example - drop H1 from the TOC, keep everything else**

`
add_filter(
    'a8csp_dynamic_table_of_contents_heading_selectors',
    static function ( array $heading_selectors ): array {
        return array_values(
            array_diff( $heading_selectors, array( '.wp-block-post-content h1' ) )
        );
    }
);
`

== Changelog ==

= 0.2.0 =
* Add `a8csp_dynamic_table_of_contents_heading_selectors` filter to customize which headings are listed in the TOC.

= 0.1.0 =
* Release

== Arbitrary section ==

You may provide arbitrary sections, in the same format as the ones above. This may be of use for extremely complicated
plugins where more information needs to be conveyed that doesn't fit into the categories of "description" or
"installation." Arbitrary sections will be shown below the built-in sections outlined above.
