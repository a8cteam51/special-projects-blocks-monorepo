/* global ResizeObserver, a8cspDynamicShapeBlocks */

// External dependencies.
import clsx from 'clsx';

// WordPress dependencies.
import { InspectorControls, useSettings } from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel, // eslint-disable-line
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
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
import { axisConfig, useSpacingPresets } from './imports/editor-utils';
import {
	encodeSvgForDataUri,
	getComputedPixelValue,
	getPaddingVar,
	getPixelValue,
	hasShapeValues,
	isPresetValue,
	presetToCssVar,
	resolveColor,
} from './imports/utils';

const IMAGE_BLOCKS = [ 'core/image', 'core/post-featured-image' ];
const VERTICAL_KEYS = [ 'vtl', 'vtr', 'vbl', 'vbr' ];
const HORIZONTAL_KEYS = [ 'htl', 'htr', 'hbl', 'hbr' ];

/**
 * Whether a block type supports dynamic shapes.
 *
 * @param {string} name Block name.
 *
 * @return {boolean} True if supported.
 */
const isSupportedBlock = ( name ) => a8cspDynamicShapeBlocks.includes( name );

/**
 * Finds a block's wrapper element in the editor canvas.
 *
 * The canvas lives in an iframe in the post and site editors, and in the top
 * document on the widgets screen and in the Customizer, so check both.
 *
 * @param {string} clientId Block client ID.
 *
 * @return {Element|null} The block wrapper element, or null if not rendered yet.
 */
const findBlockElement = ( clientId ) => {
	const id = `block-${ clientId }`;
	const inTopDocument = document.getElementById( id );

	if ( inTopDocument ) {
		return inTopDocument;
	}

	for ( const iframe of document.querySelectorAll( 'iframe' ) ) {
		try {
			const found = iframe.contentDocument?.getElementById( id );
			if ( found ) {
				return found;
			}
		} catch ( error ) {
			// Cross-origin iframe; not an editor canvas.
		}
	}

	return null;
};

/**
 * Adds dynamic shape attributes to supported blocks.
 *
 * @param {Object} settings Original block settings
 *
 * @return {Object} Filtered block settings
 */
function addAttributes( settings ) {
	if (
		isSupportedBlock( settings.name ) &&
		! settings.attributes.dynamicShape
	) {
		settings.attributes.dynamicShape = {
			type: 'object',
		};
	}

	return settings;
}

/**
 * Inspector controls for the dynamic shape attribute.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @param {string}   props.name          Block name.
 *
 * @return {Element} Inspector controls.
 */
