import { store, getElement } from "@wordpress/interactivity";

store("wpcomsp/marquee", {
	callbacks: {
		init: () => {
			const { ref } = getElement();

			// Get the Marquee content element.
			const inner = ref.querySelector(".wpcomsp-marquee-content");

			// Measure the width of the marquee element.
			const width = ref.getBoundingClientRect().width;

			let innerWidth = 0;

			// If the width of the inner is less than the width of the marquee
			// element, clone the inner to fill the marquee element.
			while (innerWidth <= width) {
				const clone = inner.cloneNode(true);
				ref.appendChild(clone);
				innerWidth += inner.getBoundingClientRect().width;

				// We have to add the animation in JS because the cloned elements are
				// not yet in the DOM when the CSS is parsed and we want to make that
				// ALL elements use the same instance of the animation.
				clone.style.animation = `wpcomsp-marquee var(--speed) linear infinite var(--direction);`;
			}
		},
	},
});
