import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import clsx from 'clsx';

export default function Edit( {
	attributes: { openByDefault },
	setAttributes,
} ) {
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
						[ 'wpsp/accordion-trigger', {} ],
						[ 'wpsp/accordion-content', {} ],
					] }
				/>
			</div>
		</>
	);
}
