import { adjustFontSize } from './utils';

function handleFontSize() {
	const elements = document.querySelectorAll('.wp-block-wpsp-stretchy-type');

	elements.forEach(element => {
		const content = element.innerHTML;
		adjustFontSize( element, content );
	});
}

document.addEventListener( 'DOMContentLoaded', handleFontSize );
window.addEventListener('resize', handleFontSize );