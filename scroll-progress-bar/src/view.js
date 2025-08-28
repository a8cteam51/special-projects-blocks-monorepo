document.addEventListener( 'DOMContentLoaded', function () {
	const progressBar = document.querySelector(
		'.wp-block-a8csp-scroll-progress-bar progress'
	);

	if ( ! progressBar ) {
		return;
	}

	let ticking = false;

	function updateProgressBar() {
		const scrollTop = window.scrollY;
		const scrollHeight =
			document.documentElement.scrollHeight - window.innerHeight;
		progressBar.value = scrollTop / scrollHeight;
		ticking = false;
	}

	function requestTick() {
		if ( ! ticking ) {
			requestAnimationFrame( updateProgressBar );
			ticking = true;
		}
	}

	window.addEventListener( 'scroll', requestTick );
	updateProgressBar(); // Initialize on load
} );
