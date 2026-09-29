=== Flowing Column ===
Contributors:      wpspecialprojects
Tags:              block, columns, layout, responsive
Tested up to:      6.7
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A flexible block that creates flowing column layouts similar to newspaper columns, with responsive behavior and customizable styling options.

== Description ==

The Flowing Column block allows you to create multi-column layouts that automatically flow content from one column to the next, similar to traditional newspaper layouts. This block is perfect for creating readable, organized content sections with customizable column settings.

**Key Features:**
- Configurable number of columns (1-6)
- Customizable column minimum width with multiple unit options (px, em, rem)
- Adjustable column gaps with flexible units
- Optional column rules (dividers) with customizable style, width, and color
- Responsive behavior with minimum column settings
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
- **Number of Columns**: Set how many columns to display (1-6)
- **Minimum Number of Columns**: Define the minimum columns on small screens
- **Column Minimum Width**: Set the minimum width each column should have
- **Column Gap**: Adjust the space between columns
- **Column Rule**: Add optional dividers between columns with customizable style, width, and color

**Responsive Behavior:**
The block automatically adapts to different screen sizes while respecting your minimum column settings. On mobile devices, it will stack to the minimum number of columns you've specified.

== Block Attributes ==

The Flowing Column block includes the following configurable attributes:

**Column Layout:**
- `columnCount` - Number of columns (1-6, default: 2)
- `minColumns` - Minimum number of columns on small screens (1+, default: 1)

**Column Dimensions:**
- `columnMinWidth` - Minimum width of each column (100-800, default: 200)
- `columnMinWidthUnit` - Unit for minimum width (px, em, rem, default: px)

**Column Spacing:**
- `columnGap` - Gap between columns (0-5, default: 2)
- `columnGapUnit` - Unit for column gap (px, em, rem, default: em)

**Column Rules (Dividers):**
- `columnRuleStyle` - Style of column dividers (none, solid, dashed, dotted, double, groove, ridge, inset, outset, default: none)
- `columnRuleWidth` - Width of column dividers (0-10, default: 1)
- `columnRuleWidthUnit` - Unit for rule width (px, em, rem, default: px)
- `columnRuleColor` - Color of column dividers (hex color, default: #000000)

== Frequently Asked Questions ==

= How many columns can I create? =

You can create between 1 and 6 columns. The block will automatically adjust the layout based on your content and screen size.

= Can I control how the columns behave on mobile? =

Yes! Use the "Minimum Number of Columns" setting to control how many columns are displayed on small screens. This ensures your content remains readable on all devices.

= What units can I use for measurements? =

The block supports pixels (px), ems (em), and rems (rem) for column widths, gaps, and rule widths. This gives you flexibility to create responsive layouts that scale with your site's typography.

= How do I add dividers between columns? =

Use the "Column Rule" settings in the block inspector. You can choose from various styles (solid, dashed, dotted, etc.), set the width, and pick a color that matches your design.

== Screenshots ==

1. Flowing Column block in the WordPress editor with column settings panel open
2. Example of a three-column layout with custom styling and dividers

== Changelog ==

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
