import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	Button,
	ButtonGroup,
	PanelBody,
	ToggleControl,
	PanelRow,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';

import { useMemo } from '@wordpress/element';

/* Internal dependencies */
import ListItem from './components/list-item';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   props               Props passed to the block, including attributes and setAttributes function.
 * @param {Object}   props.attributes    The current attributes of the block.
 * @param {Function} props.setAttributes Function to update the block's attributes.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { headingLevels, title, customTitles } = attributes;

	const headings = [ 1, 2, 3, 4, 5, 6 ];

	const allBlocks = useSelect( ( select ) => {
		const { getClientIdsWithDescendants, getBlock } =
			select( blockEditorStore );
		return getClientIdsWithDescendants().map( ( clientId ) =>
			getBlock( clientId )
		);
	}, [] );

	const headingBlocks = useMemo( () => {
		const stripHTML = ( html ) => {
			// eslint-disable-next-line no-undef
			const doc = new DOMParser().parseFromString( html, 'text/html' );
			return doc.body.textContent ?? '';
		};

		const getHeadingContent = ( block ) => {
			if ( block.attributes.content.originalHTML ) {
				return stripHTML( block.attributes.content.originalHTML );
			}
			return stripHTML( block.attributes.content );
		};

		return allBlocks
			.filter(
				( block ) =>
					block?.name === 'core/heading' &&
					headingLevels.includes( block.attributes.level )
			)
			.map( ( block ) => {
				// Add plain text content to each heading block
				return {
					...block,
					plainTextContent: getHeadingContent( block ),
				};
			} );
	}, [ allBlocks, headingLevels ] );

	const updateHeadingLevels = ( level ) => {
		const newHeadingLevels = headingLevels.includes( level )
			? headingLevels.filter( ( l ) => l !== level )
			: [ ...headingLevels, level ];
		setAttributes( { headingLevels: newHeadingLevels } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'dynamic-table-of-contents' ) }
				>
					<h3>
						{ __(
							'Headings to include',
							'dynamic-table-of-contents'
						) }
					</h3>
					<PanelRow>
						<ButtonGroup>
							{ headings.map( ( level ) => (
								<Button
									key={ level }
									variant={
										headingLevels.includes( level )
											? 'primary'
											: 'secondary'
									}
									onClick={ () => {
										updateHeadingLevels( level );
									} }
								>
									H{ level }
								</Button>
							) ) }
						</ButtonGroup>
					</PanelRow>
					<h3 style={ { marginTop: '2em' } }>
						{ __( 'Custom Titles', 'dynamic-table-of-contents' ) }
					</h3>
					<PanelRow>
						<ToggleControl
							label={ __(
								'Enable Custom titles',
								'dynamic-table-of-contents'
							) }
							help={
								customTitles
									? __(
											'Custom titles enabled.',
											'dynamic-table-of-contents'
									  )
									: __(
											'Custom titles disabled.',
											'dynamic-table-of-contents'
									  )
							}
							checked={ customTitles }
							onChange={ ( newValue ) => {
								setAttributes( { customTitles: newValue } );
							} }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<RichText
					tagName="h2"
					placeholder={ __(
						'Table of Contents Title',
						'dynamic-table-of-contents'
					) }
					value={ title }
					onChange={ ( newTitle ) =>
						setAttributes( { title: newTitle } )
					}
					className="table-of-contents-title"
				/>
				<ul className="table-of-contents-list">
					{ headingBlocks.length > 0 ? (
						headingBlocks.map( ( block ) => {
							return (
								<ListItem
									key={ block.clientId }
									id={ block.clientId }
									title={
										block.plainTextContent ||
										__(
											'Untitled Heading',
											'dynamic-table-of-contents'
										)
									}
									customTitles={ customTitles }
									customTitle={ block.attributes.customTitle }
								/>
							);
						} )
					) : (
						<li>
							{ __(
								'No headings found. Please add some headings to your content.',
								'dynamic-table-of-contents'
							) }
						</li>
					) }
				</ul>
			</div>
		</>
	);
}
