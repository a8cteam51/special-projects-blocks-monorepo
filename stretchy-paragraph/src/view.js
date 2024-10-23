import { store, getElement } from "@wordpress/interactivity";

store("wpcomsp/stretchy-paragraph", {
	callbacks: {
		init() {
			const { ref } = getElement();

			const tempElement = document.createElement("span");
			tempElement.style.position = "absolute";
			tempElement.style.whiteSpace = "nowrap";
			tempElement.style.visibility = "hidden";
			tempElement.style.fontSize = "200px";

			tempElement.innerHTML = ref.innerHTML;
			ref.appendChild(tempElement);

			const textWidth = tempElement.offsetWidth;
			const fontSize = parseFloat(
				window.getComputedStyle(tempElement).fontSize,
			);

			tempElement.remove();

			ref.style.fontSize = `calc( ${fontSize / textWidth} * 100cqw )`;
			ref.parentElement.style.containerType = "inline-size";
		},
	},
});
