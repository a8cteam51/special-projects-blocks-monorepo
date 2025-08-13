/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

import { Star } from './icons.js';

export default function save( { attributes } ) {
	const { showLabels, size, mode, popoverButtonText } = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-wpcomsp-reactions__${ mode }`,
	} );
	const { children, ...innerBlocksProps } =
		useInnerBlocksProps.save( blockProps );

	return (
		<>
			{ 'default' === mode && (
				<ul { ...innerBlocksProps }>{ children }</ul>
			) }
			{ 'popover' === mode && (
				<div { ...innerBlocksProps }>
					<button>
						<Star />
						{ popoverButtonText }
					</button>
					<ul>{ children }</ul>
				</div>
			) }
		</>
	);
}
