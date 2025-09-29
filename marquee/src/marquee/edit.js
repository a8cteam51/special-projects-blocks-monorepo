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
	BlockVerticalAlignmentControl,
} from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Button,
} from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';

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
	const { direction, speed, pauseOnHover, gap, fadeEdges, verticalAlignment } = attributes;
	const [ isPreviewingAnimation, setIsPreviewingAnimation ] =
		useState( false );
	const [ duration, setDuration ] = useState( 12 );
	const blockRef = useRef();

	// Calculate duration for preview
	//const itemsContainer = document.querySelector('.wp-block-a8csp-marquee .marquee-items');
	//const duration = itemsContainer ? (itemsContainer.scrollWidth / speed) * 0.5 : 12;
	useEffect( () => {
		if ( blockRef.current ) {
			const itemsContainer =
				blockRef.current.querySelector( '.marquee-items' );
			if ( itemsContainer && itemsContainer.scrollWidth > 0 ) {
				setDuration( ( itemsContainer.scrollWidth / speed ) * 0.5 );
			}
		}
	}, [ speed, isPreviewingAnimation ] );

	const blockProps = useBlockProps( {
		ref: blockRef,
		className: `wp-block-a8csp-marquee direction-${ direction }${
			isPreviewingAnimation ? ' is-previewing' : ''
		}${
			verticalAlignment ? ` align-${ verticalAlignment }` : ''
		}`,
		style: {
			'--marquee-gap': `${ gap }px`,
			'--marquee-speed': speed,
			'--duration': `${ duration }s`,
		},
	} );

	return (
		<>
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
						max={ 100 }
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
					<div style={ { marginTop: '16px' } }>
						<label style={ { display: 'block', marginBottom: '8px' } }>
							{ __( 'Vertical Alignment', 'marquee' ) }
						</label>
						<BlockVerticalAlignmentControl
							value={ verticalAlignment }
							onChange={ ( value ) =>
								setAttributes( { verticalAlignment: value || undefined } )
							}
						/>
					</div>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="marquee-content">
					<div className="marquee-items">
						<InnerBlocks />
					</div>
				</div>
			</div>
		</>
	);
}
