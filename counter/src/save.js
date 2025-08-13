import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { pre, post, start, end, duration } = attributes;

	// Get block props (but don't apply styles to div)
	const blockProps = useBlockProps.save();

	return (
		<p { ...blockProps }>
			{ pre && (
				<span
					className="counter__pre"
					dangerouslySetInnerHTML={ { __html: pre } }
				/>
			) }
			<span
				className="counter__number"
				data-start={ start }
				data-end={ end }
				data-duration={ duration }
			>
				{ start }
			</span>
			{ post && (
				<span
					className="counter__post"
					dangerouslySetInnerHTML={ { __html: post } }
				/>
			) }
		</p>
	);
}
