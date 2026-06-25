=== Bp Members ===
Contributors:      wpspecialprojects
Tags:              block
Tested up to:      6.8
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Custom block & block variation for BuddyPress members.

== Description ==

One custom block and four block variations for BuddyPress Members.

## Custom Block

- BP Members List
A query loop like block to display users.

Options include:
- Display in Column or list
- Number of Columns if Colums is chosen
- Display members based on member type, if member types have been set up
- Order by standard BuddyPress orders e.g. Last active etc
- How many items to display per page.

Note this does not support pagination currently.

## Custom Block Variations

- Members Heading (core/heading block variation)
Displays the members name. If not on the user profile page, this will link back to the profile page

- Members Avatar (core/image block variation)
Displays the members avatar if avatars are allowed. There is also the option to link this back to the memebers profile page.

- Members Cover Image (core/image block variation)
Displays the members cover image cover images are allowed

- Members X Profile (core/paragraph block variation)
Displays the members x-profile data. This block has a dropdown which allows the editor to pick which data to display here.

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/bp-members` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= Does this work if BuddyPress is not installed? =

No, this will only work with BuddyPress.

= Can I use these blocks on an FSE template? =

You can use these blocks on a template that corresponds with the BuddyPress members archive page, or a BuddyPress user profile page.
They will not work on other template pages, except the Members list block, which can be used anywhere

= Can I use these blocks on a post or page? =

The only block that will work on a post or page is the Members List Block. However you can use the block and block variations as innerblocks
of the members list block, because they will inherit the member ID from the query, similar to the query loop block.

= Can I remove any blocks or block variations I don't like? =

Yes you can remove custom blocks in the normal way using the `unregister_block_type()` (php)

for block variations:

```
wp.domReady( () => {
    wp.blocks.unregisterBlockVariation( 'core/image', 'bp-members-avatar' );
} );

== Screenshots ==

1. Screenshot in the wp-admin of the Members List, with the other blocks / block variations added as innerblocks. 
2. Screenshot of how this looks in the front end.

== Changelog ==

= 0.1.0 =
* Release

