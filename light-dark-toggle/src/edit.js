import { __ , sprintf } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useRefEffect } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import {
	addToggleModeListener,
	toggleColorMode,
	updateToggleClass,
	updateToggleAriaLabel,
} from './shared';
import { PanelBody, SelectControl } from '@wordpress/components';

import './style.scss';

export default function Edit( { attributes, setAttributes } ) {
	const [ localWindow, setLocalWindow ] = useState( 0 );
	const defaultMode = attributes.defaultMode || 'light';

	/**
	 * A reference to the button DOM element used to manage light/dark mode toggling.
	 *
	 * The `containerRef` is set using the `useRefEffect` custom hook, which attaches
	 * necessary event listeners for toggling light/dark mode and updates the toggle
	 * state based on the window object (`defaultView`).
	 *
	 * The hook also cleans up event listeners when the component is unmounted or updated.
	 */
	const containerRef = useRefEffect(
		( element ) => {
			const { ownerDocument } = element;
			const { defaultView } = ownerDocument;

			setLocalWindow( defaultView, defaultView );

			const removeListeners = addToggleModeListener( defaultView );

			updateToggleClass( defaultView );

			return removeListeners;
		},
		[ setLocalWindow ]
	);

	/**
	 * Toggles the light/dark mode.
	 *
	 * @return {void}
	 */
	const toggle = () => {
		if ( ! localWindow ) {
			return;
		}
		toggleColorMode( localWindow );
		updateToggleAriaLabel( localWindow );
	};

	const ariaLabel = sprintf(
		/* translators: %s: color mode */
		__( 'Switch to %s mode', 'light-dark-toggle' ),
		defaultMode
	);

	return (
		<div>
			{ /* Sidebar Settings */ }
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'light-dark-toggle' ) }>
					<SelectControl
						label={ __( 'Default Mode', 'light-dark-toggle' ) }
						value={ defaultMode }
						onChange={ ( value ) =>
							setAttributes( { defaultMode: value } )
						}
						options={ [
							{
								label: __( 'Light', 'light-dark-toggle' ),
								value: 'light',
							},
							{
								label: __( 'Dark', 'light-dark-toggle' ),
								value: 'dark',
							},
						] }
					/>
					<p style={ { marginTop: '10px', color: '#555' } }>
						{ __(
							'Tip: Which ever mode is set, the opposite will have its class added to the body',
							'light-dark-toggle'
						) }
					</p>
				</PanelBody>
			</InspectorControls>

			{ /* Block Content */ }
			<button
				{ ...useBlockProps( { ref: containerRef } ) }
				onClick={ toggle }
				aria-label={ ariaLabel }
			></button>
		</div>
	);
}
