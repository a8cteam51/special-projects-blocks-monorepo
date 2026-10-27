import {
	RichText,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { useRef, useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { content, viewBox } = attributes;
	const blockProps = useBlockProps( viewBox ? { viewBox } : {} );
	const wrapperRef = useRef();
	const richTextRef = useRef();
	const viewBoxRef = useRef( viewBox );
	viewBoxRef.current = viewBox;
	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );

	useEffect( () => {
		const observer = new window.ResizeObserver( () => {
			const { offsetWidth, offsetHeight } = wrapperRef.current;
			const nextViewBox = `0 0 ${ offsetWidth } ${ offsetHeight }`;
			// Only sync a changed size, and don't record the sync as an edit of its own.
			if ( nextViewBox !== viewBoxRef.current ) {
				viewBoxRef.current = nextViewBox;
				__unstableMarkNextChangeAsNotPersistent();
				setAttributes( { viewBox: nextViewBox } );
			}
			// This hack is required to prevent RichText to overwrite `white-space`.
			if ( richTextRef.current ) {
				richTextRef.current.style.whiteSpace = 'nowrap';
			}
		} );
		observer.observe( wrapperRef.current );

		return () => {
			observer.disconnect();
		};
	}, [ __unstableMarkNextChangeAsNotPersistent, setAttributes ] );

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
