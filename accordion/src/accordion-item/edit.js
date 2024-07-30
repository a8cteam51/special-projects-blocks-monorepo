import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';
import clsx from 'clsx';

export default function Edit( {
	attributes: { openByDefault },
	clientId,
	setAttributes,
} ) {
	const [ isSelected, getBlockOrder ] = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock, getBlockOrder } =
				select( blockEditorStore );
			return [
				isBlockSelected( clientId ) ||
					hasSelectedInnerBlock( clientId, true ),
				getBlockOrder,
			];
		},
		[ clientId ]
	);

	const contentBlockClientId = getBlockOrder( clientId )[ 1 ];
	const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );

	useEffect( () => {
		if ( contentBlockClientId ) {
			__unstableMarkNextChangeAsNotPersistent();
			updateBlockAttributes( contentBlockClientId, {
				isSelected: isSelected,
			} );
		}
	}, [
		isSelected,
		contentBlockClientId,
		__unstableMarkNextChangeAsNotPersistent,
		updateBlockAttributes,
	] );

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(
		{
			...blockProps,
			className: clsx( blockProps.className, {
				'is-open': openByDefault || isSelected,
			} ),
		},
		{
			template: [
				[ 'wpcomsp/accordion-trigger', {} ],
				[
					'wpcomsp/accordion-content',
					{
						isSelected: true,
						openByDefault,
					},
				],
			],
			templateLock: 'all',
			directInsert: true,
		}
	);

	return (
		<>
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Settings' ) }>
					<ToggleControl
						label={ __( 'Open by default' ) }
						onChange={ ( value ) => {
							setAttributes( {
								openByDefault: value,
							} );
							if ( contentBlockClientId ) {
								updateBlockAttributes( contentBlockClientId, {
									openByDefault: value,
								} );
							}
						} }
						checked={ openByDefault }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
