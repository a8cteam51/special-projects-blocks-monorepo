/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useEffect, useRef } from '@wordpress/element';

export default function Edit( {
	attributes,
	setAttributes,
	context,
	isSelected,
} ) {
	// Get the metaKey from the attributes, and the postId from the context.
	const { prefix, suffix, metaKey } = attributes;
	const { postId } = context;

	// Get the metadata for the current press.
	const [ meta ] = useEntityProp( 'postType', 'press', 'meta', postId );

	// Create a ref for the prefix field.
	const prefixRef = useRef( null );
	useEffect( () => {
		if ( prefixRef.current ) {
			const prefixLength = prefix.length || 6;
			prefixRef.current.style.width = `${ prefixLength }ch`;
		}
	}, [ prefix ] );

	// Create a ref for the suffix field.
	const suffixRef = useRef( null );
	useEffect( () => {
		if ( suffixRef.current ) {
			const suffixLength = suffix.length || 6;
			suffixRef.current.style.width = `${ suffixLength }ch`;
		}
	}, [ suffix ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Press fields">
					<RadioControl
						label={ __( 'Pick a field', 'cpt-press' ) }
						selected={ metaKey }
						options={ [
							{
								label: __( 'Press Outlet', 'cpt-press' ),
								value: '_press_outlet',
							},
							{
								label: __( 'Press Author', 'cpt-press' ),
								value: '_press_author',
							},
						] }
						onChange={ ( newMetaKey ) =>
							setAttributes( { metaKey: newMetaKey } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				{ ! isSelected && <span className="prefix">{ prefix }</span> }
				{ isSelected && (
					<input
						type="text"
						value={ prefix }
						onChange={ ( e ) =>
							setAttributes( { prefix: e.target.value } )
						}
						placeholder={ __( 'Prefix', 'cpt-press' ) }
						ref={ prefixRef }
					/>
				) }
				<span className="meta-value">{ meta[ metaKey ] }</span>
				{ ! isSelected && <span className="suffix">{ suffix }</span> }
				{ isSelected && (
					<input
						type="text"
						value={ suffix }
						onChange={ ( e ) =>
							setAttributes( { suffix: e.target.value } )
						}
						placeholder={ __( 'Suffix', 'cpt-press' ) }
						ref={ suffixRef }
					/>
				) }
			</div>
		</>
	);
}
