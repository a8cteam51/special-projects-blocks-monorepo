/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function TabButton( { isSelected, tabNumber } ) {
	return (
		<button
			id={ `tab-${ tabNumber }` }
			type="button"
			role="tab"
			aria-selected={ isSelected }
			aria-controls={ `tabpanel-${ tabNumber }` }
			tabIndex={ isSelected ? undefined : '-1' }
		>
			<span>{ `Tab ${ tabNumber }` }</span>
		</button>
	);
}

export default function save( { attributes: { activeTab, tabsCount } } ) {
	const blockProps = useBlockProps.save();

	const tabs = [];
	for ( let index = 0; index < tabsCount; index++ ) {
		const tabNumber = index + 1;
		tabs.push(
			<TabButton
				key={ index }
				tabNumber={ tabNumber }
				isSelected={ tabNumber === activeTab }
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
