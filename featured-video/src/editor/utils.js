// Extensions WordPress maps to a video/* mime type, passed in by
// wpcomsp_featured_video_enqueue_editor_assets().
const VIDEO_EXTENSIONS = window.wpcomspFeaturedVideo?.videoExtensions ?? [];

/**
 * Whether a URL points to a video file rather than an oEmbed provider.
 *
 * Mirrors wpcomsp_featured_video_is_direct_video_url(): only the URL's path
 * is checked, so query strings and fragments don't prevent a match.
 *
 * @param {string} url Candidate URL.
 * @return {boolean} True for a direct video file URL.
 */
export const isDirectVideoUrl = ( url ) => {
	let path;

	try {
		// The base resolves URLs typed without a protocol; the path is all we read.
		path = new URL( url, 'https://example.invalid' ).pathname;
	} catch ( error ) {
		return false;
	}

	const extension = /\.([^./]+)$/.exec( path )?.[ 1 ]?.toLowerCase();

	return !! extension && VIDEO_EXTENSIONS.includes( extension );
};
