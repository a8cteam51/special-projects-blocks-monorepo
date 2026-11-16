/**
 * Slide credits come from an optional provider. The Newspack credits script
 * (src/credits), enqueued only while Newspack is active, hooks this filter;
 * without a provider the block shows no credit preview and no credit toggle.
 *
 * Both checks run at render time: the provider script may print after the
 * block's editor script, but always before the editor first renders.
 */
import { applyFilters, hasFilter } from '@wordpress/hooks';

export const SLIDE_CREDIT_FILTER = 'newspackPhotoCarousel.slideCredit';

/**
 * @return {boolean} Whether a credit provider is loaded.
 */
export const hasCreditProvider = () => hasFilter( SLIDE_CREDIT_FILTER );

/**
 * @param {Object|undefined} record    The slide's attachment, with edits applied.
 * @param {string}           className Wrapper class.
 *
 * @return {Element|null} The credit preview, or null when there is none.
 */
export const getSlideCredit = ( record, className ) =>
	applyFilters( SLIDE_CREDIT_FILTER, null, record, className );
