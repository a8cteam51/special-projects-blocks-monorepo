/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';
import { createUid } from './helpers.js';

const { state } = store( 'wpcomsp/reactions', {
	state: {
		token: '',
		processing: false,
		popoverPositionsTop: {},
		popoverPositionsLeft: {},
		/**
		 * Get the top position of the popover.
		 *
		 * @return {string} The top position of the popover.
		 */
		get popoverTop() {
			const { uid } = getContext();
			return state.popoverPositionsTop[ uid ] || '0px';
		},
		/**
		 * Get the left position of the popover.
		 *
		 * @return {string} The left position of the popover.
		 */
		get popoverLeft() {
			const { uid } = getContext();
			return state.popoverPositionsLeft[ uid ] || '0px';
		},
		/**
		 * User has any reaction to the post.
		 *
		 * @return {boolean} True if user has any reaction.
		 */
		get hasAnyReaction() {
			const { postId, uid } = getContext();
			return (
				state.usr.reactions[ postId ] !== undefined &&
				state.usr.reactions[ postId ] !== ''
			);
		},
		/**
		 * User has a specific reaction to the post.
		 *
		 * @return {boolean} True if user has certain reaction.
		 */
		get hasReactionByName() {
			const { name, postId } = getContext();
			return state.usr.reactions[ postId ] === name;
		},
		/**
		 * Individual reaction count of the post by name.
		 *
		 * @return {number} The count of the reaction.
		 */
		get reactionCountByName() {
			const { postId, name } = getContext();
			return state.srv.reactions[ postId ][ name ] || 0;
		},
	},
	actions: {
		/**
		 * Generator function to handle reactions.
		 */
		*handleReaction() {
			const { name, postId } = getContext();

			// Prevent multiple requests.
			if ( state.processing ) {
				return;
			}

			const existingReaction = state.usr.reactions[ postId ];

			// Optimistically update the user's state.
			if ( state.usr.reactions[ postId ] === name ) {
				delete state.usr.reactions[ postId ];
			} else {
				state.usr.reactions[ postId ] = name;
			}

			try {
				state.processing = true;

				const token = localStorage.getItem( 'WPCOMSP_REACTIONS_TOKEN' );

				const response = yield fetch(
					`${ state.root }wpcomsp-reactions/v1/react`,
					{
						method: 'POST',
						credentials: 'same-origin',
						headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': state.nonce,
						},
						body: JSON.stringify( {
							postId,
							token,
							reaction: name,
						} ),
					}
				);

				const data = yield response.json();

				if ( ! response.ok ) {
					throw new Error( response.statusText );
				}

				state.srv.reactions[ postId ] = data;
			} catch ( e ) {
				console.error( e );

				// Revert the user's state.
				state.usr.reactions[ postId ] = existingReaction;
			} finally {
				// Minor throttle added to prevent users from hammering server.
				setTimeout( function () {
					state.processing = false;
				}, 300 );
			}
		},
	},
	callbacks: {
		/**
		 * Initialize the state.
		 */
		init: () => {
			let token = localStorage.getItem( 'WPCOMSP_REACTIONS_TOKEN' );

			// If the token is already set, fetch the user's reaction.
			if ( token ) {
				const { postId } = getContext();
				const endpoint = new URL(
					`${ state.root }wpcomsp-reactions/v1/get-reaction`
				);

				endpoint.searchParams.append( 'postId', postId );
				endpoint.searchParams.append( 'token', token );

				fetch( endpoint )
					.then( ( response ) => response.json() )
					.then( ( data ) => {
						state.usr.reactions[ postId ] = data;
					} )
					.catch( ( error ) => {
						console.error( error );
					} );
			} else {
				// Otherwise, create and set a new token.
				token = createUid();

				localStorage.setItem( 'WPCOMSP_REACTIONS_TOKEN', token );
			}

			// Set the token in the state.
			state.token = token;
		},
		/**
		 * Set popover top/left positions.
		 */
		positionPopover: () => {
			const { uid } = getContext();
			const scrollY = window.scrollY;

			// The popover element.
			const popover = document.getElementById(
				`wp-block-wpcomsp-reactions__popover-${ uid }`
			);

			// The block wrapper.
			const block = popover.closest(
				'.wp-block-wpcomsp-reactions__popover'
			);

			// Set up ResizeObserver to account for layout shifts.
			const resizeObserver = new ResizeObserver( () => {
				const blockRect = block.getBoundingClientRect();
				const blockHeight = blockRect.height;

				/**
				 * Left position calculation.
				 */
				let left = blockRect.left;

				if ( HTMLDivElement.prototype.showPopover ) {
					// Workaround needed until Popover API allows width calculation.
					popover.classList.add(
						'wp-block-wpcomsp-reactions__popover--calculation'
					);

					popover.showPopover();

					const popoverRect = popover.getBoundingClientRect();
					const popoverWidth = popoverRect.width;

					popover.hidePopover();

					popover.classList.remove(
						'wp-block-wpcomsp-reactions__popover--calculation'
					);

					if ( left + popoverWidth > window.innerWidth ) {
						left = Math.min(
							window.innerWidth - popoverWidth,
							left
						);
						left = Math.max( 0, left );
					}
				}

				/**
				 * Top position calculation.
				 */
				const top = blockRect.top + blockHeight + scrollY;

				state.popoverPositionsTop[ uid ] = `${ top }px`;
				state.popoverPositionsLeft[ uid ] = `${ left }px`;
			} );

			resizeObserver.observe( document.body );
		},
	},
} );
