export function adjustFontSize( element, content ) {
	if ( element ) {
		const containerWidth = window.getComputedStyle( element.parentElement ).width;

		// Create a temporary hidden element for measurement
		const tempElement = document.createElement( 'div' );
		tempElement.style.position = 'absolute';
		tempElement.style.whiteSpace = 'nowrap';
		tempElement.style.visibility = 'hidden';
		tempElement.style.fontFamily =
			window.getComputedStyle( element ).fontFamily;
		tempElement.style.fontWeight =
			window.getComputedStyle( element ).fontWeight;
		tempElement.style.fontStyle =
			window.getComputedStyle( element ).fontStyle;
		tempElement.style.fontSize =
			window.getComputedStyle( element ).fontSize; // Use the current font size for measurement
		tempElement.innerHTML = content;
		document.body.appendChild( tempElement );

		const textWidth = tempElement.offsetWidth;

		document.body.removeChild( tempElement ); // Clean up the temporary element

		// Avoid division by zero or very small widths
		if ( textWidth > 0 ) {
			const size = parseInt( containerWidth ) / textWidth;
            console.log( size );
			element.style.fontSize = `${
				size * parseFloat( window.getComputedStyle( element ).fontSize )
			}px`; // Scale based on the current font size
			element.style.whiteSpace = 'nowrap'; // Ensure text does not wrap
		}
	}
}
