// WordPress dependencies.

import { useBlockProps } from '@wordpress/block-editor';
import { store as blocksStore } from '@wordpress/blocks';
import { Button, Placeholder } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Displays carousel variations if none is selected.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.name     The block's name.
 * @param {Function} props.onSelect Function to set block's attributes.
 *
 * @return {Element} The placeholder.
 */
function CarouselPlaceHolder( { name, onSelect } ) {
	const variations = useSelect(
		( select ) => select( blocksStore ).getBlockVariations( name, 'block' ),
		[ name ]
	);

	const blockProps = useBlockProps( {
		className: 'wp-block-carousel__placeholder',
	} );

	useEffect( () => {
		if ( variations && variations.length === 1 ) {
			onSelect( variations[ 0 ] );
		}
	}, [ onSelect, variations ] );

	return (
		<div { ...blockProps }>
			<Placeholder
				instructions={ __(
					'Create a carousel for:',
					'a8csp-carousel'
				) }
			>
				{ /*
				 * Taken from BlockVariationPicker component.
				 * Disable reason: The `list` ARIA role is redundant but
				 * Safari+VoiceOver won't announce the list otherwise.
				 */
				/* eslint-disable jsx-a11y/no-redundant-roles */ }
				<ul
					role="list"
					className="wp-block-carousel-placeholder__variations wp-block-group-placeholder__variations"
					aria-label={ __( 'Block variations' ) }
				>
					{ variations?.map( ( variation ) => (
						<li key={ variation.name }>
							<Button
								__next40pxDefaultSize
								variant="tertiary"
								onClick={ () => onSelect( variation ) }
								className="wp-block-carousel-placeholder__variation-button"
							>
								{ variation.title.replace( ' Carousel', '' ) }
							</Button>
						</li>
					) ) }
				</ul>
				{ /* eslint-enable jsx-a11y/no-redundant-roles */ }
			</Placeholder>
		</div>
	);
}

export default CarouselPlaceHolder;
