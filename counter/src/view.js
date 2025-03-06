import domReady from '@wordpress/dom-ready';

/**
 * Observer to monitor intersection of counters and trigger animation.
 */
const counterObserver = new IntersectionObserver((counters, observer) => {
	counters.forEach(entry => {
		if (entry.isIntersecting) {
			// If the entry is visible and doesn't have the 'triggered' class, add it and call the triggerCounter function
			if (!entry.target.classList.contains('triggered')) {
				entry.target.classList.add('triggered');
				triggerCounter(entry.target);
			}
		}
	});
}, {
	root: null,
	rootMargin: '0px',
	threshold: 0
});

/**
 * Triggers the counter animation.
 *
 * @param {HTMLElement} element The element to trigger the counter animation on.
 * @return {void}
 */
const triggerCounter = (element) => {
	// Get the counter value to update.
	const counterElement = element.querySelector('.counter__number');

	// Bail if the counter element is not found.
	if (!counterElement) {
		console.error("No element with class 'counter__number' found inside:", element);
		return;
	}

	// Get the start, end, and duration values from the data attributes.
	const start = parseFloat(counterElement.dataset.start);
	const end = parseFloat(counterElement.dataset.end);
	const duration = parseInt(counterElement.dataset.duration);

	// Bail if the data attributes are invalid.
	if (isNaN(start) || isNaN(end) || isNaN(duration)) {
		console.error("Invalid data attributes on element:", counterElement);
		return;
	}

	// Convert the duration from seconds to milliseconds.
	const durationMs = Math.floor(duration * 1000);

	let startTime = null;
	const direction = start > end ? -1 : 1; // Determines if counting up or down

	/**
	 * Updates the counter value on each animation frame.
	 *
	 * @param {number} timestamp The current timestamp.
	 */
	const step = (timestamp) => {
		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;
		let progress = Math.min(elapsed / durationMs, 1); // Ensure it doesn't exceed 1
		let currentValue = start + direction * progress * Math.abs(end - start);

		counterElement.textContent = Math.round(currentValue); // Update the counter display

		if (progress < 1) {
			requestAnimationFrame(step);
		} else {
			counterElement.textContent = end; // Ensure the final value is correct
		}
	};

	requestAnimationFrame(step);
};

/**
 * Initializes observers for counters.
 */
const initObservers = () => {
	// Select all elements you want to monitor.
	const counters = document.querySelectorAll('.wp-block-wpcomsp-counter');

	// Observe each element.
	counters.forEach(counter => {
		counterObserver.observe(counter);
	});
};

// Initialize observers when the DOM is ready.
domReady(initObservers);
