/**
 * WordPress dependencies
 */
import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

function TabButton( { isSelected, tabNumber, title } ) {
	return (
		<div
			id={ `tab-${ tabNumber }` }
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
