const { test, expect } = require( '@playwright/test' );
const path = require( 'path' );

const fixtureURL =
	'file://' +
	path.resolve( __dirname, 'fixtures', 'crossfade-page.html' );

test.describe( 'cover-bg-crossfade reduced motion', () => {
	test( 'applies fixed positioning and transition when motion is allowed', async ( {
		page,
	} ) => {
		await page.emulateMedia( { reducedMotion: 'no-preference' } );
		await page.goto( fixtureURL );

		const bg = page.locator(
			'.wp-block-cover.is-style-a8csp-cover-bg-crossfade .wp-block-cover__image-background'
		);

		await expect( bg.first() ).toHaveCSS( 'position', 'fixed' );

		const transition = await bg.first().evaluate( ( el ) => {
			return window.getComputedStyle( el ).transition;
		} );

		expect( transition ).toMatch( /opacity 0\.5s ease-out/ );
	} );

	test( 'disables fixed positioning when prefers-reduced-motion is reduce', async ( {
		page,
	} ) => {
		await page.emulateMedia( { reducedMotion: 'reduce' } );
		await page.goto( fixtureURL );

		const bg = page.locator(
			'.wp-block-cover.is-style-a8csp-cover-bg-crossfade .wp-block-cover__image-background'
		);

		await expect( bg.first() ).toHaveCSS( 'position', 'absolute' );
	} );

	test( 'disables transition when prefers-reduced-motion is reduce', async ( {
		page,
	} ) => {
		await page.emulateMedia( { reducedMotion: 'reduce' } );
		await page.goto( fixtureURL );

		const bg = page.locator(
			'.wp-block-cover.is-style-a8csp-cover-bg-crossfade .wp-block-cover__image-background'
		);

		const transition = await bg.first().evaluate( ( el ) => {
			return window.getComputedStyle( el ).transition;
		} );

		// "transition: none" computes to "all 0s ease 0s" in most browsers
		expect( transition ).toMatch( /none|all 0s/ );
	} );

	test( 'keeps all backgrounds visible when prefers-reduced-motion is reduce', async ( {
		page,
	} ) => {
		await page.emulateMedia( { reducedMotion: 'reduce' } );
		await page.goto( fixtureURL );

		const bgs = page.locator(
			'.wp-block-cover.is-style-a8csp-cover-bg-crossfade .wp-block-cover__image-background'
		);

		const count = await bgs.count();
		for ( let i = 0; i < count; i++ ) {
			await expect( bgs.nth( i ) ).toHaveCSS( 'opacity', '1' );
		}
	} );

	test( 'does not add show-video class when prefers-reduced-motion is reduce', async ( {
		page,
	} ) => {
		await page.emulateMedia( { reducedMotion: 'reduce' } );
		await page.goto( fixtureURL );

		// Wait a tick for any JS to run
		await page.waitForTimeout( 200 );

		const covers = page.locator(
			'.wp-block-cover.is-style-a8csp-cover-bg-crossfade'
		);
		const count = await covers.count();
		for ( let i = 0; i < count; i++ ) {
			await expect( covers.nth( i ) ).not.toHaveClass( /show-video/ );
		}
	} );

	test( 'adds show-video class when motion is allowed', async ( {
		page,
	} ) => {
		await page.emulateMedia( { reducedMotion: 'no-preference' } );
		await page.goto( fixtureURL );

		// Wait for JS to initialize and apply classes
		await page.waitForTimeout( 200 );

		const covers = page.locator(
			'.wp-block-cover.is-style-a8csp-cover-bg-crossfade'
		);

		// At least one cover should have show-video class
		const classNames = [];
		const count = await covers.count();
		for ( let i = 0; i < count; i++ ) {
			classNames.push(
				await covers.nth( i ).getAttribute( 'class' )
			);
		}

		const hasShowVideo = classNames.some( ( c ) =>
			c.includes( 'show-video' )
		);
		expect( hasShowVideo ).toBe( true );
	} );

	test( 'resets overscroll-behavior to auto when prefers-reduced-motion is reduce', async ( {
		page,
	} ) => {
		await page.emulateMedia( { reducedMotion: 'reduce' } );
		await page.goto( fixtureURL );

		const overscrollBehavior = await page.evaluate( () => {
			return window.getComputedStyle( document.body )
				.overscrollBehavior;
		} );

		expect( overscrollBehavior ).toBe( 'auto' );
	} );
} );
