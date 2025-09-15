// WordPress dependencies.
import { __ } from '@wordpress/i18n';
import { getBlockType } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';

const variations = [
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
					className: 'wp-block-wpcomsp-carousel-track',
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
						attributes: {
							className: 'wp-block-wpcomsp-carousel-track',
						},
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
	{
		name: 'wpcomsp/carousel-cards',
		title: __( 'Cards Carousel', 'carousel' ),
		description: __( 'Display cards in a horizontal series.', 'carousel' ),
		scope: [ 'block' ],
		innerBlocks: [
			{
				name: 'core/group',
				attributes: {
					className: 'wp-block-wpcomsp-carousel-track',
				},
				metaData: {
					name: __( 'Carousel Track', 'carousel' ),
				},
				innerBlocks: [
					{
						name: 'core/group',
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									level: 3,
									placeholder: __( 'Card 1', 'carousel' ),
								},
							},
						],
					},
					{
						name: 'core/group',
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									level: 3,
									placeholder: __( 'Card 2', 'carousel' ),
								},
							},
						],
					},
					{
						name: 'core/group',
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									level: 3,
									placeholder: __( 'Card 3', 'carousel' ),
								},
							},
						],
					},
				],
			},
		],
		isActive: [ 'type' ],
		attributes: { type: 'group' },
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
	innerBlocks: [
		{
			name: 'woocommerce/product-collection',
			innerBlocks: [
				{
					name: 'woocommerce/product-template',
					attributes: {
						className: 'wp-block-wpcomsp-carousel-track',
					},
					innerBlocks: [
						{
							name: 'woocommerce/product-image',
							attributes: {
								showSaleBadge: false,
								imageSizing: 'thumbnail',
								isDescendentOfQueryLoop: true,
							},
							innerBlocks: [
								{
									name: 'woocommerce/product-sale-badge',
									attributes: {
										align: 'right',
									},
								},
							],
						},
						{
							name: 'core/post-title',
							attributes: {
								isLink: true,
							},
						},
						{
							name: 'woocommerce/product-price',
							attributes: {
								isDescendentOfQueryLoop: true,
							},
						},
						{
							name: 'woocommerce/product-button',
							attributes: {
								isDescendentOfQueryLoop: true,
							},
						},
					],
				},
			],
		},
	],
	isActive: [ 'type' ],
	attributes: { type: 'product-collection' },
};

domReady( () => {
	if ( getBlockType( 'woocommerce/product-collection' ) ) {
		variations.push( productVariation );
	}
} );

export default variations;
