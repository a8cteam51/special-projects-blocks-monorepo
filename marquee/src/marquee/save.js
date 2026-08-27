/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @param {Object} props            - The block props.
 * @param {Object} props.attributes - The block attributes.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const {
		direction,
		speed,
		pauseOnHover,
		gap,
		fadeEdges,
		verticalAlignment,
		hasMaxHeight,
		maxHeight,
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: `wp-block-a8csp-marquee direction-${ direction }${
			fadeEdges ? ' has-fade' : ''
		} speed-${ speed } ${ pauseOnHover ? ' has-pause-on-hover' : '' }${
			verticalAlignment ? ` align-${ verticalAlignment }` : ''
		}${ hasMaxHeight ? ' has-max-height' : '' }`,
		style: {
			'--marquee-gap': `${ gap }px`,
			...( hasMaxHeight && {
				'--marquee-max-height': `${ maxHeight }px`,
			} ),
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="marquee-content">
				<div className="marquee-items">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
