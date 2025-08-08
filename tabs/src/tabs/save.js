/**
 * WordPress dependencies
 */
import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

function TabButton( { isSelected, tabNumber, title } ) {
	return (
		<button
			id={ `tab-${ tabNumber }` }
			type="button"
			role="tab"
			aria-selected={ isSelected }
			aria-controls={ `tabpanel-${ tabNumber }` }
			tabIndex={ isSelected ? undefined : '-1' }
		>
			<RichText.Content
				tagName="span"
				value={ title }
				className="tab-button-text"
			/>
		</button>
	);
}

export default function save( { attributes: { activeTab, tabsCount }, innerBlocks } ) {
	const blockProps = useBlockProps.save();

	const tabs = [];
	for ( let index = 0; index < tabsCount; index++ ) {
		const tabNumber = index + 1;
		const tabBlock = innerBlocks[ index ];
		const title = tabBlock?.attributes?.title || '';
		tabs.push(
			<TabButton
				key={ index }
				tabNumber={ tabNumber }
				isSelected={ tabNumber === activeTab }
				title={ title }
			/>
		);
	}

	return (
		<div { ...blockProps }>
			<div role="tablist">{ tabs }</div>
			<InnerBlocks.Content />
		</div>
	);
}
