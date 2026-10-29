/**
 * Newspack's photo credit for the editor preview, in the markup
 * Newspack_Image_Credits::get_media_credit_string() prints on the front end.
 */

// Printed before this script by Newspack_Photo_Carousel_Credits::enqueue_editor_assets().
export const creditSettings = {
	prefixLabel: '',
	className: 'image-credit',
	...window.newspackPhotoCarousel?.credits,
};

// Newspack's attachment meta keys.
export const CREDIT_META = {
	credit: '_media_credit',
	url: '_media_credit_url',
	organization: '_navis_media_credit_org',
};

const metaText = ( meta, key ) => String( meta[ key ] ?? '' ).trim();

/**
 * @param {Object}           props           Component props.
 * @param {Object|undefined} props.record    The slide's attachment, with edits applied.
 * @param {string}           props.className Wrapper class.
 *
 * @return {Element|null} The credit, or null when the image has none.
 */
export function SlideCredit( { record, className } ) {
	const meta = record?.meta ?? {};
	const credit = metaText( meta, CREDIT_META.credit );
	if ( ! credit ) {
		return null;
	}

	const organization = metaText( meta, CREDIT_META.organization );
	const { prefixLabel, className: creditClass } = creditSettings;

	return (
		<span className={ className }>
			<span className={ creditClass || undefined }>
				{ prefixLabel && (
					<>
						<span className="credit-label-wrapper">
							{ prefixLabel }
						</span>{ ' ' }
					</>
				) }
				{ organization ? `${ credit } / ${ organization }` : credit }
			</span>
		</span>
	);
}
