/**
 * Which slides stay rendered: the active one, its neighbours (wrapping, as
 * the arrows do) and the one just left, so it can still fade out. The render
 * hides the rest, so their lazy images wait until they join the window.
 *
 * @param {number} active   Active slide index.
 * @param {number} count    Number of slides.
 * @param {number} previous Index of the slide just left.
 *
 * @return {Set<number>} Slide indexes to keep rendered.
 */
export function getSlideWindow( active, count, previous = active ) {
	if ( count < 1 ) {
		return new Set();
	}

	return new Set( [
		active,
		( active + 1 ) % count,
		( active - 1 + count ) % count,
		previous,
	] );
}
