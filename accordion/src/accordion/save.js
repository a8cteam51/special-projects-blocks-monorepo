import clsx from 'clsx';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { iconPosition } = attributes;

	const className = clsx( {
		'icon-position-left': iconPosition === 'left',
	} );

	return (
		<div { ...useBlockProps.save( { className } ) }>
			<InnerBlocks.Content />
		</div>
	);
}
