/**
 * Builds the CSS custom properties shared by the editor and saved markup.
 *
 * The column gap comes from the horizontal value of the core Block spacing
 * control, so theme spacing presets are available.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Inline style object.
 */
export default function getColumnStyle( attributes ) {
	const {
		columnCount,
		columnMinWidth,
		columnRuleStyle,
		columnRuleWidth,
		columnRuleColor,
		customColumnRuleColor,
		style,
	} = attributes;
	const gap = style?.spacing?.blockGap?.left;

	return {
		'--a8csp-flowing-column-column-count': columnCount
			? String( columnCount )
			: 'auto',
		'--a8csp-flowing-column-column-min-width':
			parseFloat( columnMinWidth ) > 0 ? columnMinWidth : 'auto',
		'--a8csp-flowing-column-column-gap': gap?.startsWith(
			'var:preset|spacing|'
		)
			? `var(--wp--preset--spacing--${ gap.split( '|' ).pop() })`
			: gap,
		'--a8csp-flowing-column-column-rule-style': columnRuleStyle,
		'--a8csp-flowing-column-column-rule-width':
			columnRuleWidth || undefined,
		'--a8csp-flowing-column-column-rule-color': columnRuleColor
			? `var(--wp--preset--color--${ columnRuleColor })`
			: customColumnRuleColor,
	};
}
