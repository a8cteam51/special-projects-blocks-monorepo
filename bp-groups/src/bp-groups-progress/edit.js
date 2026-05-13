/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object} props Props passed from the editor.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { showProgressText, progressText } = attributes;
	return (
		<>
			<div { ...useBlockProps() }>
				{ showProgressText && (
					<>
						<RichText
							tagName="span"
							identifier="content"
							allowedFormats={ [] }
							value={ progressText }
							onChange={ ( value ) =>
								setAttributes( { progressText: value } )
							}
						/>{ ' ' }
						50%
					</>
				) }
				<div className="group-progress-bar-background">
					<div
						className="group-progress-bar-fill"
						style={ { width: '50%' } }
					></div>
				</div>
			</div>
		</>
	);
}
