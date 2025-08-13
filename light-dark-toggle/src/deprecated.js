import { useBlockProps } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		defaultMode: {
			type: 'string',
			default: 'light',
		},
	},
	save( { attributes } ) {
		const { defaultMode } = attributes;

		const className = [ defaultMode ? `mode-${ defaultMode }` : '' ]
		.join( ' ' )
		.trim();
		return (
			<button
				{ ...useBlockProps.save( { className } ) }
				data-default-mode={ defaultMode }
			></button>
		);
	}
};

export default [ v1 ];