// WordPress dependencies.
import { __ } from '@wordpress/i18n';
import { getBlockType, registerBlockVariation } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';

const variations = [
	{
		name: 'a8csp/carousel-images',
		title: __( 'Images Carousel', 'a8csp-carousel' ),
		description: __(
			'Display a gallery in a horizontal series.',
			'a8csp-carousel'
		),
		scope: [ 'block' ],
		innerBlocks: [
			{
				name: 'core/gallery',
				attributes: {
					className: 'wp-block-a8csp-carousel-track',
					columns: 1,
					imageCrop: false,
				},
				metaData: {
					name: __( 'Carousel Track', 'a8csp-carousel' ),
				},
			},
		],
		isActive: [ 'type' ],
		attributes: { type: 'gallery' },
	},
	{
		name: 'a8csp/carousel-posts',
		title: __( 'Posts Carousel', 'a8csp-carousel' ),
		description: __(
			'Display a query loop in a horizontal series.',
			'a8csp-carousel'
		),
		scope: [ 'block' ],
		innerBlocks: [
			{
				name: 'core/query',
				innerBlocks: [
					{
						name: 'core/post-template',
						attributes: {
							className: 'wp-block-a8csp-carousel-track',
						},
						metaData: {
							name: __( 'Carousel Track', 'a8csp-carousel' ),
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
		name: 'a8csp/carousel-cards',
		title: __( 'Cards Carousel', 'a8csp-carousel' ),
		description: __(
			'Display cards in a horizontal series.',
			'a8csp-carousel'
		),
		scope: [ 'block' ],
		innerBlocks: [
			{
				name: 'core/group',
				attributes: {
					className: 'wp-block-a8csp-carousel-track',
				},
				metaData: {
					name: __( 'Carousel Track', 'a8csp-carousel' ),
				},
				innerBlocks: [
					{
						name: 'core/group',
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									level: 3,
									placeholder: __(
										'Card 1',
										'a8csp-carousel'
									),
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
									placeholder: __(
										'Card 2',
										'a8csp-carousel'
									),
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
									placeholder: __(
										'Card 3',
										'a8csp-carousel'
									),
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
	name: 'a8csp/carousel-products',
	title: __( 'Products Carousel', 'a8csp-carousel' ),
	description: __(
		'Display a WooCommerce product collection in a horizontal series.',
		'a8csp-carousel'
	),
	scope: [ 'block' ],
	innerBlocks: [
		{
			name: 'woocommerce/product-collection',
			innerBlocks: [
				{
					name: 'woocommerce/product-template',
					attributes: {
						className: 'wp-block-a8csp-carousel-track',
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
					metaData: {
						name: __( 'Carousel Track', 'a8csp-carousel' ),
					},
				},
			],
		},
	],
	isActive: [ 'type' ],
	attributes: { type: 'product-collection' },
};

domReady( () => {
	if ( getBlockType( 'woocommerce/product-collection' ) ) {
		registerBlockVariation( 'a8csp/carousel', productVariation );
	}
} );

export default variations;
