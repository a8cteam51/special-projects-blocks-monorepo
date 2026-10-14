/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentControl,
	ContrastChecker,
	useSettings,
} from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import {
	BaseControl,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Button,
	ColorPalette,
} from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';

import { PAUSE_ICON_PATH } from './icons';

/**
 * The theme palette as a flat list, whichever shape the setting comes back in.
 *
 * @param {Array|Object} palette The `color.palette` setting.
 * @return {Array} Palette entries ({ name, slug, color }).
 */
function flattenPalette( palette ) {
	if ( Array.isArray( palette ) ) {
		return palette;
	}
	if ( palette && typeof palette === 'object' ) {
		return [
			...( palette.theme || [] ),
			...( palette.custom || [] ),
			...( palette.default || [] ),
		];
	}
	return [];
}

/**
 * Stores a palette colour as its preset variable, so the button follows the
 * theme if the colour is later changed in Global Styles.
 *
 * @param {string} value   Colour picked in the editor.
 * @param {Array}  palette Palette entries.
 * @return {string|undefined} Value to save.
 */
function toStoredColor( value, palette ) {
	if ( ! value ) {
		return undefined;
	}
	const match = palette.find(
		( entry ) => entry.color.toLowerCase() === value.toLowerCase()
	);
	return match ? `var(--wp--preset--color--${ match.slug })` : value;
}

/**
 * Turns a saved preset variable back into a colour the picker can show.
 *
 * @param {string} value   Saved value.
 * @param {Array}  palette Palette entries.
 * @return {string|undefined} Colour for the picker.
 */
function toPickerColor( value, palette ) {
	const match = /^var\(--wp--preset--color--(.+)\)$/.exec( value || '' );
	if ( ! match ) {
		return value;
	}
	const entry = palette.find( ( item ) => item.slug === match[ 1 ] );
	return entry ? entry.color : value;
}

