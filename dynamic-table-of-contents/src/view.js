/* global IntersectionObserver */
( function () {
	// Get the table of contents block element and extract heading levels
	const $tocBlock = document.querySelector(
		'.wp-block-wpcomsp-dynamic-table-of-contents'
	);
	const $headingList = $tocBlock ? $tocBlock.querySelector( 'ul' ) : null;

	if ( ! $tocBlock || ! $headingList ) {
		return;
	}

	// Get the allowed heading levels from data attribute
	const headingLevelsData = $tocBlock.getAttribute( 'data-heading-levels' );
	const allowedHeadings = headingLevelsData
		? headingLevelsData.split( ',' )
		: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

	// Build selector for allowed headings
	const headingSelectors = allowedHeadings
		.map( ( level ) => `.wp-block-post-content ${ level }` )
		.join( ', ' );
	const $headings = document.querySelectorAll( headingSelectors );

	// This is the observer that will be used to highlight the current heading.
	const $observer = new IntersectionObserver(
		( entries ) => {
			const $links = document.querySelectorAll(
				'.wp-block-wpcomsp-dynamic-table-of-contents a'
			);

			entries.forEach( ( entry ) => {
				const $id = entry.target.id;
				const $link = document.querySelector(
					`.wp-block-wpcomsp-dynamic-table-of-contents a[href="#${ $id }"]`
				);

				if ( entry.isIntersecting ) {
					$links.forEach( ( link ) => {
						link.classList.remove( 'active' );
					} );

					$link.classList.add( 'active' );
				}
			} );
		},
		{
			rootMargin: '0px 0px -75% 0px',
		}
	);

	$headings.forEach( ( heading, index ) => {
		const $id = heading.id;

		// Only process headings that have an ID
		if ( $id.length ) {
			// Create new elements.
			const $latestListItem = document.createElement( 'li' );
			const $latestLink = document.createElement( 'a' );

			// Add attributes to new elements.
			$latestLink.href = `#${ $id }`;
			$latestLink.textContent = heading.textContent;

			// Setup the first element as active.
			if ( 0 === index ) {
				$latestLink.classList.add( 'active' );
			}

			// Add new elements to the markup.
			$latestListItem.appendChild( $latestLink );
			$headingList.appendChild( $latestListItem );

			// Setup on scroll highlighting.
			$observer.observe( heading );
		}
	} );
} )();
