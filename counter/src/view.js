import domReady from '@wordpress/dom-ready';

/* global IntersectionObserver */
/* global requestAnimationFrame */

/**
 * Observer to monitor intersection of counters and trigger animation.
 */
const counterObserver = new IntersectionObserver(
	( counters ) => {
		counters.forEach( ( entry ) => {
			if ( entry.isIntersecting ) {
				// If the entry is visible and doesn't have the 'triggered' class, add it and call the triggerCounter function
				if ( ! entry.target.classList.contains( 'triggered' ) ) {
					entry.target.classList.add( 'triggered' );
					triggerCounter( entry.target );
				}
			}
		} );
	},
	{
		root: null,
		rootMargin: '0px',
		threshold: 0,
	}
);

/**
 * Counts the decimal places in a number as written, e.g. 2 for "99.95".
 *
 * @param {string} value The number as a string.
 * @return {number} The number of decimal places.
 */
const getDecimalPlaces = ( value ) => {
	const [ , fraction = '' ] = String( value ).split( '.' );

	return fraction.length;
};

/**
 * Triggers the counter animation.
 *
 * @param {HTMLElement} element The element to trigger the counter animation on.
 * @return {void}
 */
const triggerCounter = ( element ) => {
	// Get the counter value to update.
	const counterElement = element.querySelector( '.counter__number' );

	// Bail if the counter element is not found.
	if ( ! counterElement ) {
		return;
	}

	// Get the start, end, and duration values from the data attributes.
	const start = parseFloat( counterElement.dataset.start );
	const end = parseFloat( counterElement.dataset.end );
	const duration = parseFloat( counterElement.dataset.duration );

	// Bail if the data attributes are invalid.
	if ( isNaN( start ) || isNaN( end ) || isNaN( duration ) ) {
		return;
	}

	// Convert the duration from seconds to milliseconds.
	const durationMs = Math.floor( duration * 1000 );

	// Animate at the precision of the start or end value, whichever has more decimals.
	const decimals = Math.max(
		getDecimalPlaces( counterElement.dataset.start ),
		getDecimalPlaces( counterElement.dataset.end )
	);
	const factor = 10 ** decimals;

	let startTime = null;
	const direction = start > end ? -1 : 1; // Determines if counting up or down

	/**
	 * Updates the counter value on each animation frame.
	 *
	 * @param {number} timestamp The current timestamp.
	 */
	const step = ( timestamp ) => {
		if ( ! startTime ) {
			startTime = timestamp;
		}
		const elapsed = timestamp - startTime;
		const progress = Math.min( elapsed / durationMs, 1 ); // Ensure it doesn't exceed 1
		const currentValue =
			start + direction * progress * Math.abs( end - start );

		// Update the counter display. Adding 0 turns -0 into 0.
		counterElement.textContent = (
			Math.round( currentValue * factor ) / factor +
			0
		).toFixed( decimals );

		if ( progress < 1 ) {
			requestAnimationFrame( step );
		} else {
			counterElement.textContent = end; // Ensure the final value is correct
		}
	};

	requestAnimationFrame( step );
};

/**
 * Initializes observers for counters.
 */
const initObservers = () => {
	// Select all elements you want to monitor.
	const counters = document.querySelectorAll( '.wp-block-wpcomsp-counter' );

	// Observe each element.
	counters.forEach( ( counter ) => {
		counterObserver.observe( counter );
	} );
};

// Initialize observers when the DOM is ready.
domReady( initObservers );
