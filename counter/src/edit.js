import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { PanelBody, BaseControl, TextControl } from '@wordpress/components';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	// The block attributes
	const { pre, post, start, end, duration } = attributes;
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
							onChange={(pre) => setAttributes({pre: pre})}
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
							onChange={(post) => setAttributes({post: post})}
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
							onChange={(start) => setAttributes({start: Number(start)})}
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
							onChange={(end) => setAttributes({end: Number(end)})}
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
							onChange={(duration) => setAttributes({duration: Number(duration)})}
							type="number"
							__nextHasNoMarginBottom={true}
						/>
					</BaseControl>
				</PanelBody>
			</InspectorControls>

			{ /* Block Markup */}
			<p {...blockProps}>
				{pre && (<span className="counter__pre" dangerouslySetInnerHTML={{ __html: pre }} />)}
				<span
					className="counter__number"
					data-start={start}
					data-end={end}
					data-duration={duration}
				>
					{start}
				</span>
				{post && (<span className="counter__post" dangerouslySetInnerHTML={{ __html: post }} />)}
			</p>
		</div>
	);
}
