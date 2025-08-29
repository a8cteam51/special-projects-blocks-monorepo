document
	.querySelectorAll( '.wp-block-a8csp-scroll-progress-bar progress' )
	.forEach( ( progressBar ) => {
		if ( ! progressBar ) {
			return;
		}

		let ticking = false;

		function updateProgressBar() {
			const scrollTop = Math.max(
				window.scrollY || window.pageYOffset || 0,
				0
			);
			const scrollHeight = Math.max(
				document.documentElement.scrollHeight - window.innerHeight,
				0
			);
			const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
			// Ensure <progress> receives a valid value in [0, 1].
			progressBar.max = 1;
			progressBar.value = Math.min( 1, Math.max( 0, ratio ) );
			ticking = false;
		}

		function requestTick() {
			if ( ! ticking ) {
				requestAnimationFrame( updateProgressBar );
				ticking = true;
			}
		}

		window.addEventListener( 'scroll', requestTick, { passive: true } );
		window.addEventListener( 'resize', requestTick );
		window.addEventListener( 'load', updateProgressBar );
		updateProgressBar(); // Initialize on load
	} );
