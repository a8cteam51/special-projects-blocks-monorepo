/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {useBlockProps} from '@wordpress/block-editor';

export function CSSVars({attributes}) {
	const colorVars = {
		'--scroll-progress-bar-color': attributes.progressBarColor,
		'--scroll-progress-bar-background-color': attributes.backgroundColor,
	};

	return (
		<style>
			{`.wp-block-a8csp-scroll-progress-bar {${
				Object.keys(colorVars)
					.map((key) => colorVars[key] && `${key}:${colorVars[key]}`)
					.filter(Boolean)
					.join(';')
			}}`}
		</style>
	)
}

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({attributes}) {
	const blockProps = useBlockProps.save();


	return (
		<div {...blockProps}>
			<CSSVars attributes={attributes} />
			<progress></progress>
		</div>
	);
}
