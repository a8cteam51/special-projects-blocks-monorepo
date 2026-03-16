import './style.scss';

document.addEventListener( 'click', ( ev ) => {
	const target = ev.target;
	const overlayWrapper = target.closest( '.watco' );
	const overlay = overlayWrapper?.querySelector( '.watco__overlay' );

	closeOtherOpenOverlays( ev );

	if ( ! overlay ) {
		return;
	}

	//add-to-cart-button -> toggle overlay
	if ( target.closest( '.watco-add-to-cart-button' ) ) {
		displayForm( overlay, true );
	}

	//close button -> close overlay
	if ( target.closest( '.watco__close' ) ) {
		displayForm( overlay, false );
	}
} );

document.addEventListener( 'keyup', ( ev ) => {
	if ( ev.key === 'Escape' ) {
		const openOverlays = document.querySelectorAll(
			'.watco__overlay.show-form'
		);
		openOverlays.forEach( ( openOverlay ) => {
			displayForm( openOverlay, false );
		} );
	}
} );

document.addEventListener( 'submit', ( event ) => {
	const form = event.target;

	//ignore if not a watco cart form
	if ( ! form.closest( 'form.cart' ) || ! form.closest( '.watco__overlay' ) ) {
		return;
	}

	// stop form submision and send form data via ajax
	event.preventDefault();
	const formData = new FormData( form );
	const submitBtn = form.querySelector( '.single_add_to_cart_button' );

	//append simple product data
	if ( submitBtn && submitBtn.name !== '' && submitBtn.value !== '' ) {
		formData.append( submitBtn.name, submitBtn.value );
	}
	const url = event.target.action;

	// send form data
	fetch( url, {
		method: 'POST',
		body: formData,
	} )
		.then( ( response ) => response.text() )
		.then( ( responseText ) => {
			//remove old notices a second time for racing conditions and similar
			document.querySelector( '.watco-notices' )?.remove();

			const parser = new window.DOMParser();
			// This creates a full HTML document, but scripts will NOT execute
			const doc = parser.parseFromString( responseText, 'text/html' );

			const noticesWrapper = doc.querySelector(
				'.wc-block-store-notices'
			);

			// found error notice in response
			// display this error notice on the page
			if (
				noticesWrapper.querySelector(
					'.wc-block-components-notice-banner.is-error'
				)
			) {
				noticesWrapper
					.querySelectorAll(
						'.wc-block-components-notice-banner:not(.is-error)'
					)
					.forEach( ( notice ) => {
						notice.remove();
					} );

				//find existing notice wrapper or main or first element after the header
				const noticeAnchor =
					document.querySelector(
						':is(.wc-block-components-notices, .wc-block-store-notices):not(.watco-notices)'
					) ||
					document.querySelector( 'main > *' ) ||
					document.querySelector(
						'.wp-site-blocks > *:not( header )'
					);

				noticesWrapper.classList.add( 'watco-notices' );

				// add before existing container
				if ( noticeAnchor ) {
					noticeAnchor.before( noticesWrapper );
					noticesWrapper.scrollIntoView( { behavior: 'smooth' } );
				}
			} else {
				reloadMiniCart();
				openMiniCart();
			}
		} )
		.catch( () => {
			//remove old notices
			document.querySelector( '.watco-notices' )?.remove();
		} );
} );

/**
 * Close open overlays other than the one clicked (.watco__overlay__content)
 *
 * @param {MouseEvent|null} ev The element that was clicked.
 */
function closeOtherOpenOverlays( ev ) {
	const target = ev.target;
	const overlayWrapper = target?.closest( '.watco' );
	const overlay = overlayWrapper?.querySelector( '.watco__overlay' );
	const openOverlays = document.querySelectorAll(
		'.watco__overlay.show-form'
	);

	// close open overlays
	openOverlays.forEach( ( openOverlay ) => {
		// close open quick view if clicked outside of open quick view
		if (
			! openOverlay ||
			! overlay ||
			overlay !== openOverlay ||
			! openOverlay
				.querySelector( '.watco__overlay__content' )
				?.contains( target )
		) {
			// prevent event on mobile or on desktop if clicked on the same product
			if (
				isMobile() ||
				target.closest( '.wc-block-product' ) ===
					openOverlay.closest( '.wc-block-product' )
			) {
				ev.preventDefault();
			}

			displayForm( openOverlay, false );
		}
	} );
}

/**
 * Toggle or hide the overlay. If @param toggle is false,
 * the overlay will be closed. Otherwise it will be toggled.
 *
 * @param {HTMLElement} overlay Overlay element (.watco__overlay).
 * @param {boolean}     toggle  Whether to toggle or close the overlay.
 */
function displayForm( overlay, toggle ) {
	const show = toggle && ! overlay.classList.contains( 'show-form' );
	const overlayWrapper = overlay.closest( '.watco' );

	//show
	if ( show ) {
		//mobile - append to body
		if ( isMobile() ) {
			document.documentElement.classList.add( 'has-modal-open' );
		}
		window.requestAnimationFrame( () => {
			overlay.inert = false;
			overlayWrapper?.classList.add( 'show-form' );
			overlay.classList.add( 'show-form' );

			overlay.querySelector( '.watco__product-link' )?.focus();

			document.dispatchEvent(
				new CustomEvent( 'watco__overlay-shown', {
					detail: { overlayWrapper, overlay },
				} )
			);
		} );

		//hide
	} else {
		overlayWrapper?.classList.remove( 'show-form' );
		overlay.classList.remove( 'show-form' );
		overlay.inert = true;

		overlayWrapper?.querySelector( '.watco-add-to-cart-button' )?.focus();

		document.documentElement.classList.remove( 'has-modal-open' );

		document.dispatchEvent(
			new CustomEvent( 'watco__overlay-hidden', {
				detail: { overlayWrapper, overlay },
			} )
		);
	}
}

/**
 * Check if current view is considered mobile.
 *
 * @return {boolean} Whether the current view is considered mobile.
 */
function isMobile() {
	const windowWidth = window.visualViewport
		? window.visualViewport.width * window.visualViewport.scale
		: window.innerWidth;
	return windowWidth < 768;
}

/**
 * Reloads the mini cart.
 */
function reloadMiniCart() {
	const refreshEvent = new CustomEvent( 'wc-blocks_added_to_cart', {
		bubbles: true,
		cancelable: true,
		detail: { preserveCartData: false },
	} );
	document.body.dispatchEvent( refreshEvent );
}

/**
 * Opens the mini cart.
 */
function openMiniCart() {
	document
		.querySelector(
			'.wp-block-woocommerce-mini-cart .wc-block-mini-cart__button'
		)
		?.click();
}
