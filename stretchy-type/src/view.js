function init() {
	const observer = new window.ResizeObserver( ( entries ) => {
		entries.forEach( ( { target } ) => {
			const { offsetWidth, offsetHeight } = target;
			target
				.closest( 'svg' )
				.setAttribute(
					'viewBox',
					`0 0 ${ offsetWidth } ${ offsetHeight }`
				);
		} );
	} );

	document
		.querySelectorAll(
			'.wp-block-wpsp-stretchy-type > foreignObject > span'
		)
		.forEach( ( element ) => observer.observe( element ) );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
