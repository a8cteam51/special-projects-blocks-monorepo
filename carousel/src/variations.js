// WordPress dependencies.
import { __ } from '@wordpress/i18n';
import { getBlockType } from '@wordpress/blocks';

const baseVariations = [
	{
		name: 'wpcomsp/carousel-images',
		title: __( 'Images Carousel', 'carousel' ),
		description: __(
			'Display a gallery in a horizontal series.',
			'carousel'
		),
		scope: [ 'block' ],
		innerBlocks: [
			{
				name: 'core/gallery',
				attributes: {
					columns: 1,
					imageCrop: false,
				},
			},
		],
		isActive: [ 'type' ],
		attributes: { type: 'gallery' },
	},
	{
		name: 'wpcomsp/carousel-posts',
		title: __( 'Posts Carousel', 'carousel' ),
		description: __(
			'Display a query loop in a horizontal series.',
			'carousel'
		),
		scope: [ 'block' ],
		innerBlocks: [
			{
				name: 'core/query',
				innerBlocks: [
					{
						name: 'core/post-template',
						innerBlocks: [
							{
								name: 'core/post-featured-image',
								attributes: {
									isLink: true,
								},
							},
							{
								name: 'core/post-title',
								attributes: {
									isLink: true,
								},
							},
						],
					},
				],
			},
		],
		isActive: [ 'type' ],
		attributes: { type: 'query' },
	},
];

const productVariation = {
	name: 'wpcomsp/carousel-products',
	title: __( 'Products Carousel', 'carousel' ),
	description: __(
		'Display a WooCommerce product collection in a horizontal series.',
		'carousel'
	),
	scope: [ 'block' ],
	innerBlocks: [ { name: 'woocommerce/product-collection' } ],
	isActive: [ 'type' ],
	attributes: { type: 'product-collection' },
};

const variations = [
	...baseVariations,
	...( getBlockType( 'woocommerce/product-collection' )
		? [ productVariation ]
		: [] ),
];

export default variations;
