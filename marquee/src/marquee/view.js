/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
// console.log( 'Hello World! (from create-block-marquee block)' );
/* eslint-enable no-console */

document.addEventListener( 'DOMContentLoaded', function () {
	const marquees = document.querySelectorAll( '.wp-block-a8csp-marquee' );
	// console.log('Found marquees:', marquees.length);

	marquees.forEach( ( marquee ) => {
		const itemsContainer = marquee.querySelector( '.marquee-items' );
		if ( ! itemsContainer ) {
			// eslint-disable-next-line no-console
			console.error( 'Could not find .marquee-items container' );
			return;
		}

		//speed will be set by a class like speed-50, means 50 is the value of the speed
		let speed = 50;
		const speedClass = Array.from( marquee.classList ).find( ( cls ) =>
			cls.startsWith( 'speed-' )
		);
		if ( speedClass ) {
			speed = parseInt( speedClass.replace( 'speed-', '' ), 10 ) || 50;
		}
		//check for class name pause-on-hover
		const pauseOnHover =
			marquee.classList.contains( 'has-pause-on-hover' ) ?? false;

		// Wait for all images to load before calculating widths
		const imageLoadPromises = Array.from(
			itemsContainer.querySelectorAll( 'img' )
		).map( ( img ) => {
			if ( img.complete ) {
				return Promise.resolve();
			}
			return new Promise( ( resolve ) => {
				const onLoad = () => {
					img.removeEventListener( 'load', onLoad );
					img.removeEventListener( 'error', onError );
					resolve();
				};
				const onError = () => {
					img.removeEventListener( 'load', onLoad );
					img.removeEventListener( 'error', onError );
					resolve(); // Resolve anyway to not block the animation
				};
				img.addEventListener( 'load', onLoad );
				img.addEventListener( 'error', onError );
			} );
		} );
		Promise.all( imageLoadPromises ).then( () => {
			// Get all items
			const items = Array.from( itemsContainer.children );

			// Get the gap value
			const computedGap =
				// eslint-disable-next-line no-undef
				getComputedStyle( itemsContainer ).getPropertyValue( 'gap' );
			const gap = parseFloat( computedGap ) || 0;

			// Sum widths of all items
			const itemsWidth = items.reduce(
				( sum, item ) => sum + item.offsetWidth,
				0
			);

			// Calculate total width including gaps
			const totalWidth = itemsWidth + gap * items.length;

			// Get container width
			const containerWidth = marquee.offsetWidth;

			// Calculate how many times to duplicate
			const minTotal = containerWidth * 2;
			const numDuplicates = Math.max(
				2,
				Math.ceil( minTotal / totalWidth )
			);

			// Duplicate content
			const originalContent = itemsContainer.innerHTML;
			let duplicatedContent = '';
			for ( let i = 0; i < numDuplicates; i++ ) {
				duplicatedContent += originalContent;
			}
			itemsContainer.innerHTML = duplicatedContent;

			// Set CSS variable for animation distance
			itemsContainer.style.setProperty(
				'--marquee-translate',
				`${ totalWidth }px`
			);

			// Calculate duration as before
			const duration = ( itemsContainer.scrollWidth / speed ) * 0.5;
			itemsContainer.style.setProperty( '--duration', `${ duration }s` );
		} );

		if ( pauseOnHover ) {
			marquee.addEventListener( 'mouseenter', () => {
				itemsContainer.style.setProperty( '--play-state', 'paused' );
			} );

			marquee.addEventListener( 'mouseleave', () => {
				itemsContainer.style.setProperty( '--play-state', 'running' );
			} );
		}

		// Cleanup on page leave
		window.addEventListener( 'beforeunload', () => {
			itemsContainer.style.setProperty( '--play-state', 'running' );
		} );
	} );
} );
