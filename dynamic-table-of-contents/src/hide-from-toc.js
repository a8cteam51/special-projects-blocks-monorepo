/**
 * Adds a "Hide from table of contents" toggle to the Heading block.
 *
 * The toggle adds or removes the `hide-from-toc` class in the block's
 * `className` attribute, the same class authors typed into Additional CSS
 * class(es) before 0.5.0. Saved markup is unchanged, so existing headings stay
 * valid and headings that already have the class show the toggle switched on.
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

const HIDE_CLASS = 'hide-from-toc';

/**
 * Split a className attribute into its classes.
 *
 * @param {string|undefined} className The block's className attribute.
 * @return {string[]} The classes, without empty entries.
 */
function getClasses( className ) {
	return ( className || '' ).split( /\s+/ ).filter( Boolean );
}

const withHideFromTocControl = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		if ( 'core/heading' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;
		const classes = getClasses( attributes.className );
		const isHidden = classes.includes( HIDE_CLASS );

		const onChange = ( hide ) => {
			const otherClasses = classes.filter(
				( className ) => HIDE_CLASS !== className
			);
			const nextClasses = hide
				? [ ...otherClasses, HIDE_CLASS ]
				: otherClasses;

			setAttributes( {
				className: nextClasses.length
					? nextClasses.join( ' ' )
					: undefined,
			} );
		};

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __(
							'Table of contents',
							'dynamic-table-of-contents'
						) }
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Hide from table of contents',
								'dynamic-table-of-contents'
							) }
							help={ __(
								'Leave this heading out of the Dynamic Table of Contents block.',
								'dynamic-table-of-contents'
							) }
							checked={ isHidden }
							onChange={ onChange }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	},
	'withHideFromTocControl'
);

addFilter(
	'editor.BlockEdit',
	'wpcomsp/dynamic-table-of-contents/hide-from-toc',
	withHideFromTocControl
);
