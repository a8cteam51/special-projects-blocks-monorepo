/**
 * WordPress dependencies
 */
import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

function TabButton( { isSelected, tabNumber, title } ) {
	return (
		<div
			id={ `tab-${ tabNumber }` }
			role="tab"
			className="tab"
			aria-selected={ isSelected }
			aria-controls={ `tabpanel-${ tabNumber }` }
			tabIndex={ isSelected ? 0 : -1 }
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
			<div className="tabs-container">
				<div
					className="scroll-arrow scroll-arrow-left"
					role="button"
					aria-label={ __( 'Scroll tabs left', 'tabs' ) }
				></div>
				<div role="tablist" className="tablist-wrapper">
					{ tabButtons }
				</div>
				<div
					className="scroll-arrow scroll-arrow-right"
					role="button"
					aria-label={ __( 'Scroll tabs right', 'tabs' ) }
				></div>
			</div>
			<InnerBlocks.Content />
		</div>
	);
}
