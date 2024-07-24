import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default function Edit( { attributes: { autoclose }, setAttributes } ) {
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Settings' ) } initialOpen={ true }>
					<ToggleControl
						isBlock
						label={ __( 'Autoclose' ) }
						onChange={ ( value ) => {
							setAttributes( {
								autoclose: value,
							} );
						} }
						checked={ autoclose }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					template={ [ [ 'wpsp/accordion-item', {} ] ] }
					renderAppender={ InnerBlocks.DefaultBlockAppender }
				/>
			</div>
		</>
	);
}
