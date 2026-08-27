document.addEventListener( 'DOMContentLoaded', function () {
	const descriptions = document.querySelectorAll(
		'.podcast-feed__episode-description'
	);

	descriptions.forEach( function ( description ) {
		const content = description.querySelector(
			'.podcast-feed__episode-description-content'
		);
		const button = description.querySelector(
			'.podcast-feed__episode-read-more'
		);

		if ( ! content || ! button ) {
			return;
		}

		// Show the button only if the content overflows.
		if ( content.scrollHeight > content.clientHeight ) {
			button.style.display = 'block';
		} else {
			return;
		}

		const readMoreText =
			button.getAttribute( 'data-read-more' ) || 'Read more';
		const readLessText =
			button.getAttribute( 'data-read-less' ) || 'Read less';

		button.addEventListener( 'click', function () {
			const isExpanded = content.classList.toggle( 'is-expanded' );

			this.textContent = isExpanded ? readLessText : readMoreText;
			this.setAttribute( 'aria-expanded', isExpanded ? 'true' : 'false' );
		} );
	} );
} );
