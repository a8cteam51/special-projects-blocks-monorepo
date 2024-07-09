import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { openByDefault } = attributes;

	return (
		<>
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Display' ) }>
					<PanelRow>
						<ToggleControl
							label={ __( 'Open by default' ) }
							onChange={ ( value ) => {
								setAttributes( {
									openByDefault: value,
								} );
							} }
							checked={ openByDefault }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<InnerBlocks
					template={ [
						[ 'wpsp/accordion-item-trigger', {} ],
						[ 'wpsp/accordion-item-content', {} ],
					] }
				/>
			</div>
		</>
	);
}