function DynamicShapeControls( { attributes, setAttributes, name } ) {
	const { dynamicShape } = attributes;
	const isImage = IMAGE_BLOCKS.includes( name );
	const presets = useSpacingPresets();

	const resetAxis = ( keys ) => {
		const updated = { ...dynamicShape };
		keys.forEach( ( key ) => delete updated[ key ] );
		setAttributes( {
			dynamicShape: Object.keys( updated ).length ? updated : undefined,
		} );
	};

	const resetDynamicShape = () => {
		setAttributes( { dynamicShape: undefined } );
	};

	return (
		<InspectorControls group="styles">
			<ToolsPanel
				label={ __( 'Dynamic Shape', 'a8csp-dynamic-shapes' ) }
				resetAll={ () => resetDynamicShape() }
			>
				<AxisControls
					corners={ axisConfig( VERTICAL_KEYS ) }
					hasValue={ () => hasShapeValues( dynamicShape ) }
					label={
						isImage
							? __( 'Vertical insets', 'a8csp-dynamic-shapes' )
							: __( 'Vertical offsets', 'a8csp-dynamic-shapes' )
					}
					onChange={ ( newValues ) =>
						setAttributes( {
							dynamicShape: newValues,
						} )
					}
					onDeselect={ () => resetAxis( VERTICAL_KEYS ) }
					presetKey="spacing"
					presets={ presets }
					values={ dynamicShape }
				/>
				<AxisControls
					corners={ axisConfig( HORIZONTAL_KEYS ) }
					hasValue={ () => hasShapeValues( dynamicShape ) }
					label={ __( 'Horizontal insets', 'a8csp-dynamic-shapes' ) }
					onChange={ ( newValues ) =>
						setAttributes( {
							dynamicShape: newValues,
						} )
					}
					onDeselect={ () => resetAxis( HORIZONTAL_KEYS ) }
					presetKey="spacing"
					presets={ presets }
					values={ dynamicShape }
				/>
			</ToolsPanel>
		</InspectorControls>
	);
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
		if ( ! isSupportedBlock( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<DynamicShapeControls
					attributes={ props.attributes }
					setAttributes={ props.setAttributes }
					name={ props.name }
				/>
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'addControls' );

/**
 * Computes the class names and custom properties that render the dynamic
 * shape preview on a supported block's own wrapper element.
 *
 * The preview used to be rendered by wrapping `BlockEdit` in an extra div.
 * That div sat between the block and its layout container, so alignwide and
 * alignfull previews collapsed to the content width, and because the div was
 * only rendered once a shape was set, the block remounted (and lost focus)
 * the first time a value was entered. Applying the same props through
 * `editor.BlockListBlock`'s `wrapperProps` keeps the block where it is.
 *
 * @param {Object} props            Block list block props.
 * @param {string} props.clientId   Block client ID.
 * @param {string} props.name       Block name.
 * @param {Object} props.attributes Block attributes.
 *
 * @return {Object|null} `{ className, style }` to merge into the wrapper props, or null if the block has no shape.
 */
function useDynamicShapeWrapperProps( { clientId, name, attributes } ) {
	const { dynamicShape, style } = attributes;
	const isImage = IMAGE_BLOCKS.includes( name );
	// Saved content may still carry zero-only shapes from before unset
	// corners were dropped on input; those render as plain blocks.
	const hasShape = hasShapeValues( dynamicShape );

	// The block's wrapper element in the editor canvas, looked up once the
	// block has rendered. Plays the role the wrapper div's ref used to.
	const elementRef = useRef( null );

	// Read the palette from the block editor settings rather than the
	// `core/editor` store: that store is not registered on the block
	// widgets screen or in the Customizer, so selecting from it there
	// throws and takes every supported block down with it. Merging the
	// origins also lets default-palette slugs resolve on themes that
	// define their own palette.
	const [ customColors, themeColors, defaultColors ] = useSettings(
		'color.palette.custom',
		'color.palette.theme',
		'color.palette.default'
	);
	const colorPalette = useMemo(
		() => [
			...( customColors ?? [] ),
			...( themeColors ?? [] ),
			...( defaultColors ?? [] ),
		],
		[ customColors, themeColors, defaultColors ]
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
							elementRef.current
						);
					}
					// Handle regular pixel values. Use parseFloat, not
					// parseInt, to keep fractional widths (e.g. 12.5px):
					// get-path.js parses the clip path the same way, so the
					// preview padding stays aligned with the clipped shape.
					return parseFloat( value ) || 0;
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
		if ( ! hasShape ) {
			return;
		}

		const element = findBlockElement( clientId );
		elementRef.current = element;

		if ( ! element ) {
			return;
		}

		const img = isImage ? element.querySelector( 'img' ) : null;

		const updateDimensions = () => {
			const target = img || element;
			const { width, height } = target.getBoundingClientRect();
			const newWidth = Math.round( width );
			const newHeight = Math.round( height );

			setDimensions( ( prev ) => {
				if ( prev.width === newWidth && prev.height === newHeight ) {
					return prev;
				}
				return {
					width: newWidth,
					height: newHeight,
				};
			} );
		};

		updateDimensions();

		// Height typically resolves to 0 on initial load,
		// so fire again when the element is resized.
		const resizeObserver = new ResizeObserver( updateDimensions );
		resizeObserver.observe( element );

		// For cached images that are already loaded, ensure dimensions are captured.
		if ( img?.complete ) {
			updateDimensions();
		}
		img?.addEventListener( 'load', updateDimensions );

		return () => {
			resizeObserver.disconnect();
			img?.removeEventListener( 'load', updateDimensions );
		};
	}, [ hasShape, clientId, dynamicShape, style, isImage ] );

	// Update the path string when dimensions, dynamic shape, or border radius change.
	useEffect( () => {
		if ( ! hasShape ) {
			setPath( '' );
			return;
		}

		if ( ! dimensions.width || ! dimensions.height ) {
			return;
		}

		setPath(
			getPath(
				dimensions,
				dynamicShape,
				style?.border?.radius,
				elementRef.current,
				isImage
			)
		);
	}, [ hasShape, dimensions, dynamicShape, style?.border?.radius, isImage ] );

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
			// Double the border width for the SVG only: the stroke is
			// centered on the path, so the clip-path trims its outer half,
			// leaving the authored width visible. The `--stroke-width`
			// custom property below must stay the single, visible width —
			// it feeds the padding calc, matching the front end where PHP
			// sets it to the raw border width.
			const strokeWidth =
				getPixelValue( style.border.width, elementRef.current ) * 2;

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

			const svg = `<svg width="${ dimensions.width }" height="${ dimensions.height }" viewBox="0 0 ${ dimensions.width } ${ dimensions.height }" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="${ path }" stroke="${ borderColor }" stroke-width="${ strokeWidth }"/></svg>`;

			newStyles[
				'--border-svg'
			] = `url("data:image/svg+xml,${ encodeSvgForDataUri( svg ) }")`;
			newStyles[ '--stroke-width' ] = style.border.width;
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

	// Shadows only follow the shape on image blocks (the picture is clipped,
	// the figure carries the filter), matching the front end.
	useEffect( () => {
		const shadow =
			isImage && style?.shadow ? presetToCssVar( style.shadow ) : '';

		setShadowProps( {
			'--filter': shadow ? `drop-shadow(${ shadow })` : '',
		} );
	}, [ isImage, style?.shadow ] );

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

	if ( ! hasShape ) {
		return null;
	}

	return {
		className: clsx(
			'dynamic-shape-container',
			isImage && 'is-image',
			style?.border?.width && 'dynamic-shape-has-border'
		),
		style: styles,
	};
}

