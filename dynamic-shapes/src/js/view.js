/* global getComputedStyle, MutationObserver, requestAnimationFrame, ResizeObserver */

// Internal dependencies.
import { getPath } from './imports/get-path';
import { getPixelValue } from './imports/utils';

{
	const DYNAMIC_SHAPE_SELECTOR = '[data-dynamic-shape]';
	const imageLoadListeners = new Map();
	const dynamicShapeBlocksData = new Map();

	let dynamicShapeBlocks = [];
	let resizeObserver = null;
	let mutationTimeout = null;

	/**
	 * Initialize and cache static data for a dynamic shape block.
	 *
	 * @param {Element} block The block to initialize.
	 *
	 * @return {Object|null} The cached data or null if initialization failed.
	 */
	function initializeDynamicShapeBlock( block ) {
		try {
			const isGroupBlock = block.classList.contains( 'wp-block-group' );
			const isImageBlock =
				block.classList.contains( 'wp-block-image' ) ||
				block.classList.contains( 'wp-block-post-featured-image' );

			// Get the appropriate style element.
			const styleElement = isGroupBlock
				? block
				: block.querySelector( 'img' );

			if ( ! styleElement ) {
				return null;
			}

			const dynamicShapeData = JSON.parse( block.dataset.dynamicShape );

			const style = getComputedStyle( styleElement );
			const background = style.background;

			const cachedData = {
				isGroupBlock,
				isImageBlock,
				dynamicShapeData,
				background,
				borderRadius: null, // Will be set by calculateBorderData
				borderData: null, // Will be set by calculateBorderData
				styleElement,
			};

			// Calculate border radius and border data using the helper
			calculateBorderData( block, cachedData );

			dynamicShapeBlocksData.set( block, cachedData );
			return cachedData;
		} catch ( error ) {
			return null;
		}
	}

	/**
	 * Calculates border and border radius data.
	 *
	 * @param {Element} block      The block element.
	 * @param {Object}  cachedData The cached data object to update.
	 */
	function calculateBorderData( block, cachedData ) {
		// Recalculate border radius with new computed values.
		const style = getComputedStyle( cachedData.styleElement );
		cachedData.borderRadius = getBorderRadius( style );

		// Recalculate border data if present.
		if ( block.dataset.borderWidth ) {
			cachedData.borderData = {
				width: getPixelValue( block.dataset.borderWidth, block ) * 2,
				color: block.dataset.borderColor,
			};
		}
	}

	/**
	 * Get the border radii for a dynamic shape block.
	 *
	 * @param {CSSStyleDeclaration} style The style declaration.
	 *
	 * @return {Object} The border radii.
	 */
	function getBorderRadius( style ) {
		const values = style.borderRadius.split( ' ' ).map( ( v ) => v.trim() );
		const corners = [ 'topLeft', 'topRight', 'bottomRight', 'bottomLeft' ];
		const borderRadiusObj = {};

		corners.forEach( ( corner, index ) => {
			let value;
			if ( values.length === 1 ) {
				value = values[ 0 ];
			} else if ( values.length === 2 ) {
				value = values[ index % 2 ];
			} else if ( values.length === 3 ) {
				value =
					index === 1 || index === 3
						? values[ 1 ]
						: values[ index === 0 ? 0 : 2 ];
			} else {
				value = values[ index ];
			}
			borderRadiusObj[ corner ] = value;
		} );

		return borderRadiusObj;
	}

	/**
	 * Update the clip path for a dynamic shape style block.
	 *
	 * @param {Element} block       The block for which to update the clip path.
	 * @param {number}  retryCount  The number of retry attempts made so far.
	 * @param {boolean} forceUpdate Whether to force update even if clip path exists.
	 */
	function updateClipPath( block, retryCount = 0, forceUpdate = false ) {
		// Skip if block already has a clip path and the update is not forced.
		if ( ! forceUpdate && block.style.clipPath ) {
			return;
		}

		// Get cached data for this block.
		let cachedData = dynamicShapeBlocksData.get( block );
		if ( ! cachedData ) {
			// Initialize if not cached.
			cachedData = initializeDynamicShapeBlock( block );
			if ( ! cachedData ) {
				return;
			}
		}

		const el = cachedData.isGroupBlock
			? block
			: block.querySelector( 'img' );

		// Get dimensions first - if not available, retry (up to 5 times).
		const width = el.offsetWidth;
		const height = el.offsetHeight;

		if ( ! width || ! height ) {
			if ( retryCount < 5 ) {
				setTimeout( () => updateClipPath( block, retryCount + 1 ), 50 );
			}
			return;
		}

		const args = [
			{ width, height },
			cachedData.dynamicShapeData,
			cachedData.borderRadius,
			el,
		];

		// Apply clip path.
		const path = getPath( ...args, cachedData.isGroupBlock );
		if ( cachedData.isGroupBlock ) {
			block.style.clipPath = `path('${ path }')`;

			// Handle border if present.
			if ( cachedData.borderData ) {
				const { width: borderWidth, color: borderColor } =
					cachedData.borderData;
				const svg = `<svg width="${ width }" height="${ height }" viewBox="0 0 ${ width } ${ height }" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="${ path }" stroke="${ borderColor }" stroke-width="${ borderWidth }"/></svg>`;
				block.style.background = `url('data:image/svg+xml, ${ svg }')`;
				if ( cachedData.background ) {
					block.style.background += `, ${ cachedData.background }`;
				}
			}
		} else if ( cachedData.isImageBlock ) {
			el.style.clipPath = `path('${ path }')`;

			const overlay = block.querySelector(
				'.wp-block-post-featured-image__overlay'
			);
			if ( overlay ) {
				overlay.style.clipPath = `path('${ path }')`;
			}
		}
	}

	/**
	 * Set up ResizeObserver for handling resize events and inner content changes.
	 */
	function setupResizeObserver() {
		if ( ! ( 'ResizeObserver' in window ) ) {
			return;
		}

		resizeObserver = new ResizeObserver( ( entries ) => {
			entries.forEach( ( entry ) => {
				const block = entry.target;
				const cachedData = dynamicShapeBlocksData.get( block );
				if ( cachedData ) {
					calculateBorderData( block, cachedData );
				}
				updateClipPath( block, 0, true );
			} );
		} );

		dynamicShapeBlocks.forEach( ( block ) => {
			resizeObserver.observe( block );
		} );
	}

	/**
	 * Clean up existing image load listeners.
	 */
	function cleanupImageLoadListeners() {
		imageLoadListeners.forEach( ( listener, img ) => {
			img.removeEventListener( 'load', listener );
		} );
		imageLoadListeners.clear();
	}

	/**
	 * Set up image load listeners.
	 */
	function setupImageLoadListeners() {
		// Clean up existing listeners first.
		cleanupImageLoadListeners();

		dynamicShapeBlocks.forEach( ( block ) => {
			if (
				block.classList.contains( 'wp-block-image' ) ||
				block.classList.contains( 'wp-block-post-featured-image' )
			) {
				const img = block.querySelector( 'img' );
				if ( img ) {
					const listener = () => updateClipPath( block );
					img.addEventListener( 'load', listener );
					imageLoadListeners.set( img, listener );
				}
			}
		} );
	}

	/**
	 * Clean up all observers and listeners.
	 */
	function cleanup() {
		if ( resizeObserver ) {
			resizeObserver.disconnect();
			resizeObserver = null;
		}

		cleanupImageLoadListeners();

		dynamicShapeBlocksData.clear();

		clearTimeout( mutationTimeout );

		mutationTimeout = null;
	}

	/**
	 * Initialize dynamic shapes functionality.
	 */
	function initDynamicShapes() {
		cleanup();

		dynamicShapeBlocks = [
			...document.querySelectorAll( DYNAMIC_SHAPE_SELECTOR ),
		];

		if ( dynamicShapeBlocks.length === 0 ) {
			return;
		}

		dynamicShapeBlocks.forEach( ( block ) => {
			initializeDynamicShapeBlock( block );
		} );

		setupResizeObserver();
		setupImageLoadListeners();

		// Batch clip path updates using requestAnimationFrame to avoid layout thrashing.
		requestAnimationFrame( () => {
			dynamicShapeBlocks.forEach( updateClipPath );
		} );
	}

	// Initialize on DOM ready.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initDynamicShapes );
	} else {
		initDynamicShapes();
	}

	// Set up a mutation observer to handle asynchronously loaded dynamic shape blocks.
	const siteMain = document.querySelector( '.site-main' );
	if ( siteMain ) {
		new MutationObserver( () => {
			clearTimeout( mutationTimeout );
			mutationTimeout = setTimeout( initDynamicShapes, 100 );
		} ).observe( siteMain, {
			childList: true,
			subtree: true,
		} );
	}
}
