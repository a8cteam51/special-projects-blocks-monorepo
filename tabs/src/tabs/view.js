/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   tabs-automatic.js
 *
 *   Desc:   Tablist widget that implements ARIA Authoring Practices
 */

'use strict';

class TabsAutomatic {
	constructor( groupNode ) {
		this.tablistNode = groupNode;

		this.tabs = [];

		this.firstTab = null;
		this.lastTab = null;

		this.tabs = Array.from(
			this.tablistNode.querySelectorAll( '.tab' )
		);
		this.tabpanels = [];

		for ( let i = 0; i < this.tabs.length; i += 1 ) {
			const tab = this.tabs[ i ];
			const tabpanel = document.getElementById(
				tab.getAttribute( 'aria-controls' )
			);

			this.tabpanels.push( tabpanel );

			tab.addEventListener( 'keydown', this.onKeydown.bind( this ) );
			tab.addEventListener( 'click', this.onClick.bind( this ) );

			if ( ! this.firstTab ) {
				this.firstTab = tab;
			}
			this.lastTab = tab;
		}
	}

	setSelectedTab( currentTab, setFocus ) {
		if ( typeof setFocus !== 'boolean' ) {
			setFocus = true;
		}
		for ( let i = 0; i < this.tabs.length; i += 1 ) {
			const tab = this.tabs[ i ];
			if ( currentTab === tab ) {
				tab.setAttribute( 'aria-selected', 'true' );
				tab.removeAttribute( 'tabindex' );
				this.tabpanels[ i ].removeAttribute( 'hidden' );
				if ( setFocus ) {
					tab.focus();
				}
			} else {
				tab.setAttribute( 'aria-selected', 'false' );
				tab.tabIndex = -1;
				this.tabpanels[ i ].setAttribute( 'hidden', true );
			}
		}
	}

	setSelectedToPreviousTab( currentTab ) {
		let index;

		if ( currentTab === this.firstTab ) {
			this.setSelectedTab( this.lastTab );
		} else {
			index = this.tabs.indexOf( currentTab );
			this.setSelectedTab( this.tabs[ index - 1 ] );
		}
	}

	setSelectedToNextTab( currentTab ) {
		let index;

		if ( currentTab === this.lastTab ) {
			this.setSelectedTab( this.firstTab );
		} else {
			index = this.tabs.indexOf( currentTab );
			this.setSelectedTab( this.tabs[ index + 1 ] );
		}
	}

	/* EVENT HANDLERS */

	onKeydown( event ) {
		const tgt = event.currentTarget;
		let flag = false;

		switch ( event.key ) {
			case 'ArrowLeft':
				this.setSelectedToPreviousTab( tgt );
				flag = true;
				break;

			case 'ArrowRight':
				this.setSelectedToNextTab( tgt );
				flag = true;
				break;

			case 'Home':
				this.setSelectedTab( this.firstTab );
				flag = true;
				break;

			case 'End':
				this.setSelectedTab( this.lastTab );
				flag = true;
				break;

			default:
				break;
		}

		if ( flag ) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	onClick( event ) {
		this.setSelectedTab( event.currentTarget );
	}
}

class TabsScrollHandler {
	constructor( container ) {
		this.container = container;
		this.tablist = container.querySelector( '[role="tablist"]' );
		this.leftArrow = container.querySelector( '.scroll-arrow-left' );
		this.rightArrow = container.querySelector( '.scroll-arrow-right' );

		if ( ! this.tablist || ! this.leftArrow || ! this.rightArrow ) {
			return;
		}

		this.init();
	}

	init() {
		this.updateArrowVisibility();
		this.bindEvents();
		this.handleResize();
	}

	bindEvents() {
		// Scroll arrow click events
		this.leftArrow.addEventListener( 'click', () => {
			if ( this.leftArrow.style.display !== 'none' ) {
				this.scrollLeft();
			}
		} );

		this.rightArrow.addEventListener( 'click', () => {
			if ( this.rightArrow.style.display !== 'none' ) {
				this.scrollRight();
			}
		} );

		// Keyboard support for scroll arrows
		this.leftArrow.addEventListener( 'keydown', ( event ) => {
			if ( ( event.key === 'Enter' || event.key === ' ' ) && this.leftArrow.style.display !== 'none' ) {
				event.preventDefault();
				this.scrollLeft();
			}
		} );

		this.rightArrow.addEventListener( 'keydown', ( event ) => {
			if ( ( event.key === 'Enter' || event.key === ' ' ) && this.rightArrow.style.display !== 'none' ) {
				event.preventDefault();
				this.scrollRight();
			}
		} );

		// Tablist scroll event
		this.tablist.addEventListener( 'scroll', () => {
			this.updateArrowVisibility();
		} );

		// Window resize event
		window.addEventListener( 'resize', () => {
			this.handleResize();
		} );
	}

	scrollLeft() {
		const scrollAmount = this.tablist.clientWidth * 0.8;
		this.tablist.scrollBy( {
			left: -scrollAmount,
			behavior: 'smooth'
		} );
	}

	scrollRight() {
		const scrollAmount = this.tablist.clientWidth * 0.8;
		this.tablist.scrollBy( {
			left: scrollAmount,
			behavior: 'smooth'
		} );
	}

	updateArrowVisibility() {
		const { scrollLeft, scrollWidth, clientWidth } = this.tablist;
		const isScrollable = scrollWidth > clientWidth;

		// Show/hide arrows based on scrollability
		if ( ! isScrollable ) {
			this.leftArrow.style.display = 'none';
			this.rightArrow.style.display = 'none';
			return;
		}

		// Show/hide arrows based on scroll position
		// Left arrow: hide when at the beginning, show when there's content to scroll left
		if ( scrollLeft <= 0 ) {
			this.leftArrow.style.display = 'none';
		} else {
			this.leftArrow.style.display = 'block';
			this.leftArrow.removeAttribute( 'disabled' );
			this.leftArrow.style.opacity = '1';
			this.leftArrow.style.cursor = 'pointer';
		}

		// Right arrow: hide when at the end, show when there's content to scroll right
		if ( scrollLeft >= scrollWidth - clientWidth - 1 ) {
			this.rightArrow.style.display = 'none';
		} else {
			this.rightArrow.style.display = 'block';
			this.rightArrow.removeAttribute( 'disabled' );
			this.rightArrow.style.opacity = '1';
			this.rightArrow.style.cursor = 'pointer';
		}
	}

	handleResize() {
		// Debounce resize handling
		clearTimeout( this.resizeTimeout );
		this.resizeTimeout = setTimeout( () => {
			this.updateArrowVisibility();
		}, 100 );
	}
}

// Initialize tablists.
window.addEventListener( 'load', function () {
	const tablists = document.querySelectorAll(
		'.wp-block-wpcomsp-tabs [role=tablist]'
	);
	for ( let i = 0; i < tablists.length; i++ ) {
		new TabsAutomatic( tablists[ i ] );
	}

	// Initialize scroll arrows for tabs
	const tabsContainers = document.querySelectorAll(
		'.wp-block-wpcomsp-tabs .tabs-container'
	);
	for ( let i = 0; i < tabsContainers.length; i++ ) {
		new TabsScrollHandler( tabsContainers[ i ] );
	}
} );
