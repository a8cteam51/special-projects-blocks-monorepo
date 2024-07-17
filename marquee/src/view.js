import { store, getElement } from "@wordpress/interactivity";

store("wpcomsp/marquee", {
	callbacks: {
		init: () => {
			const { ref } = getElement();
			const clonedElement = ref.firstElementChild.cloneNode(true);
			ref.appendChild(clonedElement);
		},
	},
});