/**
 * The edit function describes the structure of your block in the
 * context of the editor. This represents what the editor will
 * render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props               - The block props.
 * @param {Object} props.attributes    - The block attributes.
 * @param {Object} props.setAttributes - The function to set the block attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		direction,
		speed,
		pauseOnHover,
		showPauseButton,
		pauseButtonBackground,
		pauseButtonColor,
		pausedOpacity,
		gap,
		fadeEdges,
		verticalAlignment,
		hasMaxHeight,
		maxHeight,
	} = attributes;
	const [ isPreviewingAnimation, setIsPreviewingAnimation ] =
		useState( false );
	const [ duration, setDuration ] = useState( 12 );
	const [ themePalette ] = useSettings( 'color.palette' );
	const palette = flattenPalette( themePalette );
	const buttonBackground = toPickerColor( pauseButtonBackground, palette );
	const buttonColor = toPickerColor( pauseButtonColor, palette );
	const blockRef = useRef();

	// Speed is pixels per second, the same definition the view script uses.
	// The preview keyframe (editor.scss) moves the row by half of its own
	// width, so the duration is that distance divided by the speed. The row's
	// width can change after mount (sidebar, zoom, resize), so keep measuring
	// while the preview runs.
	useEffect( () => {
		const itemsContainer =
			blockRef.current?.querySelector( '.marquee-items' );
		if ( ! itemsContainer || ! isPreviewingAnimation || ! ( speed > 0 ) ) {
			return;
		}

		const measure = () => {
			const width = itemsContainer.offsetWidth;
			if ( width > 0 ) {
				setDuration( ( width * 0.5 ) / speed );
			}
		};
		measure();

		const view = itemsContainer.ownerDocument.defaultView;
		if ( ! view || ! view.ResizeObserver ) {
			return;
		}
		const observer = new view.ResizeObserver( measure );
		observer.observe( itemsContainer );
		return () => observer.disconnect();
	}, [ speed, isPreviewingAnimation ] );

	const blockProps = useBlockProps( {
		ref: blockRef,
		className: `wp-block-a8csp-marquee direction-${ direction }${
			isPreviewingAnimation ? ' is-previewing' : ''
		}${ verticalAlignment ? ` align-${ verticalAlignment }` : '' }${
			hasMaxHeight ? ' has-max-height' : ''
		}${ showPauseButton ? ' has-pause-button' : '' }`,
		style: {
			'--marquee-gap': `${ gap }px`,
			'--marquee-speed': speed,
			'--duration': `${ duration }s`,
			...( hasMaxHeight && {
				'--marquee-max-height': `${ maxHeight }px`,
			} ),
			// Same values save.js writes, so the preview matches the front end.
			...( pauseButtonBackground && {
				'--marquee-toggle-background': pauseButtonBackground,
			} ),
			...( pauseButtonColor && {
				'--marquee-toggle-color': pauseButtonColor,
			} ),
			...( Number.isFinite( pausedOpacity ) && {
				'--marquee-stopped-opacity': pausedOpacity / 100,
			} ),
			// Always show the preview button, even where a theme reveals it on hover.
			...( showPauseButton && {
				'--marquee-toggle-opacity': 1,
			} ),
		},
	} );

	return (
		<>
			{ /* Same control as the Row block's toolbar; the sidebar copy below writes the same attribute. */ }
			<BlockControls group="block">
				<BlockVerticalAlignmentControl
					value={ verticalAlignment }
					onChange={ ( value ) =>
						setAttributes( {
							verticalAlignment: value || undefined,
						} )
					}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Marquee Settings', 'marquee' ) }>
					<div style={ { marginBottom: '16px' } }>
						<Button
							variant={
								isPreviewingAnimation ? 'primary' : 'secondary'
							}
							onClick={ () =>
								setIsPreviewingAnimation(
									! isPreviewingAnimation
								)
							}
							style={ { width: '100%' } }
						>
							{ isPreviewingAnimation
								? __( 'Stop Preview', 'marquee' )
								: __( 'Preview Animation', 'marquee' ) }
						</Button>
					</div>
					<SelectControl
						label={ __( 'Scroll Direction', 'marquee' ) }
						value={ direction }
						options={ [
							{ label: __( 'Left', 'marquee' ), value: 'left' },
							{ label: __( 'Right', 'marquee' ), value: 'right' },
						] }
						onChange={ ( value ) =>
							setAttributes( { direction: value } )
						}
					/>
					<RangeControl
						label={ __( 'Speed', 'marquee' ) }
						value={ speed }
						onChange={ ( value ) =>
							setAttributes( { speed: value } )
						}
						min={ 10 }
						max={ 200 }
					/>
					<RangeControl
						label={ __( 'Gap between items', 'marquee' ) }
						value={ gap }
						onChange={ ( value ) =>
							setAttributes( { gap: value } )
						}
						min={ 0 }
						max={ 200 }
						allowReset={ true }
						resetFallbackValue={ 20 }
					/>
					<ToggleControl
						label={ __( 'Pause on Hover', 'marquee' ) }
						checked={ pauseOnHover }
						onChange={ ( value ) =>
							setAttributes( { pauseOnHover: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show pause button', 'marquee' ) }
						help={ __(
							'Adds a visible button that lets visitors pause and resume the animation. Turn this on when the marquee moves for more than five seconds (WCAG 2.2.2).',
							'marquee'
						) }
						checked={ showPauseButton }
						onChange={ ( value ) =>
							setAttributes( { showPauseButton: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Fade Edges', 'marquee' ) }
						help={ __(
							'Add fade effect to left and right edges',
							'marquee'
						) }
						checked={ fadeEdges }
						onChange={ ( value ) =>
							setAttributes( { fadeEdges: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Limit Height', 'marquee' ) }
						help={ __(
							'Cap the height of the marquee so items of different sizes fit inside a consistent band.',
							'marquee'
						) }
						checked={ hasMaxHeight }
						onChange={ ( value ) =>
							setAttributes( { hasMaxHeight: value } )
						}
					/>
					{ hasMaxHeight && (
						<RangeControl
							label={ __( 'Max Height (px)', 'marquee' ) }
							value={ maxHeight }
							onChange={ ( value ) =>
								setAttributes( {
									maxHeight: value ?? 200,
								} )
							}
							min={ 40 }
							max={ 800 }
							step={ 5 }
							allowReset={ true }
							resetFallbackValue={ 200 }
						/>
					) }
					<BaseControl __nextHasNoMarginBottom>
						<BaseControl.VisualLabel>
							{ __( 'Vertical Alignment', 'marquee' ) }
						</BaseControl.VisualLabel>
						<BlockVerticalAlignmentControl
							value={ verticalAlignment }
							onChange={ ( value ) =>
								setAttributes( {
									verticalAlignment: value || undefined,
								} )
							}
						/>
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			{ showPauseButton && (
				<InspectorControls group="styles">
					<PanelBody title={ __( 'Pause button', 'marquee' ) }>
						<BaseControl
							__nextHasNoMarginBottom
							id="a8csp-marquee-pause-button-background"
							label={ __( 'Pause button background', 'marquee' ) }
							help={ __(
								'The ring around the icon and the cut-out bars. Leave empty to use the default.',
								'marquee'
							) }
						>
							<ColorPalette
								colors={ palette }
								value={ buttonBackground }
								onChange={ ( value ) =>
									setAttributes( {
										pauseButtonBackground: toStoredColor(
											value,
											palette
										),
									} )
								}
							/>
						</BaseControl>
						<BaseControl
							__nextHasNoMarginBottom
							id="a8csp-marquee-pause-button-icon"
							label={ __( 'Pause button icon', 'marquee' ) }
							help={ __(
								'The filled circle of the icon. Leave empty to use the default.',
								'marquee'
							) }
						>
							<ColorPalette
								colors={ palette }
								value={ buttonColor }
								onChange={ ( value ) =>
									setAttributes( {
										pauseButtonColor: toStoredColor(
											value,
											palette
										),
									} )
								}
							/>
						</BaseControl>
						{ buttonBackground && buttonColor && (
							<ContrastChecker
								backgroundColor={ buttonBackground }
								textColor={ buttonColor }
								isLargeText={ false }
							/>
						) }
						<RangeControl
							__nextHasNoMarginBottom
							label={ __( 'Opacity when paused (%)', 'marquee' ) }
							help={ __(
								'Dims the scrolling content while it is paused (button, keyboard focus or Pause on Hover), and on hover so the button is easier to see. 100 means no dimming.',
								'marquee'
							) }
							value={ pausedOpacity }
							onChange={ ( value ) =>
								setAttributes( { pausedOpacity: value } )
							}
							min={ 10 }
							max={ 100 }
							step={ 5 }
							allowReset={ true }
							resetFallbackValue={ undefined }
						/>
					</PanelBody>
				</InspectorControls>
			) }
			<div { ...blockProps }>
				{ showPauseButton && (
					// Preview only: the front-end button is added by view.js.
					// Hovering it shows the dimmed state.
					<span
						className="marquee-toggle is-preview"
						aria-hidden="true"
					>
						<svg
							className="marquee-toggle__icon marquee-toggle__icon--pause"
							viewBox="0 0 24 24"
							focusable="false"
						>
							<path
								fill="currentColor"
								fillRule="evenodd"
								d={ PAUSE_ICON_PATH }
							/>
						</svg>
					</span>
				) }
				<div className="marquee-content">
					<div className="marquee-items">
						<InnerBlocks />
					</div>
				</div>
			</div>
		</>
	);
}
