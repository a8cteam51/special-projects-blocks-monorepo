/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * A new hotspot's card: an image, a heading, a paragraph and a button.
 *
 * Declared on the Hotspot block type, which the editor reads from version
 * 7.2, and created with the hotspot by this block's own "add" controls, so
 * that older editors get it too.
 *
 * @return {Array} The inner blocks template.
 */
export const getCardTemplate = () => [
	[ 'core/image', {} ],
	[
		'core/heading',
		{
			level: 3,
			placeholder: __( 'Hotspot title', 'image-hotspots' ),
		},
	],
	[
		'core/paragraph',
		{
			placeholder: __( 'What is here?', 'image-hotspots' ),
		},
	],
	[
		'core/buttons',
		{},
		[
			[
				'core/button',
				{ placeholder: __( 'Button text', 'image-hotspots' ) },
			],
		],
	],
];
