/**
 * Newspack photo credits for the Photo Carousel editor. PHP enqueues this
 * script only while the Newspack plugin is active.
 *
 * It adds the Photo Credit box to carousel images, saves edited credits with
 * the post, and provides the slide credit preview the block asks for through
 * the SLIDE_CREDIT_FILTER (which also turns on its Show credits toggle).
 */
import { addFilter } from '@wordpress/hooks';

import { SLIDE_CREDIT_FILTER } from '../editor/credit-provider';
import { initAttachmentSave } from './attachment-save';
import { initImageCredit } from './image-credit-panel';
import { SlideCredit } from './slide-credit';

initImageCredit();
initAttachmentSave();

addFilter(
	SLIDE_CREDIT_FILTER,
	'newspack-photo-carousel/credits',
	( credit, record, className ) => (
		<SlideCredit record={ record } className={ className } />
	)
);
