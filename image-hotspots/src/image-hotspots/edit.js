/**
 * WordPress dependencies
 */
import { speak } from '@wordpress/a11y';
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	SelectControl,
	TextareaControl,
	ToggleControl,
	RadioControl,
	ToolbarButton,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { mapMarker, seen, unseen } from '@wordpress/icons';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import { roundPercentage } from '../shared/placement';
import { getCardTemplate } from '../shared/template';
import './editor.scss';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * The name of the modifier that adds a hotspot on click.
 *
 * @return {string} "Option" on Apple systems, "Alt" elsewhere.
 */
const modifierName = () =>
	isAppleOS()
		? /* translators: The Option key on Apple keyboards. */ __(
				'Option',
				'image-hotspots'
			)
		: /* translators: The Alt key. */ __( 'Alt', 'image-hotspots' );

/**
 * The editor for the Image Hotspots block.
 *
 * @param {Object}                       props
 * @param {Object}                       props.attributes    Block attributes.
 * @param {(attributes: Object) => void} props.setAttributes Updates attributes.
 * @param {string}                       props.clientId      The block's client ID.
 * @param {boolean}                      props.isSelected    Whether the block is selected.
 * @return {Element} The editor.
 */
export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	isSelected,
} ) {
	const { id, url, alt, sizeSlug, openOn } = attributes;
	const [ isAdding, setIsAdding ] = useState( false );
	const [ showAllCards, setShowAllCards ] = useState( false );
	const imageRef = useRef();

	const { hotspots, imageSizes, media } = useSelect(
		( select ) => {
			const { getBlocks, getSettings } = select( blockEditorStore );
			return {
				hotspots: getBlocks( clientId ),
				imageSizes: getSettings().imageSizes,
				media: id
					? select( coreStore ).getEntityRecord(
							'postType',
							'attachment',
							id,
							{ context: 'view' }
						)
					: undefined,
			};
		},
		[ clientId, id ]
	);
	const { insertBlock, selectBlock } = useDispatch( blockEditorStore );

	const blockProps = useBlockProps( {
		className: [
			isAdding && 'is-adding-hotspot',
			showAllCards && 'is-showing-all-cards',
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-a8csp-image-hotspots__markers' },
		{
			allowedBlocks: [ 'a8csp/image-hotspot' ],
			renderAppender: false,
		}
	);

	// Leave "add" mode on Escape, and when the block is deselected.
	useEffect( () => {
		if ( ! isAdding ) {
			return undefined;
		}
		const onKeyDown = ( event ) => {
			if ( 'Escape' === event.key ) {
				setIsAdding( false );
				speak( __( 'Adding a hotspot canceled.', 'image-hotspots' ) );
			}
		};
		const documents = new Set(
			[ document, imageRef.current?.ownerDocument ].filter( Boolean )
		);
		documents.forEach( ( doc ) =>
			doc.addEventListener( 'keydown', onKeyDown, true )
		);
		return () =>
			documents.forEach( ( doc ) =>
				doc.removeEventListener( 'keydown', onKeyDown, true )
			);
	}, [ isAdding ] );

	useEffect( () => {
		if ( ! isSelected ) {
			setIsAdding( false );
		}
	}, [ isSelected ] );

	/**
	 * Adds a hotspot at a point, selects it, and leaves its label field
	 * focused (the editor focuses a new block's first text field).
	 *
	 * @param {number} x Percent of the image's width, from the left.
	 * @param {number} y Percent of the image's height, from the top.
	 */
	const addHotspot = ( x, y ) => {
		const number = hotspots.length + 1;
		const position = { x: roundPercentage( x ), y: roundPercentage( y ) };
		const block = createBlock(
			'a8csp/image-hotspot',
			{
				...position,
				label: sprintf(
					/* translators: %d: The hotspot's number. */
					__( 'Hotspot %d', 'image-hotspots' ),
					number
				),
			},
			createBlocksFromInnerBlocksTemplate( getCardTemplate() )
		);
		insertBlock( block, hotspots.length, clientId, true );
		setIsAdding( false );
		speak(
			sprintf(
				/* translators: 1: The hotspot's number. 2: Percent across the image. 3: Percent down the image. */
				__(
					'Hotspot %1$d added, %2$s%% across and %3$s%% down. Type its label.',
					'image-hotspots'
				),
				number,
				position.x,
				position.y
			)
		);
	};

	const onSelectImage = ( image ) => {
		if ( ! image?.url ) {
			setAttributes( { id: undefined, url: undefined, alt: '' } );
			return;
		}
		const sizeUrl =
			image.sizes?.[ sizeSlug ]?.url ||
			image.media_details?.sizes?.[ sizeSlug ]?.source_url;
		setAttributes( {
			id: image.id,
			url: sizeUrl || image.url,
			alt: image.alt || '',
			sizeSlug: sizeUrl ? sizeSlug : 'full',
		} );
	};

	const onSelectURL = ( newURL ) => {
		if ( newURL && newURL !== url ) {
			setAttributes( {
				id: undefined,
				url: newURL,
				alt: '',
				sizeSlug: 'full',
			} );
		}
	};

	const sizeOptions = ( imageSizes || [] )
		.filter(
			( { slug } ) => media?.media_details?.sizes?.[ slug ]?.source_url
		)
		.map( ( { name, slug } ) => ( { value: slug, label: name } ) );

	const onChangeSize = ( newSlug ) => {
		const newUrl = media?.media_details?.sizes?.[ newSlug ]?.source_url;
		if ( newUrl ) {
			setAttributes( { url: newUrl, sizeSlug: newSlug } );
		}
	};

	/**
	 * The toolbar's "Add hotspot": a pointer click arms the next click on the
	 * image; Enter or Space (no pointer to aim) adds one at the center.
	 *
	 * @param {MouseEvent} event The click.
	 */
	const onAddButton = ( event ) => {
		if ( 0 === event?.detail ) {
			addHotspot( 50, 50 );
			return;
		}
		const next = ! isAdding;
		setIsAdding( next );
		if ( next ) {
			speak(
				__(
					'Click the image where the hotspot goes. Press Escape to cancel.',
					'image-hotspots'
				)
			);
		}
	};

	/**
	 * Adds a hotspot where the image is clicked, in "add" mode or with the
	 * modifier key held. Clicks on hotspots and cards are theirs.
	 *
	 * @param {MouseEvent} event The click.
	 */
	const onCanvasClick = ( event ) => {
		if ( event.target.closest?.( '.wp-block-a8csp-image-hotspot' ) ) {
			return;
		}
		const withModifier =
			event.altKey || ( isAppleOS() ? event.metaKey : event.ctrlKey );
		if ( ( ! isAdding && ! withModifier ) || ! imageRef.current ) {
			return;
		}
		const rect = imageRef.current.getBoundingClientRect();
		if ( ! rect.width || ! rect.height ) {
			return;
		}
		event.preventDefault();
		addHotspot(
			( ( event.clientX - rect.left ) / rect.width ) * 100,
			( ( event.clientY - rect.top ) / rect.height ) * 100
		);
	};

	const toolbar = (
		<>
			<BlockControls group="block">
				<ToolbarButton
					icon={ mapMarker }
					isPressed={ isAdding }
					onClick={ onAddButton }
					label={ sprintf(
						/* translators: %s: A modifier key, such as Alt. */
						__(
							'Add hotspot: click the image where it goes (or %s-click the image at any time)',
							'image-hotspots'
						),
						modifierName()
					) }
				>
					{ __( 'Add hotspot', 'image-hotspots' ) }
				</ToolbarButton>
				<ToolbarButton
					icon={ showAllCards ? unseen : seen }
					isPressed={ showAllCards }
					onClick={ () => setShowAllCards( ! showAllCards ) }
					label={
						showAllCards
							? __(
									'Show only the selected hotspot’s card',
									'image-hotspots'
								)
							: __( 'Show all cards', 'image-hotspots' )
					}
				/>
			</BlockControls>
			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={ id }
					mediaURL={ url }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					accept="image/*"
					onSelect={ onSelectImage }
					onSelectURL={ onSelectURL }
					name={ __( 'Replace', 'image-hotspots' ) }
				/>
			</BlockControls>
		</>
	);

	const inspector = (
		<InspectorControls>
			<PanelBody title={ __( 'Hotspots', 'image-hotspots' ) }>
				<RadioControl
					label={ __( 'Open cards on', 'image-hotspots' ) }
					selected={ openOn }
					options={ [
						{
							value: 'click',
							label: __( 'Click or tap', 'image-hotspots' ),
						},
						{
							value: 'hover',
							label: __(
								'Hover, as well as click or tap',
								'image-hotspots'
							),
						},
					] }
					onChange={ ( value ) => setAttributes( { openOn: value } ) }
					help={
						'hover' === openOn
							? __(
									'A card opens when a mouse rests on its marker and closes shortly after the mouse leaves. Click, tap and the keyboard still open and close it.',
									'image-hotspots'
								)
							: __(
									'A card opens and closes when its marker is clicked or tapped, or activated with Enter or Space.',
									'image-hotspots'
								)
					}
				/>
				<div className="wp-block-a8csp-image-hotspots__inspector-gap" />
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __(
						'Show all cards in the editor',
						'image-hotspots'
					) }
					checked={ showAllCards }
					onChange={ setShowAllCards }
					help={ __(
						'While you edit, only the selected hotspot’s card shows, so the image stays readable. This overview does not change the page.',
						'image-hotspots'
					) }
				/>
				<div className="wp-block-a8csp-image-hotspots__inspector-gap" />
				<Button
					__next40pxDefaultSize
					variant="secondary"
					icon={ mapMarker }
					onClick={ () => addHotspot( 50, 50 ) }
				>
					{ __( 'Add hotspot at the center', 'image-hotspots' ) }
				</Button>
				<p className="components-base-control__help">
					{ sprintf(
						/* translators: %s: A modifier key, such as Alt. */
						__(
							'Or choose Add hotspot in the toolbar and click the image, or %s-click the image. Drag a hotspot to move it, or select it and use the arrow keys (Shift for bigger steps).',
							'image-hotspots'
						),
						modifierName()
					) }
				</p>
				{ hotspots.length > 0 && (
					<>
						<h3 className="wp-block-a8csp-image-hotspots__inspector-heading">
							{ __( 'Keyboard order', 'image-hotspots' ) }
						</h3>
						<ol className="wp-block-a8csp-image-hotspots__hotspot-list">
							{ hotspots.map( ( hotspot ) => (
								<li key={ hotspot.clientId }>
									<Button
										variant="link"
										onClick={ () =>
											selectBlock( hotspot.clientId )
										}
									>
										{ hotspot.attributes.label ||
											__(
												'(no label)',
												'image-hotspots'
											) }
									</Button>
								</li>
							) ) }
						</ol>
						<p className="components-base-control__help">
							{ __(
								'Visitors reach the hotspots with the Tab key in this order, which is their order in List View, not their place on the image. Drag them in List View to change it.',
								'image-hotspots'
							) }
						</p>
					</>
				) }
			</PanelBody>
			<PanelBody title={ __( 'Image', 'image-hotspots' ) }>
				<TextareaControl
					__nextHasNoMarginBottom
					label={ __( 'Alternative text', 'image-hotspots' ) }
					value={ alt }
					onChange={ ( value ) => setAttributes( { alt: value } ) }
					help={ __(
						'Describe the image for people who cannot see it. The hotspots are announced separately, by their labels.',
						'image-hotspots'
					) }
				/>
				{ sizeOptions.length > 0 && (
					<>
						<div className="wp-block-a8csp-image-hotspots__inspector-gap" />
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Resolution', 'image-hotspots' ) }
							value={ sizeSlug }
							options={ sizeOptions }
							onChange={ onChangeSize }
							help={ __(
								'Which size of the image file to load. The image always fills the block’s width.',
								'image-hotspots'
							) }
						/>
					</>
				) }
			</PanelBody>
		</InspectorControls>
	);

	if ( ! url ) {
		return (
			<div { ...blockProps }>
				<MediaPlaceholder
					icon={ <BlockIcon icon={ mapMarker } /> }
					labels={ {
						title: __( 'Image Hotspots', 'image-hotspots' ),
						instructions: __(
							'Choose an image. Then click it to add hotspots, drag them into place, and give each one a card.',
							'image-hotspots'
						),
					} }
					onSelect={ onSelectImage }
					onSelectURL={ onSelectURL }
					accept="image/*"
					allowedTypes={ ALLOWED_MEDIA_TYPES }
				/>
			</div>
		);
	}

	let hint = null;
	if ( isAdding ) {
		hint = __(
			'Click the image where the hotspot goes. Escape cancels.',
			'image-hotspots'
		);
	} else if ( isSelected && 0 === hotspots.length ) {
		hint = sprintf(
			/* translators: %s: A modifier key, such as Alt. */
			__(
				'To add a hotspot, choose Add hotspot in the toolbar, or %s-click the image.',
				'image-hotspots'
			),
			modifierName()
		);
	}

	return (
		<>
			{ toolbar }
			{ inspector }
			<div { ...blockProps }>
				{ /* The keyboard adds hotspots with the toolbar or the sidebar; a click on the image picks the point. */ }
				{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */ }
				<div
					className="wp-block-a8csp-image-hotspots__canvas"
					onClick={ onCanvasClick }
				>
					<img
						ref={ imageRef }
						className="wp-block-a8csp-image-hotspots__image"
						src={ url }
						alt={ alt }
						draggable="false"
					/>
					<div { ...innerBlocksProps } />
					{ hint && (
						<p className="wp-block-a8csp-image-hotspots__hint">
							{ hint }
						</p>
					) }
				</div>
			</div>
		</>
	);
}
