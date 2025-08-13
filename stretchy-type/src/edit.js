import { RichText, useBlockProps } from '@wordpress/block-editor';
import { useRef, useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { content, viewBox } = attributes;
	const blockProps = useBlockProps( viewBox ? { viewBox } : {} );
	const wrapperRef = useRef();
	const richTextRef = useRef();

	useEffect( () => {
		const observer = new window.ResizeObserver( () => {
			const { offsetWidth, offsetHeight } = wrapperRef.current;
			setAttributes( {
				viewBox: `0 0 ${ offsetWidth } ${ offsetHeight }`,
			} );
			// This hack is required to prevent RichText to overwrite `white-space`.
			if ( richTextRef.current ) {
				richTextRef.current.style.whiteSpace = 'nowrap';
			}
		} );
		observer.observe( wrapperRef.current );

		return () => {
			observer.disconnect();
		};
	}, [] );

	const onChange = ( nextContent ) => {
		setAttributes( { content: nextContent } );
	};

	return (
		<svg { ...blockProps }>
			<foreignObject x="0" y="0" width="100%" height="100%">
				<span ref={ wrapperRef }>
					<RichText
						disableLineBreaks
						tagName="span"
						identifier="content"
						placeholder="Stretchy text goes here"
						preserveWhiteSpace
						value={ content }
						onChange={ onChange }
						ref={ richTextRef }
					/>
				</span>
			</foreignObject>
		</svg>
	);
}
