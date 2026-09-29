=== Reactions ===
Contributors:      wpspecialprojects
Tags:              block, reactions, emoji, engagement, interactivity
Requires at least: 6.6
Tested up to:      6.8
Stable tag:        0.1.1
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A block that lets visitors react to a post with emoji, stores each reaction, and shows live counts on the frontend and in the admin.

== Description ==

Reactions is a Gutenberg block plugin that adds emoji reactions to your content. It is built from two nested blocks — a **Reactions** container block and individual **Reaction** child blocks — so you choose exactly which reactions to offer and how they are laid out. On the frontend, reactions are powered by the WordPress Interactivity API: clicking a reaction records it, updates the visible count immediately, and lets the same visitor toggle their choice on or off.

Each visitor is identified by a session token stored in the browser's local storage, so both guests and logged-in users can react. Every reaction is saved to a dedicated database table, and the captured data is surfaced both as a per-post count column and as a searchable, sortable admin table.

= Features =

* **Two-block architecture** — a parent **Reactions** container holds one or more **Reaction** child blocks, each representing a single emoji. Add, remove, or reorder reactions using the standard block editor.
* **Eleven reaction variations** — insert any of Like, Fire, Laugh, Heart, Cry, Surprised, Angry, Celebration, Sunglasses, Dislike, and Star, each with its own SVG icon.
* **Default and Popover modes** — Default mode renders all reactions inline; Popover mode shows a single button that opens a popover containing the reactions, with configurable button text (default "React").
* **Show / hide labels** — optionally display a text label next to each emoji. The label text is set per Reaction block and only appears when the parent block enables labels.
* **Show / hide counts** — optionally display the running total of each reaction (on by default).
* **Toggle and undo** — clicking a reaction records it; clicking the same reaction again removes it. Switching to a different reaction updates the visitor's choice.
* **Live frontend updates** — counts and the visitor's active reaction update in place via the Interactivity API, backed by a nonce-protected REST endpoint.
* **Guest and logged-in support** — visitors are tracked by a local-storage session token, so reactions work without requiring an account; logged-in reactions also record the user ID.
* **Reactions Count column** — a "Reactions Count" column is added to the Posts list table (and to the `note` custom post type list) showing how many reactions each entry has received.
* **Reactions Data screen** — a "Reactions Data" submenu under Posts presents every recorded reaction in a DataViews table (Post, Reaction, User, Date) that is sortable and searchable.
* **Self-managed table** — the plugin creates its reactions table on activation and shows an admin notice with a one-click "Create Table" button if the table is ever missing.
* **Block supports** — the Reactions block supports text color, font size, line height, block gap, margin, and padding through the standard block editor controls.

== Installation ==

1. Upload the `reactions` folder to the `/wp-content/plugins/` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress. Activation creates the `wpcomsp_reactions` database table.
3. Open any post or page in the block editor, click the **+** inserter, and search for **Reactions**. Add the container, then insert the individual Reaction blocks you want to offer.

= Building from source =

Requirements: Node.js 18+.

1. `cd reactions`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Frequently Asked Questions ==

= How do I choose which reactions appear? =

Insert the **Reactions** block, then add **Reaction** child blocks inside it. Each Reaction block offers a variation (Like, Fire, Laugh, Heart, Cry, Surprised, Angry, Celebration, Sunglasses, Dislike, or Star). Add as many or as few as you like.

= How do I show text labels next to each emoji? =

Select the parent **Reactions** block and turn on **Show labels** in the Settings panel. The label text itself is set on each individual Reaction block via the **Text** field; it is only visible when the parent block has labels enabled.

= What is the difference between Default and Popover mode? =

In **Default** mode all reactions are shown inline. In **Popover** mode a single button is shown that opens a popover containing the reactions. When Popover mode is selected you can also set the button's text in the **Popover Settings** panel (it defaults to "React").

= Can visitors react without logging in? =

Yes. Each visitor is assigned a session token stored in their browser's local storage, so guests can react. When a logged-in user reacts, their user ID is recorded as well.

= Where can I see the reactions that have been left? =

Each post's total appears in the **Reactions Count** column on the Posts list screen. For a full breakdown, go to **Posts > Reactions Data**, which lists every reaction with its post, reaction type, user, and date in a sortable, searchable table.

= The admin shows a "Reactions table is missing" notice. What do I do? =

Click the **Create Table** button in that notice. The plugin will recreate the `wpcomsp_reactions` database table. This table is normally created automatically when the plugin is activated.

== Changelog ==

= 0.1.1 =
* Added an Update URI for self-managed plugin updates.
* Reactions block with Default and Popover modes, plus show/hide labels and counts.
* Eleven Reaction child-block variations with SVG icons and per-block text labels.
* Frontend reactions powered by the Interactivity API with toggle/undo and live counts.
* Nonce-protected REST endpoints for recording and retrieving a visitor's reaction.
* Guest and logged-in support via a local-storage session token, stored in a dedicated database table.
* Reactions Count column on the Posts and `note` list screens.
* Reactions Data admin screen built with DataViews.
* Automatic reactions-table creation on activation with a "Create Table" recovery notice.

= 0.1.0 =
* Initial version.
