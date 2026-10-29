/**
 * Plain-text caption field for a core/image, used by the image's own sidebar
 * panel.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { Button, TextareaControl } from '@wordpress/components';

import {
	captionHasFormatting,
	captionToText,
	isCaptionEmpty,
} from './caption-text';

// Locked while the caption is bound or formatted (until unlocked).
export default function CaptionControl( {
	caption,
	placeholder,
	isBound,
	help: extraHelp,
	onChange,
} ) {
	const [ unlocked, setUnlocked ] = useState( false );
	const textareaRef = useRef();
	const typedRef = useRef( false );
	const hasFormatting = captionHasFormatting( caption );
	const locked = isBound || ( hasFormatting && ! unlocked );

	// Core focuses its own caption field in the canvas when the selected
	// image's caption turns empty. Take focus back so typing here carries on.
	useEffect( () => {
		const textarea = textareaRef.current;

		if (
			typedRef.current &&
			textarea &&
			textarea.ownerDocument.activeElement !== textarea
		) {
			textarea.focus( { preventScroll: true } );
		}

		typedRef.current = false;
	}, [ caption ] );

	// The unlock button unmounts on click, which would drop focus to the page.
	// The caret goes to the end, where typing would carry on.
	useEffect( () => {
		const textarea = textareaRef.current;

		if ( unlocked && textarea ) {
			textarea.focus();
			textarea.setSelectionRange(
				textarea.value.length,
				textarea.value.length
			);
		}
	}, [ unlocked ] );

	let help = extraHelp;
	if ( isBound ) {
		help = __(
			'This caption comes from a bound data source.',
			'newspack-photo-carousel'
		);
	} else if ( hasFormatting ) {
		help = __(
			'This caption has formatting (bold, links or code). Editing it here as plain text removes the formatting.',
			'newspack-photo-carousel'
		);
	}

	return (
		<>
			<TextareaControl
				ref={ textareaRef }
				__nextHasNoMarginBottom
				label={ __( 'Caption', 'newspack-photo-carousel' ) }
				rows={ 2 }
				value={ captionToText( caption ) }
				placeholder={ placeholder }
				readOnly={ locked }
				help={ help }
				onChange={ ( text ) => {
					// A blank write to an empty caption changes nothing, so no
					// caption effect would run to clear the flag.
					if ( text.trim() !== '' || ! isCaptionEmpty( caption ) ) {
						typedRef.current = true;
					}

					onChange( text );
				} }
			/>
			{ ! isBound && hasFormatting && ! unlocked && (
				<div style={ { marginTop: 8 } }>
					<Button
						variant="secondary"
						size="small"
						onClick={ () => setUnlocked( true ) }
					>
						{ __(
							'Edit as plain text',
							'newspack-photo-carousel'
						) }
					</Button>
				</div>
			) }
		</>
	);
}
