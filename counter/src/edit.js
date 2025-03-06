import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { PanelBody, BaseControl, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	// The block attributes
	const [pre, setPre] = useState(attributes.pre);
	const [post, setPost] = useState(attributes.post);
	const [start, setStart] = useState(attributes.start);
	const [end, setEnd] = useState(attributes.end);
	const [duration, setDuration] = useState(attributes.duration);

	useEffect(() => {
		setAttributes({
			pre,
			post,
			start,
			end,
			duration,
		});
	}, [pre, post, start, end, duration, setAttributes]);

	// Get block props
	const blockProps = useBlockProps();


	return (
		<div>
			{ /* Sidebar Settings */}
			<InspectorControls>
				<PanelBody title={__('Counter', 'counter')}>
					<BaseControl
						label={__('Pre Counter', 'counter')}
						id="counter-pre"
						help={__('Text to display before the counter.', 'counter')}
						__nextHasNoMarginBottom={true}
					>
						<RichText
							id="counter-pre"
							value={pre}
							onChange={(pre) => setPre(pre)}
							placeholder={__('eg. Miles traveled ', 'counter')}
							preserveWhiteSpace={true}
							tagName="span"
						/>
					</BaseControl>
					<BaseControl
						label={__('Post Counter', 'counter')}
						id="counter-post"
						help={__('Text to display after the counter.', 'counter')}
						__nextHasNoMarginBottom={true}
					>
						<RichText
							id="counter-post"
							value={post}
							onChange={(post) => setPost(post)}
							placeholder={__('eg. % or years', 'counter')}
							preserveWhiteSpace={true}
							tagName="span"
						/>
					</BaseControl>
					<BaseControl
						label={__('Start Value', 'counter')}
						id="counter-start"
						help={__('The starting value of the counter.', 'counter')}
					>
						<TextControl
							id="counter-start"
							value={start}
							onChange={(start) => setStart(start)}
							type="number"
							__nextHasNoMarginBottom={true}
						/>
					</BaseControl>
					<BaseControl
						label={__('End Value', 'counter')}
						id="counter-end"
						help={__('The ending value of the counter.', 'counter')}
						__nextHasNoMarginBottom={true}
					>
						<TextControl
							id="counter-end"
							value={end}
							onChange={(end) => setEnd(end)}
							type="number"
						/>
					</BaseControl>
					<BaseControl
						label={__('Duration', 'counter')}
						id="counter-duration"
						help={__('The duration of the counter in seconds.', 'counter')}
						__nextHasNoMarginBottom={true}
					>
						<TextControl
							id="counter-duration"
							value={duration}
							onChange={(duration) => setDuration(duration)}
							type="number"
							__nextHasNoMarginBottom={true}
						/>
					</BaseControl>
				</PanelBody>
			</InspectorControls>

			{ /* Block Markup */}
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
			</div>
		</div>
	);
}
