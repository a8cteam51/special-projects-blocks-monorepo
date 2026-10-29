/**
 * Saves edited attachments (the slides' photo credits) with the post. Core
 * offers them only in the header Save button's confirmation dialog; Ctrl+S
 * and Save draft save the post alone, so a typed credit was kept in the
 * editor and lost on reload.
 *
 * Autosaves skip them: the credit is shared by every use of the image, so a
 * half-typed one must not go live unattended. Core's Ctrl+S ignores a clean
 * post, so a second handler covers the case where an autosave (which writes
 * the author's own draft) left only the attachment unsaved.
 */

import { store as coreStore } from '@wordpress/core-data';
import { dispatch, select } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { useShortcut } from '@wordpress/keyboard-shortcuts';
import { store as noticesStore } from '@wordpress/notices';
import { registerPlugin } from '@wordpress/plugins';

import { CREDIT_META } from './slide-credit';

const CREDIT_KEYS = Object.values( CREDIT_META );

/**
 * The credit fields changed on an attachment, as { metaKey: value }.
 *
 * Only these are sent: the merged `meta` edit carries every registered key,
 * and REST refuses protected keys that have no auth_callback (Newspack's own
 * `_navis_media_can_distribute`), failing the whole save.
 *
 * @param {number} id Attachment ID.
 *
 * @return {Object} Changed credit meta.
 */
function changedCredit( id ) {
	const { getEditedEntityRecord, getEntityRecord } = select( coreStore );
	const edited =
		getEditedEntityRecord( 'postType', 'attachment', id )?.meta ?? {};
	const saved = getEntityRecord( 'postType', 'attachment', id )?.meta ?? {};

	return Object.fromEntries(
		CREDIT_KEYS.filter(
			( key ) => key in edited && edited[ key ] !== saved[ key ]
		).map( ( key ) => [ key, edited[ key ] ] )
	);
}

/**
 * Saves the credit edits of every attachment that has some.
 *
 * @return {Promise<{count: number, failed: number}>} How many were pending and
 *                                                    how many failed to save.
 */
async function savePending() {
	const pending = select( coreStore )
		.__experimentalGetDirtyEntityRecords()
		.filter(
			( { kind, name } ) => 'postType' === kind && 'attachment' === name
		)
		.map( ( { key } ) => ( { id: key, meta: changedCredit( key ) } ) )
		.filter( ( { meta } ) => Object.keys( meta ).length > 0 );

	const results = await Promise.allSettled(
		pending.map( ( record ) =>
			dispatch( coreStore ).saveEntityRecord(
				'postType',
				'attachment',
				record,
				{ throwOnError: true }
			)
		)
	);

	return {
		count: pending.length,
		failed: results.filter( ( { status } ) => 'rejected' === status )
			.length,
	};
}

/**
 * Tells the user an attachment did not save. The edit stays pending, so the
 * next save retries it.
 *
 * @return {void}
 */
function notifyFailure() {
	dispatch( noticesStore ).createErrorNotice(
		__(
			'The photo credit could not be saved. Save again to retry.',
			'newspack-photo-carousel'
		),
		{
			type: 'snackbar',
		}
	);
}

/**
 * Saves pending attachments ahead of the post itself. A failure (an Author
 * editing someone else's upload, a dropped connection) becomes a notice, not
 * a thrown error, so the post still saves.
 *
 * @param {Object} edits   The post edits about to be saved.
 * @param {Object} options Save options; isAutosave is set for autosaves.
 *
 * @return {Promise<Object>} The edits, unchanged.
 */
async function saveAttachments( edits, options ) {
	if ( options?.isAutosave ) {
		return edits;
	}

	const { failed } = await savePending();

	if ( failed ) {
		notifyFailure();
	}

	return edits;
}

/**
 * Ctrl+S with a clean post: core does nothing, so save the attachments here.
 * A dirty post is left to core, whose save runs saveAttachments.
 *
 * @param {KeyboardEvent} event The shortcut.
 *
 * @return {Promise<void>}
 */
async function saveOnShortcut( event ) {
	const editor = select( editorStore );

	if (
		editor.isEditedPostDirty() ||
		editor.isSavingPost() ||
		editor.isPostSavingLocked()
	) {
		return;
	}

	event.preventDefault();

	const { count, failed } = await savePending();

	if ( failed ) {
		notifyFailure();
	} else if ( count ) {
		dispatch( noticesStore ).createSuccessNotice(
			__( 'Photo credit saved.', 'newspack-photo-carousel' ),
			{ type: 'snackbar' }
		);
	}
}

function AttachmentSaveShortcut() {
	useShortcut( 'core/editor/save', saveOnShortcut );

	return null;
}

/**
 * Registers the pre-save hook and the shortcut.
 *
 * @return {void}
 */
export function initAttachmentSave() {
	addFilter(
		'editor.preSavePost',
		'newspack-photo-carousel/attachment-save',
		saveAttachments
	);

	registerPlugin( 'newspack-photo-carousel-attachment-save', {
		render: AttachmentSaveShortcut,
	} );
}
