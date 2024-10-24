import { __ } from "@wordpress/i18n";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { useRef, useEffect, useCallback } from "@wordpress/element";
import { useResizeObserver } from "@wordpress/compose";
import { adjustFontSize } from "./utils";

export default function Edit({ attributes, setAttributes }) {
	const { content, dimensions } = attributes;
	const blockProps = useBlockProps(
		dimensions ? { viewBox: `0 0 ${dimensions}` } : {},
	);
	const wrapperRef = useRef();
	const richTextRef = useRef();

	useEffect(() => {
		const observer = new ResizeObserver(() => {
			const { offsetWidth, offsetHeight } = wrapperRef.current;
			setAttributes({ dimensions: `${offsetWidth} ${offsetHeight}` });
			// This hack is required to prevent RichText to overwrite `white-space`.
			richTextRef.current.style.whiteSpace = "nowrap";
		});
		observer.observe(wrapperRef.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	const onChange = (nextContent) => {
		setAttributes({ content: nextContent });

		// const { offsetWidth, offsetHeight } = ref.current;
		// setDimensions(`${offsetWidth} ${offsetHeight}`);
	};

	return (
		<svg
			{...blockProps}
			style={{
				display: "inline-block",
				width: "100%",
				fontFamily: "inherit",
				maxWidth: "none !important",
			}}
		>
			<foreignObject x="0" y="0" width="100%" height="100%">
				<span
					ref={wrapperRef}
					style={{
						fontSize: "1em",
						whiteSpace: "nowrap",
						display: "inline-block",
						width: "fit-content",
						height: "fit-content",
					}}
				>
					<RichText
						disableLineBreaks
						tagName="span"
						identifier="content"
						placeholder="Stretchy text goes here"
						preserveWhiteSpace
						value={content}
						onChange={onChange}
						ref={richTextRef}
					/>
				</span>
			</foreignObject>
		</svg>
	);
}
