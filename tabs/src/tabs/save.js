/**
 * WordPress dependencies
 */
import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Render a single tab button for the saved block markup.
 *
 * The component outputs a non-interactive container element with ARIA attributes used
 * by the tablist (role="tab", aria-selected, aria-controls) and a span containing the
 * tab title. When `isSelected` is false the tab receives tabIndex="-1" so it is
 * skipped by sequential keyboard navigation in the saved HTML.
 *
 * @param {Object} props
 * @param {boolean} props.isSelected - True when this tab is the active/selected tab.
 * @param {number} props.tabNumber - 1-based index used to build the element IDs.
 * @param {string} props.title - Visible label for the tab.
 * @return {WPElement} Rendered element for inclusion in saved block content.
 */
function TabButton( { isSelected, tabNumber, title } ) {
	return (
		<div
			id={ `tab-${ tabNumber }` }
			type="button"
			role="tab"
			className='tab'
			aria-selected={ isSelected }
			aria-controls={ `tabpanel-${ tabNumber }` }
			tabIndex={ isSelected ? undefined : '-1' }
		>
			<RichText.Content
				tagName="span"
				value={ title }
				className="tab-button-text"
			/>
		</div>
	);
}

export default function save( { attributes: { tabs } } ) {
	const tabButtons = [];
	for ( let index = 0; index < tabs?.length; index++ ) {
		const tabNumber = index + 1;
		const tabBlock = tabs[ index ];
		const title = tabBlock?.title || `Tab ${ tabNumber }`;
		tabButtons.push(
			<TabButton
				key={ index }
				tabNumber={ tabNumber }
				isSelected={ tabNumber === 1 }
				title={ title }
			/>
		);
	}

	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<div role="tablist">{ tabButtons }</div>
			<InnerBlocks.Content />
		</div>
	);
}
