import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

export default function Edit( {
	attributes: { openByDefault },
	setAttributes,
} ) {
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
					templateLock="all"
					template={ [
						[ 'wpsp/accordion-trigger', {} ],
						[ 'wpsp/accordion-content', {} ],
					] }
				/>
			</div>
		</>
	);
}
