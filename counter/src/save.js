import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { pre, post, start, end, duration } = attributes;

	// Get block props (but don't apply styles to div)
	const blockProps = useBlockProps.save();

	return (
		<div {...blockProps}>
			<p>
				<span className='counter__pre'>{pre}</span>
				<span
					className="counter__number"
					data-start={start}
					data-end={end}
					data-duration={duration}
				>
					{start}
				</span>
				<span className="counter__post">{post}</span>
			</p>
        </div >
    );
}
