const $headings = document.querySelectorAll('.wp-block-post-content h1, .wp-block-post-content h2, .wp-block-post-content h3, .wp-block-post-content h4, .wp-block-post-content h5, .wp-block-post-content h6');
const $headingList = document.querySelector('.wp-block-wpcomsp-dynamic-table-of-contents ul');

// This is the observer that will be used to highlight the current heading.
const $observer = new IntersectionObserver((entries) => {
	let $links = document.querySelectorAll('.wp-block-wpcomsp-dynamic-table-of-contents a');

	entries.forEach((entry) => {
		const $id = entry.target.id;
		const $link = document.querySelector(`.wp-block-wpcomsp-dynamic-table-of-contents a[href="#${$id}"]`);

		if (entry.isIntersecting) {
			$links.forEach((link) => {
				link.classList.remove('active');
			});

			$link.classList.add('active');
		}
	});
},
{
	rootMargin: '0px 0px -75% 0px',
});

$headings.forEach((heading, index) => {
	const $id = heading.id;

	if ($id.length) {
		// Create new elements.
		const $latestListItem = document.createElement('li');
		const $latestLink = document.createElement('a');

		// Add attributes to new elements.
		$latestLink.href = `#${$id}`;
		$latestLink.textContent = heading.textContent;

		// Setup the first element as active.
		if (0 === index) {
			$latestLink.classList.add('active');
		}

		// Add new elements to the markup.
		$latestListItem.appendChild($latestLink);
		$headingList.appendChild($latestListItem);

		// Setup on scroll highlighting.
		$observer.observe(heading);
	}

});