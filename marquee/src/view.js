import { store, getElement } from "@wordpress/interactivity";

store("wpcomsp/marquee", {
	callbacks: {
		init: () => {
			const { ref } = getElement();

			// Get all the children of the marquee element.
			const children = ref.querySelectorAll(".wp-block-wpcomsp-marquee__inner");

			// Measure the width of the marquee element.
			const width = ref.getBoundingClientRect().width;

			// Measure the width of all the children.
			let childrenWidth = 0;

			// If the width of the children is less than the width of the marquee
			// element, clone the children to fill the marquee element.
			while (childrenWidth <= width) {
				children.forEach((child) => {
					const clone = child.cloneNode(true);
					ref.appendChild(clone);
					childrenWidth += child.getBoundingClientRect().width;
				});
			}
		},
	},
});