/**
 * Renders a supported block with the dynamic shape wrapper props merged in.
 *
 * Split out from the higher-order component so hooks run unconditionally.
 *
 * @param {Object}   props                Block list block props.
 * @param {Function} props.BlockListBlock The original block list block.
 *
 * @return {Element} The block list block.
 */
function DynamicShapeBlockListBlock( { BlockListBlock, ...props } ) {
	const shapeProps = useDynamicShapeWrapperProps( props );

	if ( ! shapeProps ) {
		return <BlockListBlock { ...props } />;
	}

	const wrapperProps = {
		...props.wrapperProps,
		className: clsx( props.wrapperProps?.className, shapeProps.className ),
		style: { ...props.wrapperProps?.style, ...shapeProps.style },
	};

	return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
}

/**
 * Applies the dynamic shape preview to supported blocks' wrapper elements.
 *
 * @param {Function} BlockListBlock The block list block element.
 *
 * @return {Function} Modified block list block element.
 */
const addWrapperProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( ! isSupportedBlock( props.name ) ) {
			return <BlockListBlock { ...props } />;
		}

		return (
			<DynamicShapeBlockListBlock
				BlockListBlock={ BlockListBlock }
				{ ...props }
			/>
		);
	};
}, 'addWrapperProps' );

addFilter( 'blocks.registerBlockType', 'a8csp-dynamic-shapes', addAttributes );
addFilter( 'editor.BlockEdit', 'a8csp-dynamic-shapes', addControls );
addFilter( 'editor.BlockListBlock', 'a8csp-dynamic-shapes', addWrapperProps );
