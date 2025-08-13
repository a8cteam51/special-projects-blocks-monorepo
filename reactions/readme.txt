=== Reactions ===
Contributors:      WordPress.com Special Projects Team
Tags:              block
Tested up to:      6.1
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A plugin that adds a block for reactions.

== Description ==

A plugin that adds a block for reactions.

The plugin consists of a `Reactions` parent block and individual `Reaction` child blocks. The `Reactions` block is a container block that can contain multiple `Reaction` blocks. Each `Reaction` block represents a single reaction.

== Features ==

The `Reactions` block options include:

- Mode: Default / Popover. Default shows all the child reaction blocks outright. Popover shows a single button that opens a popover with all the child blocks.
- Button Text: Visible when using Popover mode. Allows the parent to control the text of the single button.
- Orientation: Layout option to make the child blocks appear horizontally or vertically.
- Show Labels: Controls whether text labels appear next to each emoji. The label's exact text is controlled inside each individual child block.
- Show Counts: Controls whether the amount of total votes each reaction has is shown.

General features:

- The total reaction counts for each post appear inside a new Reaction Count column inside Posts > All Posts.
- Individual reaction data can be viewed in Posts > Reactions Data.

== Development ==

This block comes with minimal styles. Here is an example of how to style the block:

```css
.wp-block-wpcomsp-reaction {
	display: inline-flex;
	transition: 0.2s;

	button {
		appearance: none;
		background: var(--wp--preset--color--base);
		outline: 0;
		border: 0;
		font-size: var(--wp--preset--font-size--medium);
		padding: 12px 15px;
	}
}

.wp-block-wpcomsp-reactions--has-reaction {
	> button {
		background: var(--wp--preset--color--primary);
		color: var(--wp--preset--color--contrast);
	}
}

.wp-block-wpcomsp-reaction--active {
	background: var(--wp--preset--color--primary);
}

/* Popover Mode */
.wp-block-wpcomsp-reactions__popover {
	> button {
		border: 1px solid var(--wp--preset--color--contrast);
		background: var(--wp--preset--color--base);
		padding: 6px 8px;
		transition: 0.2s;
	}

	ul {
		background: var(--wp--preset--color--base);
		color: var(--wp--preset--color--contrast);
		margin-top: 0.5rem;
		transition: 0.1s ease-in-out;

		&:popover-open {
			border: 1px solid var(--wp--preset--color--contrast);
		}
	}
}

/* Popover Mode animation */
@starting-style {
	.wp-block-wpcomsp-reactions__popoverul: popover-open {
		opacity: 0;
		transform: translateY(5px);
	}
}

```

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/reactions` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress


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

== Changelog ==

= 0.1.0 =
* Release

== Arbitrary section ==

You may provide arbitrary sections, in the same format as the ones above. This may be of use for extremely complicated
plugins where more information needs to be conveyed that doesn't fit into the categories of "description" or
"installation." Arbitrary sections will be shown below the built-in sections outlined above.
