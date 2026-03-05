/* global ResizeObserver, wpcomspDynamicShapeBlocks */

// External dependencies.
import clsx from 'clsx';

// WordPress dependencies.
import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel, // eslint-disable-line
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import { getPath } from './imports/get-path';
import { AxisControls } from './imports/axis-controls';
import {
	axisConfig,
	getComputedPixelValue,
	getPaddingVar,
	getPixelValue,
	isPresetValue,
	presetToCssVar,
	resolveColor,
	useSpacingPresets,
} from './imports/utils';

/**
 * Adds dynamic shape attributes to supported blocks.
 *
 * @param {Object} settings Original block settings
 *
 * @return {Object} Filtered block settings
 */
function addAttributes( settings ) {
	if (
		wpcomspDynamicShapeBlocks.includes( settings.name ) &&
		! settings.attributes.dynamicShape
	) {
		settings.attributes.dynamicShape = {
			type: 'object',
		};
	}

	return settings;
}

/**
 * Adds dynamic shape controls to supported blocks.
 *
 * @param {Function} BlockEdit The block edit element.
 *
 * @return {Function} Modified block edit element.
 */
const addControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! wpcomspDynamicShapeBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, name } = props;
		const { dynamicShape, style } = attributes;

		const isImage = [ 'core/image', 'core/post-featured-image' ].includes(
			name
		);

		const wrapperRef = useRef( null );

		const colorPalette = useSelect(
			( select ) => select( 'core/editor' ).getEditorSettings()?.colors,
			[]
		);

		const [ path, setPath ] = useState( '' );
		const [ paddingProps, setPaddingProps ] = useState( {} );
		const [ bgAndBorderProps, setBgAndBorderProps ] = useState( {} );
		const [ shadowProps, setShadowProps ] = useState( {} );
		const [ dimensions, setDimensions ] = useState( {
			width: 0,
			height: 0,
		} );

		// Memoize getMaxOffset to avoid recreating on every render.
		const getMaxOffset = useCallback(
			( positions ) => {
				const values = positions
					.map( ( pos ) => dynamicShape?.[ pos ] )
					.filter( ( value ) => value && value !== '' )
					.map( ( value ) => {
						// Handle preset values by computing their pixel values.
						if ( isPresetValue( value ) ) {
							return getComputedPixelValue(
								value,
								wrapperRef.current
							);
						}
						// Handle regular pixel values.
						return parseInt( value ) || 0;
					} );

				if ( values.length === 0 ) {
					return '0px';
				}

				return Math.max( ...values ) + 'px';
			},
			[ dynamicShape ]
		);

		// Update the dimensions of the block when it is resized.
		useEffect( () => {
			const img = isImage
				? wrapperRef?.current?.querySelector( 'img' )
				: null;

			const updateDimensions = () => {
				const element = img || wrapperRef.current;
				if ( element ) {
					const { width, height } = element.getBoundingClientRect();

					setDimensions( {
						width: Math.round( width ),
						height: Math.round( height ),
					} );
				}
			};

			updateDimensions();

			// Height typically resolves to 0 on initial load,
			// so fire again when the element is resized.
			const resizeObserver = new ResizeObserver( updateDimensions );

			if ( wrapperRef.current ) {
				resizeObserver.observe( wrapperRef.current );
			}

			// For cached images that are already loaded, ensure dimensions are captured.
			if ( img?.complete ) {
				updateDimensions();
			}
			img?.addEventListener( 'load', updateDimensions );

			return () => {
				resizeObserver.disconnect();
				img?.removeEventListener( 'load', updateDimensions );
			};
		}, [ dynamicShape, style, isImage ] );

		// Update the path string when dimensions, dynamic shape, or border radius change.
		useEffect( () => {
			if ( ! dimensions.width || ! dimensions.height ) {
				return;
			}

			setPath(
				getPath(
					dimensions,
					dynamicShape,
					style?.border?.radius,
					wrapperRef.current,
					isImage
				)
			);
		}, [ dimensions, dynamicShape, style?.border?.radius, isImage ] );

		// Update the padding variables when the padding style changes.
		useEffect( () => {
			const { top, right, bottom, left } = style?.spacing?.padding ?? {};

			setPaddingProps( {
				'--pad-t-o': getPaddingVar( top ),
				'--pad-r-o': getPaddingVar( right ),
				'--pad-b-o': getPaddingVar( bottom ),
				'--pad-l-o': getPaddingVar( left ),
				'--pad-t-a': getMaxOffset( [ 'vtl', 'vtr' ] ),
				'--pad-r-a': getMaxOffset( [ 'htr', 'hbr' ] ),
				'--pad-b-a': getMaxOffset( [ 'vbl', 'vbr' ] ),
				'--pad-l-a': getMaxOffset( [ 'htl', 'hbl' ] ),
			} );
		}, [ dynamicShape, style?.spacing?.padding, getMaxOffset ] );

		// Update background and border styles when relevant values change.
		useEffect( () => {
			const background = resolveColor( colorPalette, [
				{
					value: attributes?.backgroundColor,
					paletteKey: true,
				},
				{
					value: style?.color?.background,
				},
				{
					value: style?.color?.gradient,
				},
			] );

			const newStyles = {
				'--background': background,
			};

			if (
				style?.border?.width &&
				path &&
				dimensions.width &&
				dimensions.height
			) {
				// Double the border width to account for stroke being centered
				// on path. The clip-path trims it to the correct visual width.
				const borderWidth =
					getPixelValue( style.border.width, wrapperRef.current ) * 2;

				const borderColor = resolveColor(
					colorPalette,
					[
						{
							value: attributes?.borderColor,
							paletteKey: true,
						},
						{
							value: style.border?.color,
						},
					],
					'#000000'
				);

				const stroke = encodeURIComponent( borderColor );

				const svg = `<svg width="${ dimensions.width }" height="${ dimensions.height }" viewBox="0 0 ${ dimensions.width } ${ dimensions.height }" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="${ path }" stroke="${ stroke }" stroke-width="${ borderWidth }"/></svg>`;

				newStyles[ '--border-svg' ] =
					`url('data:image/svg+xml, ${ svg }')`;
				newStyles[ '--stroke-width' ] = `${ borderWidth }px`;
			}

			setBgAndBorderProps( newStyles );
		}, [
			colorPalette,
			dimensions,
			path,
			attributes?.backgroundColor,
			attributes?.borderColor,
			style?.color?.background,
			style?.color?.gradient,
			style?.border,
		] );

		useEffect( () => {
			const shadow = style?.shadow ? presetToCssVar( style.shadow ) : '';

			setShadowProps( {
				'--filter': shadow ? `drop-shadow(${ shadow })` : '',
			} );
		}, [ style?.shadow ] );

		const verticalKeys = [ 'vtl', 'vtr', 'vbl', 'vbr' ];
		const horizontalKeys = [ 'htl', 'htr', 'hbl', 'hbr' ];

		const resetAxis = ( keys ) => {
			const updated = { ...dynamicShape };
			keys.forEach( ( key ) => delete updated[ key ] );
			setAttributes( { dynamicShape: updated } );
		};

		const resetDynamicShape = () => {
			setAttributes( { dynamicShape: undefined } );
		};

		const presets = useSpacingPresets();

		const withControls = (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="styles">
					<ToolsPanel
						label={ __( 'Dynamic Shape' ) }
						resetAll={ () => resetDynamicShape() }
					>
						<AxisControls
							corners={ axisConfig( verticalKeys ) }
							hasValue={ () => !! dynamicShape }
							label={
								isImage
									? __( 'Vertical insets', 'dynamic-shapes' )
									: __( 'Vertical offsets', 'dynamic-shapes' )
							}
							onChange={ ( newValues ) =>
								setAttributes( {
									dynamicShape: newValues,
								} )
							}
							onDeselect={ () => resetAxis( verticalKeys ) }
							presetKey="spacing"
							presets={ presets }
							values={ dynamicShape }
						/>
						<AxisControls
							corners={ axisConfig( horizontalKeys ) }
							hasValue={ () => !! dynamicShape }
							label={ __(
								'Horizontal insets',
								'dynamic-shapes'
							) }
							onChange={ ( newValues ) =>
								setAttributes( {
									dynamicShape: newValues,
								} )
							}
							onDeselect={ () => resetAxis( horizontalKeys ) }
							presetKey="spacing"
							presets={ presets }
							values={ dynamicShape }
						/>
					</ToolsPanel>
				</InspectorControls>
			</>
		);

		const className = clsx(
			'dynamic-shape-container',
			isImage && 'is-image',
			style?.border?.width && 'dynamic-shape-has-border'
		);

		const styles = useMemo(
			() =>
				Object.fromEntries(
					Object.entries( {
						'--clip-path': path ? `path('${ path }')` : undefined,
						...paddingProps,
						...bgAndBorderProps,
						...shadowProps,
					} ).filter(
						( [ , value ] ) => value !== undefined && value !== ''
					)
				),
			[ path, paddingProps, bgAndBorderProps, shadowProps ]
		);

		return dynamicShape ? (
			<div className={ className } ref={ wrapperRef } style={ styles }>
				{ withControls }
			</div>
		) : (
			withControls
		);
	};
}, 'addControls' );

addFilter( 'blocks.registerBlockType', 'dynamic-shapes', addAttributes );
addFilter( 'editor.BlockEdit', 'dynamic-shapes', addControls );
