=== Flowing Column ===
Contributors:      wpspecialprojects
Tags:              block, columns, layout, responsive
Tested up to:      6.7
Stable tag:        0.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A flexible block that creates flowing column layouts similar to newspaper columns, with responsive behavior and customizable styling options.

== Description ==

The Flowing Column block allows you to create multi-column layouts that automatically flow content from one column to the next, similar to traditional newspaper layouts. This block is perfect for creating readable, organized content sections with customizable column settings.

**Key Features:**
- Maximum number of columns (1-6), or 0 to fit as many as the minimum width allows
- Minimum column width with px, em, or rem units, so columns reflow on narrow screens
- Column gap set from the core Block spacing control, including theme spacing presets
- Optional column rules (dividers) with customizable style, width, and a theme palette color
- Support for WordPress block editor spacing, colors, typography, and border controls

**Use Cases:**
- Article layouts
- Newsletter content
- Feature lists
- Product descriptions
- Any content that benefits from multi-column presentation

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/flowing-column` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. The Flowing Column block will be available in the block editor under the "Design" category

= Building from source =

Requirements: Node.js 18+.

1. `cd flowing-column`
2. `npm install`
3. `npm run build` — production build
4. `npm start` — development build with file watching

== Usage ==

**Adding the Block:**
1. In the WordPress block editor, click the "+" button to add a new block
2. Search for "Flowing Column" or find it in the Design category
3. Select the block to add it to your content

**Configuring Columns:**
- **Maximum columns**: The most columns to show (1-6). Set to 0 to fit as many columns as the minimum width allows. When the minimum width is empty this becomes **Columns** and sets an exact count.
- **Minimum column width**: Columns narrower than this reflow into fewer columns. Leave empty for a fixed number of columns.
- **Column gap**: Set with **Block spacing** under Styles > Dimensions. Pick a theme spacing preset or enter a custom value. Defaults to 2em.
- **Column rule**: Add optional dividers between columns with a style, width, and color.

**Responsive Behavior:**
Columns never get narrower than the minimum column width, so the block drops to fewer columns on smaller screens and to a single column when only one fits.

**Column Balancing:**
The browser balances content so each column ends at roughly the same height. Content that cannot be split across columns, such as images, can leave columns uneven.

== Block Attributes ==

The Flowing Column block includes the following configurable attributes:

**Column Layout:**
- `columnCount` - Maximum number of columns (0-6, default: 2). 0 means as many as fit.
- `columnMinWidth` - Minimum width of each column as a CSS length (default: `200px`). Empty means no minimum.

**Column Spacing:**
- `style.spacing.blockGap.left` - Column gap from the core Block spacing control (default: 2em)

**Column Rules (Dividers):**
- `columnRuleStyle` - Style of column dividers (none, solid, dashed, dotted, double, groove, ridge, inset, outset, default: solid)
- `columnRuleWidth` - Width of column dividers as a CSS length (default: `1px`)
- `columnRuleColor` - Theme palette color slug for column dividers
- `customColumnRuleColor` - Custom color for column dividers (default: the text color)

== Frequently Asked Questions ==

= How many columns can I create? =

You can create between 1 and 6 columns. The block will automatically adjust the layout based on your content and screen size.

= Can I control how the columns behave on mobile? =

Yes. Set a **Minimum column width**. The block shows fewer columns whenever the full number would make columns narrower than that width, down to a single column on small screens.

= What units can I use for measurements? =

Column widths and rule widths accept pixels (px), ems (em), and rems (rem). The column gap uses the core Block spacing control, which offers your theme's spacing presets and the units your theme allows.

= How do I add dividers between columns? =

Use the "Column rule" settings in the block inspector. You can choose from various styles (solid, dashed, dotted, etc.), set the width, and pick a color from your theme's palette or a custom color.

== Screenshots ==

1. Flowing Column block in the WordPress editor with column settings panel open
2. Example of a three-column layout with custom styling and dividers

== Changelog ==

= 0.2.0 =
* Number of Columns is now Maximum columns, and 0 fits as many columns as the minimum width allows
* Minimum column width and rule width are single fields with a unit selector
* Column gap now uses the core Block spacing control, so theme spacing presets are available
* Rule color uses the theme palette and defaults to the text color
* Removed the Minimum Number of Columns setting, which had no effect
* Fixed: blocks using the Groove, Ridge, Inset, or Outset rule style became invalid after reloading the editor
* Fixed: the first-child margin reset applied to nested elements instead of only direct children
* Editor markup now matches the front end, so inner blocks are direct children of the block

= 0.1.0 =
* Initial release with basic column functionality
* Support for 1-6 columns
* Customizable column widths, gaps, and rules
* Responsive behavior with minimum column settings
* Multiple unit options (px, em, rem) for flexible layouts
* Integration with WordPress block editor spacing, colors, typography, and border controls

== Development ==

This block is built using modern WordPress block editor standards and includes:
- React-based editor interface
- CSS custom properties for dynamic styling
- Responsive design with mobile-first approach
- Accessibility considerations for screen readers
- Integration with WordPress theme.json and global styles
