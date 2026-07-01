const $defaultHeadingSelectors = '.wp-block-post-content h1, .wp-block-post-content h2, .wp-block-post-content h3, .wp-block-post-content h4, .wp-block-post-content h5, .wp-block-post-content h6';
const $config = window.wpcomspDynamicTOC || {};
const $headingSelectors = $config.headingSelectors || $defaultHeadingSelectors;
const $includeNestedHeadings = Boolean($config.includeNestedHeadings);
const $excludeSelectors = $config.excludeSelectors || '';
const $headings = document.querySelectorAll($headingSelectors);
const $headingList = document.querySelector('.wp-block-wpcomsp-dynamic-table-of-contents ul');

/**
 * Get a heading's visible text.
 *
 * Headings rendered by wrapper blocks (e.g. accordions) split their title
 * across child elements and add decorative, aria-hidden icons. Cloning the node
 * and dropping aria-hidden children keeps toggle markers like "+"/"-" out of the
 * table of contents label.
 *
 * @param {Element} heading The heading element.
 * @return {string} The trimmed, visible heading text.
 */
function getHeadingText(heading) {
	const $clone = heading.cloneNode(true);
	$clone.querySelectorAll('[aria-hidden="true"]').forEach(($el) => $el.remove());
	return $clone.textContent.trim();
}

/**
 * Turn heading text into an anchor-friendly id that is not already used on the
 * page. Mirrors the server-side `sanitize_title()` slug closely enough for
 * headings that core never anchored.
 *
 * @param {string} text  The heading text.
 * @param {number} index The heading's position, used as a fallback slug.
 * @return {string} A unique id.
 */
function toUniqueId(text, index) {
	let $base = text
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '');

	if (!$base) {
		$base = `toc-heading-${index}`;
	}

	let $id = $base;
	let $suffix = 2;

	while (null !== document.getElementById($id)) {
		$id = `${$base}-${$suffix}`;
		$suffix += 1;
	}

	return $id;
}

// This is the observer that will be used to highlight the current heading.
const $observer = new IntersectionObserver((entries) => {
	let $links = document.querySelectorAll('.wp-block-wpcomsp-dynamic-table-of-contents a');

	entries.forEach((entry) => {
		const $id = entry.target.id;
		const $link = document.querySelector(`.wp-block-wpcomsp-dynamic-table-of-contents a[href="#${$id}"]`);

		if (entry.isIntersecting && $link) {
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

let $isFirstEntry = true;

$headings.forEach((heading, index) => {
	// Never list the table of contents' own title.
	if (heading.closest('.wp-block-wpcomsp-dynamic-table-of-contents')) {
		return;
	}

	// Let authors opt a heading out by adding the exclude class to the heading
	// or any block wrapping it.
	if ($excludeSelectors && heading.closest($excludeSelectors)) {
		return;
	}

	let $id = heading.id;

	// Headings rendered by wrapper blocks (accordions, etc.) never receive a
	// server-side anchor. Without the toggle we keep the original behaviour of
	// only listing headings that already have an id.
	if (!$id) {
		if (!$includeNestedHeadings) {
			return;
		}

		const $text = getHeadingText(heading);

		if (!$text) {
			return;
		}

		$id = toUniqueId($text, index);
		heading.id = $id;
	}

	// Create new elements.
	const $latestListItem = document.createElement('li');
	const $latestLink = document.createElement('a');

	// Add attributes to new elements.
	$latestLink.href = `#${$id}`;
	$latestLink.textContent = getHeadingText(heading);

	// Setup the first listed element as active.
	if ($isFirstEntry) {
		$latestLink.classList.add('active');
		$isFirstEntry = false;
	}

	// Add new elements to the markup.
	$latestListItem.appendChild($latestLink);
	$headingList.appendChild($latestListItem);

	// Setup on scroll highlighting.
	$observer.observe(heading);
});
