export function adjustFontSize( element, content ) {
	if ( element ) {
		// const containerWidth = window.getComputedStyle( element.parentElement ).width;
		const containerWidth =
			element.parentElement.getBoundingClientRect().width;

		// Create a temporary hidden element for measurement
		const tempElement = document.createElement( 'div' );
		tempElement.style.position = 'absolute';
		tempElement.style.whiteSpace = 'nowrap';
		tempElement.style.visibility = 'hidden';

		const computedStyle = window.getComputedStyle( element );
		tempElement.style.fontFamily = computedStyle.fontFamily;
		tempElement.style.fontWeight = computedStyle.fontWeight;
		tempElement.style.fontStyle = computedStyle.fontStyle;
		tempElement.style.fontSize = computedStyle.fontSize;
		tempElement.style.letterSpacing = computedStyle.letterSpacing;
		tempElement.style.textTransform = computedStyle.textTransform;

		tempElement.innerHTML = content;
		document.body.appendChild( tempElement );

		const textWidth = tempElement.offsetWidth;

		document.body.removeChild( tempElement ); // Clean up the temporary element

		// Avoid division by zero or very small widths
		if ( textWidth > 0 ) {
			const size = parseInt( containerWidth ) / textWidth;
			element.style.fontSize = `${
				size * parseFloat( window.getComputedStyle( element ).fontSize )
			}px`; // Scale based on the current font size
			element.style.whiteSpace = 'nowrap'; // Ensure text does not wrap
		}
	}
}
