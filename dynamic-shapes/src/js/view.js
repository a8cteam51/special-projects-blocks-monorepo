/* global getComputedStyle, MutationObserver, requestAnimationFrame, ResizeObserver */

// Internal dependencies.
import { getPath } from './imports/get-path';
import { getPixelValue } from './imports/utils';

{
	// Selectors.
	const DYNAMIC_SHAPE_SELECTOR = '[data-dynamic-shape]';
	const SITE_BLOCKS_SELECTOR = '.wp-site-blocks';
	const IMG_OVERLAY_SELECTOR = '.wp-block-post-featured-image__overlay';
	const IMAGE_BLOCK_CLASSES = [
		'wp-block-image',
		'wp-block-post-featured-image',
	];

	// Timing constants.
	const MAX_RETRY_COUNT = 5;
	const RETRY_DELAY_MS = 50;
	const MUTATION_DEBOUNCE_MS = 100;

	// State.
	const imageLoadListeners = new Map();
	const dynamicShapeBlocksData = new Map();
	const updateQueue = new Set();

	let isInitializing = false;
	let updateScheduled = false;
	let dynamicShapeBlocks = [];
	let resizeObserver = null;
	let mutationObserver = null;
	let mutationTimeout = null;

	/**
	 * Encode an SVG string for use in a data URI.
	 * Escapes characters that would break the URI or cause parsing issues.
	 *
	 * @param {string} svg The SVG string to encode.
	 *
	 * @return {string} The encoded SVG string.
	 */
	function encodeSvgForDataUri( svg ) {
		return svg
			.replace( /%/g, '%25' )
			.replace( /"/g, "'" )
			.replace( /#/g, '%23' )
			.replace( /\{/g, '%7B' )
			.replace( /\}/g, '%7D' )
			.replace( /</g, '%3C' )
			.replace( />/g, '%3E' );
	}

	/**
	 * Validate that parsed shape data has the required structure.
	 *
	 * @param {*} data The parsed data to validate.
	 *
	 * @return {boolean} Whether the data is valid.
	 */
	function isValidShapeData( data ) {
		return data !== null && typeof data === 'object';
	}

	/**
	 * Log the given warning message.
	 *
	 * @param {string} message The warning message.
	 * @param {...*}   args    Additional arguments to log.
	 */
	function logWarning( message, ...args ) {
		// eslint-disable-next-line no-console
		console.warn( message, ...args );
	}

	/**
	 * Get the target element for clip-path operations.
	 * For image blocks, this is the img element; for others, it's the block itself.
	 *
	 * @param {Object}  cachedData The cached data for the block.
	 * @param {Element} block      The block element.
	 *
	 * @return {Element} The target element.
	 */
	function getTargetElement( cachedData, block ) {
		return cachedData.imgElement || block;
	}

	/**
	 * Schedule a block for clip-path update in the next animation frame.
	 * Multiple calls for the same block are deduplicated via Set.
	 *
	 * @param {Element} block The block to update.
	 */
	function scheduleUpdate( block ) {
		updateQueue.add( block );
		if ( ! updateScheduled ) {
			updateScheduled = true;
			requestAnimationFrame( processUpdateQueue );
		}
	}

	/**
	 * Process all queued clip-path updates in a single animation frame.
	 */
	function processUpdateQueue() {
		updateQueue.forEach( ( block ) => {
			const cachedData = dynamicShapeBlocksData.get( block );
			if ( cachedData ) {
				calculateBorderData( block, cachedData );
			}
			updateClipPath( block, 0, true );
		} );
		updateQueue.clear();
		updateScheduled = false;
	}

	/**
	 * Initialize and cache static data for a dynamic shape block.
	 *
	 * @param {Element} block The block to initialize.
	 *
	 * @return {Object|null} The cached data or null if initialization failed.
	 */
	function initializeDynamicShapeBlock( block ) {
		try {
			const isImage = IMAGE_BLOCK_CLASSES.some( ( cls ) =>
				block.classList.contains( cls )
			);

			// Cache the img element for image blocks to avoid repeated queries.
			const imgElement = isImage ? block.querySelector( 'img' ) : null;

			const dynamicShapeData = JSON.parse( block.dataset.dynamicShape );

			if ( ! isValidShapeData( dynamicShapeData ) ) {
				logWarning( 'Invalid dynamic shape data:', block );
				return null;
			}

			const style = getComputedStyle( imgElement || block );
			const background = style.background;

			const cachedData = {
				imgElement,
				dynamicShapeData,
				background,
				borderRadius: null, // Will be set by `calculateBorderData`.
				borderData: null, // Will be set by `calculateBorderData`.
			};

			calculateBorderData( block, cachedData );

			dynamicShapeBlocksData.set( block, cachedData );
			return cachedData;
		} catch ( error ) {
			logWarning(
				'Dynamic shape initialization failed:',
				error.message,
				block
			);
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
		const style = getComputedStyle( getTargetElement( cachedData, block ) );
		cachedData.borderRadius = getBorderRadius( style );

		// Recalculate border data if present.
		if ( block.dataset.borderWidth ) {
			cachedData.borderData = {
				// Border implemented by SVG stroke; centered on edge,
				// so we double as half of it will be clipped.
				width: getPixelValue( block.dataset.borderWidth, block ) * 2,
				// Decode the color since the data attribute is URL-encoded.
				// It will be re-encoded by encodeSvgForDataUri().
				color: decodeURIComponent( block.dataset.borderColor ),
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
		const [ v0, v1, v2, v3 ] = values;

		// CSS border-radius shorthand follows the pattern:
		// 1 value:  all corners
		// 2 values: top-left/bottom-right, top-right/bottom-left
		// 3 values: top-left, top-right/bottom-left, bottom-right
		// 4 values: top-left, top-right, bottom-right, bottom-left
		return {
			topLeft: v0,
			topRight: v1 ?? v0,
			bottomRight: v2 ?? v0,
			bottomLeft: v3 ?? v1 ?? v0,
		};
	}

	/**
	 * Update the clip path for the given block.
	 *
	 * @param {Element} block       Block for which to update the clip path.
	 * @param {number}  retryCount  Number of retry attempts made so far.
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

		const el = getTargetElement( cachedData, block );

		// Get dimensions first - if not available, retry up to MAX_RETRY_COUNT times.
		const width = el.offsetWidth;
		const height = el.offsetHeight;

		if ( ! width || ! height ) {
			if ( retryCount < MAX_RETRY_COUNT ) {
				setTimeout(
					() => updateClipPath( block, retryCount + 1 ),
					RETRY_DELAY_MS
				);
			}
			return;
		}

		const args = [
			{ width, height },
			cachedData.dynamicShapeData,
			cachedData.borderRadius,
			el,
		];

		let path;
		try {
			path = getPath( ...args, ! cachedData.imgElement );
		} catch ( error ) {
			logWarning( 'Failed to generate clip path:', error.message, block );
			return;
		}

		if ( cachedData.imgElement ) {
			applyImageClipPath( block, el, path );
		} else {
			applyBlockClipPath( block, path, width, height, cachedData );
		}
	}

	/**
	 * Apply clip path to an image block and its overlay.
	 *
	 * This allows us to support most shadow styling
	 * via `filter: drop-shadow` on the block wrapper.
	 *
	 * @param {Element} block The block element.
	 * @param {Element} el    The image element.
	 * @param {string}  path  The SVG path string.
	 */
	function applyImageClipPath( block, el, path ) {
		const clipPath = `path('${ path }')`;
		el.style.clipPath = clipPath;

		const overlay = block.querySelector( IMG_OVERLAY_SELECTOR );
		if ( overlay ) {
			overlay.style.clipPath = clipPath;
		}
	}

	/**
	 * Apply clip path and optional border SVG to a non-image block.
	 *
	 * @param {Element} block      The block element.
	 * @param {string}  path       The SVG path string.
	 * @param {number}  width      The block width.
	 * @param {number}  height     The block height.
	 * @param {Object}  cachedData The cached data for the block.
	 */
	function applyBlockClipPath( block, path, width, height, cachedData ) {
		block.style.clipPath = `path('${ path }')`;

		if ( ! cachedData.borderData ) {
			return;
		}

		const { width: borderWidth, color: borderColor } =
			cachedData.borderData;
		const svg = `<svg width="${ width }" height="${ height }" viewBox="0 0 ${ width } ${ height }" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="${ path }" stroke="${ borderColor }" stroke-width="${ borderWidth }"/></svg>`;

		// Set the SVG as a background image, preserving existing backgrounds.
		// Applied as the first image in a multi-background setup.
		block.style.background = `url("data:image/svg+xml,${ encodeSvgForDataUri(
			svg
		) }")`;

		if ( cachedData.background ) {
			block.style.background += `, ${ cachedData.background }`;
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
				scheduleUpdate( entry.target );
			} );
		} );

		dynamicShapeBlocks.forEach( ( block ) => {
			resizeObserver.observe( block );
		} );
	}

	/**
	 * Set up MutationObserver for handling asynchronously loaded blocks.
	 */
	function setupMutationObserver() {
		if ( mutationObserver ) {
			return;
		}

		const main =
			document.querySelector( SITE_BLOCKS_SELECTOR ) || document.body;
		if ( ! main ) {
			return;
		}

		mutationObserver = new MutationObserver( () => {
			clearTimeout( mutationTimeout );
			mutationTimeout = setTimeout(
				initDynamicShapes,
				MUTATION_DEBOUNCE_MS
			);
		} );
		mutationObserver.observe( main, {
			childList: true,
			subtree: true,
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
			const cachedData = dynamicShapeBlocksData.get( block );
			if ( cachedData?.imgElement ) {
				const img = cachedData.imgElement;
				const listener = () => {
					imageLoadListeners.delete( img );
					scheduleUpdate( block );
				};
				img.addEventListener( 'load', listener, { once: true } );
				imageLoadListeners.set( img, listener );
			}
		} );
	}

	/**
	 * Prune cache entries for blocks that are no longer in the DOM.
	 */
	function pruneStaleCache() {
		dynamicShapeBlocksData.forEach( ( _, block ) => {
			if ( ! document.body.contains( block ) ) {
				if ( resizeObserver ) {
					resizeObserver.unobserve( block );
				}
				dynamicShapeBlocksData.delete( block );
			}
		} );
	}

	/**
	 * Clean up observers and listeners.
	 */
	function cleanup() {
		if ( resizeObserver ) {
			resizeObserver.disconnect();
			resizeObserver = null;
		}

		cleanupImageLoadListeners();
		pruneStaleCache();

		clearTimeout( mutationTimeout );
		mutationTimeout = null;
	}

	/**
	 * Initialize dynamic shapes functionality.
	 */
	function initDynamicShapes() {
		// Prevent concurrent initializations from rapid mutation events.
		if ( isInitializing ) {
			return;
		}
		isInitializing = true;

		cleanup();

		dynamicShapeBlocks = [
			...document.querySelectorAll( DYNAMIC_SHAPE_SELECTOR ),
		];

		if ( dynamicShapeBlocks.length === 0 ) {
			isInitializing = false;
			return;
		}

		// Only initialize blocks that aren't already cached.
		dynamicShapeBlocks.forEach( ( block ) => {
			if ( ! dynamicShapeBlocksData.has( block ) ) {
				initializeDynamicShapeBlock( block );
			}
		} );

		setupResizeObserver();
		setupImageLoadListeners();

		// Batch clip path updates using requestAnimationFrame to avoid layout thrashing.
		requestAnimationFrame( () => {
			dynamicShapeBlocks.forEach( updateClipPath );
			isInitializing = false;
		} );
	}

	// Initialize on DOM ready.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', () => {
			initDynamicShapes();
			setupMutationObserver();
		} );
	} else {
		initDynamicShapes();
		setupMutationObserver();
	}
}
