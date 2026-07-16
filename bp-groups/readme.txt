=== Bp Groups Gutenberg ===
Contributors:      wpspecialprojects
Tags:              block BuddyPress
Tested up to:      6.8
Stable tag:        0.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Block for BuddyPress Groups

== Description ==

Three custom blocks and four block variations for BuddyPress groups.

## Custom Blocks:

- Group Contributors
A list Contributors for the current group

- Groups list
A query loop type block that allows viewing of a list of groups.
Options include:
- Display in Column or list
- Number of Columns if Colums is chosen
- Display groups based on group type, if group types have been set up
- Order by standard BuddyPress orders e.g. Last active etc
- How many items to display per page.

Note this does not support pagination currently.

- Group Progress
A block and setting that can display the progress of a group in the style of a thermometer. This must be set up manually.

## Block Variations:

- Groups Heading (core/heading variation)
Displays the group name and a link to the group if it is not on the group single page.

- Groups Cover Image (core/image variation)
Displays the group cover image if this setting is on for groups.

- Groups Avatar Image (core/image variation)
Displays the group avatar image if this setting is on for groups. This also has an option to add a link to the group page.

- Groups Description (core/paragraph variation)
The group description

## Filters

To remove the progress bar there is a filter that will remove the block and the setting from BuddyPress groups.

```
add_filter( 'bp_groups_progress_bar', function() {
	return false;
} );
```

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/bp-groups` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress

= Building from source =

Requirements: Node.js 18+.

1. `cd bp-groups`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= Does this work if BuddyPress is not installed? =

No these are BuddyPress group blocks only

= Can I use these blocks on an FSE template? =

You can use these blocks on a template that corresponds with the BuddyPress Group Archive page, or a BuddyPress group single page.
They will not work on other template pages, except the Groups list block, which can be used anywhere

= Can I use these blocks on a post or page? =

The only block that will work on a post or page is the Groups List Block. However you can use all of these blocks as innerblocks
of the groups list block, because they will inherit the group ID from the query, similar to the query loop block.

= Can I remove any blocks or block variations I don't like? =

Yes you can remove custom blocks in the normal way using the `unregister_block_type()` (php)

for block variations:

```
wp.domReady( () => {
    wp.blocks.unregisterBlockVariation( 'core/image','bp-groups-avatar-image' );
} );
``` 


== Screenshots ==

1. Screenshot in the wp-admin of the Groups List, with the other blocks / block variations added as innerblocks. 
2. Screenshot of how this looks in the front end.

== Changelog ==

= 0.2.0 =
Updates to the BP Groups Contributors block.

- Added block.json supports for:
  - Background and text colors
  - Margin and Padding
  - Font size, Line Height, Text Align
- Added option to hide the avatar list (showing just the member count)
- Added option to link to the members home page
- Added option to hide the members count


= 0.1.0 =
* Release


