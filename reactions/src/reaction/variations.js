/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getIcon } from './helpers';

/**
 * Reactions variations.
 */
const variations = [
	{
		isDefault: true,
		name: 'like',
		title: __( 'Like', 'reactions' ),
	},
	{
		name: 'fire',
		title: __( 'Fire', 'reactions' ),
	},
	{
		name: 'laugh',
		title: __( 'Laugh', 'reactions' ),
	},
	{
		name: 'heart',
		title: __( 'Heart', 'reactions' ),
	},
	{
		name: 'cry',
		title: __( 'Cry', 'reactions' ),
	},
	{
		name: 'surprised',
		title: __( 'Surprised', 'reactions' ),
	},
	{
		name: 'angry',
		title: __( 'Angry', 'reactions' ),
	},
	{
		name: 'celebration',
		title: __( 'Celebration', 'reactions' ),
	},
	{
		name: 'sunglasses',
		title: __( 'Sunglasses', 'reactions' ),
	},
	{
		name: 'dislike',
		title: __( 'Dislike', 'reactions' ),
	},
	{
		name: 'star',
		title: __( 'Star', 'reactions' ),
	},
];

/**
 * Add name, icon and `isActive` function to all `reaction` variations.
 */
variations.forEach( ( variation ) => {
	variation.icon = getIcon( variation.name );
	variation.attributes = { name: variation.name, label: variation.title };

	variation.isActive = ( blockAttributes, variationAttributes ) => {
		return blockAttributes.name === variationAttributes.name;
	};
} );

export default variations;
