import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { useRef, useEffect } from '@wordpress/element';
import { useResizeObserver } from '@wordpress/compose';
import { adjustFontSize } from './utils';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { content } = attributes;
	const ref = useRef();
	const [ resizeListener, sizes ] = useResizeObserver();

	useEffect( () => {
		adjustFontSize( ref.current, content );
	}, [ content, sizes ] );

	const onChange = ( nextContent ) => {
		setAttributes( { content: nextContent } );
		adjustFontSize( ref.current, nextContent );
	};

	return (
		<>
			{ resizeListener }
			<RichText
				disableLineBreaks
				tagName="pre"
				{ ...useBlockProps() }
				ref={ ref }
				placeholder="Stretchy text goes here"
				preserveWhiteSpace
				value={ content }
				onChange={ onChange }
			/>
		</>
	);
}
