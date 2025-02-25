import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { defaultMode } = attributes;

	// Ensure the mode is set to either 'light' or 'dark' in the button class.
	const className = [ defaultMode ? `mode-${ defaultMode }` : '' ]
		.join( ' ' )
		.trim();
	const label = sprintf(
		/* translators: %s: color mode */
		__( 'Switch to %s mode', 'light-dark-toggle' ),
		defaultMode
	);

	return (
		<button
			{ ...useBlockProps.save( { className } ) }
			data-default-mode={ defaultMode }
			aria-label={ label }
		></button>
	);
}
