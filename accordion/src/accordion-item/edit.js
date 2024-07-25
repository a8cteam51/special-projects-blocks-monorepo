import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default function Edit( {
	attributes: { openByDefault },
	clientId,
	setAttributes,
} ) {
	const isSelected = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } = select( blockEditorStore );
			return isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId, true )
		},
		[ clientId ]
	);
	const blockProps = useBlockProps();

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
						} }
						checked={ openByDefault }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					templateLock="all"
					template={ [
						[ 'wpcomsp/accordion-trigger', {} ],
						[ 'wpcomsp/accordion-content', {} ],
					] }
				/>
			</div>
		</>
	);
}
