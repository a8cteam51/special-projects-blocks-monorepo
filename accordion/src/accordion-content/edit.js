import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Edit( { attributes: { templateLock } } ) {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InnerBlocks
				template={ [
					[
						'core/paragraph',
						{ placeholder: 'Accordion item content goes here.' },
					],
				] }
				templateLock={ false }
			/>
		</div>
	);
}
