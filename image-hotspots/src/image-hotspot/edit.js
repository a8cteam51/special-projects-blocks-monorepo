/**
 * WordPress dependencies
 */
import { speak } from '@wordpress/a11y';
import {
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RadioControl,
	RangeControl,
	SelectControl,
	TextControl,
	VisuallyHidden,
} from '@wordpress/components';
import {
	useDebounce,
	useInstanceId,
	useMergeRefs,
	useRefEffect,
} from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	measureHotspot,
	placeCard,
	resetCard,
	roundPercentage,
} from '../shared/placement';
import './editor.scss';

const ARROW_STEPS = {
	ArrowLeft: [ -1, 0 ],
	ArrowRight: [ 1, 0 ],
	ArrowUp: [ 0, -1 ],
	ArrowDown: [ 0, 1 ],
};

/**
 * Places a hotspot's card the way the front end does, then fits the block's
 * wrapper around the marker and the visible card. The editor's block toolbar
 * sits above the wrapper, so it then sits above the card instead of on it.
 *
 * The marker stays on its point: the wrapper's offset from the point is
 * handed to it, and to the card, as `--a8csp-image-hotspots-editor-origin-*`.
 *
 * @param {HTMLElement} card The hotspot's card element.
 */
function layoutHotspot( card ) {
	const item = card?.parentElement;
	const marker = item?.querySelector(
		':scope > .wp-block-a8csp-image-hotspots__marker'
	);
	const canvas = item?.closest( '.wp-block-a8csp-image-hotspots__canvas' );
	if ( ! item || ! marker || ! canvas ) {
		return;
	}

	const isVisible = !! card.offsetParent;
	if ( isVisible ) {
		placeCard( card );
	} else {
		resetCard( card );
	}

	const { toBox, point } = measureHotspot( item, canvas );
	const markerBox = toBox( marker.getBoundingClientRect() );
	const cardBox = isVisible ? toBox( card.getBoundingClientRect() ) : null;
	const boxes = [
		markerBox,
		{ left: point.x, top: point.y, right: point.x, bottom: point.y },
		...( cardBox ? [ cardBox ] : [] ),
	];
	const union = {
		left: Math.round( Math.min( ...boxes.map( ( box ) => box.left ) ) ),
		top: Math.round( Math.min( ...boxes.map( ( box ) => box.top ) ) ),
		right: Math.round( Math.max( ...boxes.map( ( box ) => box.right ) ) ),
		bottom: Math.round( Math.max( ...boxes.map( ( box ) => box.bottom ) ) ),
	};
	const originX = Math.round( point.x ) - union.left;
	const originY = Math.round( point.y ) - union.top;

	item.style.marginLeft = `${ -originX }px`;
	item.style.marginTop = `${ -originY }px`;
	item.style.width = `${ union.right - union.left }px`;
	item.style.height = `${ union.bottom - union.top }px`;
	item.style.setProperty(
		'--a8csp-image-hotspots-editor-origin-x',
		`${ originX }px`
	);
	item.style.setProperty(
		'--a8csp-image-hotspots-editor-origin-y',
		`${ originY }px`
	);
	if ( cardBox ) {
		card.style.left = `${ Math.round( cardBox.left ) - union.left }px`;
		card.style.top = `${ Math.round( cardBox.top ) - union.top }px`;
	}
}

const formatPosition = ( { x, y } ) =>
	sprintf(
		/* translators: 1: Percent across the image. 2: Percent down the image. */
		__( 'X %1$s%%, Y %2$s%%', 'image-hotspots' ),
		Number( x ).toFixed( 1 ),
		Number( y ).toFixed( 1 )
	);

/**
 * The editor for one Hotspot: its marker, which can be dragged and nudged,
 * and its card, shown in place while the hotspot (or a block in its card)
 * is selected.
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
	const { x, y, label, anchorPoint, cardPosition } = attributes;
	const [ drag, setDrag ] = useState( null );
	const [ isNudging, setIsNudging ] = useState( false );
	const markerRef = useRef();
	const cardRef = useRef();
	const dragRef = useRef( null );
	const nudgeTimer = useRef();
	const latest = useRef( {} );
	latest.current = { x, y, setAttributes };
	const instructionsId = useInstanceId(
		Edit,
		'a8csp-image-hotspot-instructions'
	);

	const { index, count, hasSelectedInner } = useSelect(
		( select ) => {
			const {
				getBlockIndex,
				getBlockCount,
				getBlockRootClientId,
				hasSelectedInnerBlock,
			} = select( blockEditorStore );
			return {
				index: getBlockIndex( clientId ),
				count: getBlockCount( getBlockRootClientId( clientId ) ),
				hasSelectedInner: hasSelectedInnerBlock( clientId, true ),
			};
		},
		[ clientId ]
	);
	const { selectBlock, __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );

	const number = index + 1;
	const isCardVisible = isSelected || hasSelectedInner;
	const position = drag || { x, y };

	const announce = useDebounce(
		( next ) => speak( formatPosition( next ) ),
		500
	);
	useEffect( () => () => announce.cancel(), [ announce ] );
	useEffect( () => () => clearTimeout( nudgeTimer.current ), [] );

	// Arrow keys move the marker while the marker button has focus. Native
	// listener: it runs before the editor's own arrow-key navigation.
	const markerKeyboardRef = useRefEffect( ( node ) => {
		const onKeyDown = ( event ) => {
			if ( 'Escape' === event.key && dragRef.current ) {
				event.preventDefault();
				event.stopPropagation();
				dragRef.current = null;
				setDrag( null );
				return;
			}
			const direction = ARROW_STEPS[ event.key ];
			if (
				! direction ||
				event.altKey ||
				event.metaKey ||
				event.ctrlKey ||
				dragRef.current
			) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			const step = event.shiftKey ? 5 : 0.5;
			const current = latest.current;
			const next = {
				x: roundPercentage( current.x + direction[ 0 ] * step ),
				y: roundPercentage( current.y + direction[ 1 ] * step ),
			};
			// Repeated keys may come before the next render.
			current.x = next.x;
			current.y = next.y;
			current.setAttributes( next );
			announce( next );
			setIsNudging( true );
			clearTimeout( nudgeTimer.current );
			nudgeTimer.current = setTimeout(
				() => setIsNudging( false ),
				1200
			);
		};
		node.addEventListener( 'keydown', onKeyDown );
		return () => node.removeEventListener( 'keydown', onKeyDown );
	}, [] );

	const getCanvas = () =>
		markerRef.current?.closest( '.wp-block-a8csp-image-hotspots__canvas' );

	const onPointerDown = ( event ) => {
		if ( 0 !== event.button || ! event.isPrimary ) {
			return;
		}
		const canvas = getCanvas();
		if ( ! canvas ) {
			return;
		}
		const rect = canvas.getBoundingClientRect();
		dragRef.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			// Keep the pointer where it grabbed the marker, so it does not jump.
			offsetX: event.clientX - ( rect.left + ( x / 100 ) * rect.width ),
			offsetY: event.clientY - ( rect.top + ( y / 100 ) * rect.height ),
			moved: false,
			position: null,
		};
		try {
			// Keep receiving moves when the pointer leaves the marker.
			event.currentTarget.setPointerCapture( event.pointerId );
		} catch {
			// A pointer that is no longer active cannot be captured.
		}
		// No text selection, native image drag or editor drag-selection.
		event.preventDefault();
		event.currentTarget.focus( { preventScroll: true } );
		if ( ! isSelected ) {
			// Select without moving focus to the label field.
			selectBlock( clientId, null );
		}
	};

	const onPointerMove = ( event ) => {
		const current = dragRef.current;
		if ( ! current || current.pointerId !== event.pointerId ) {
			return;
		}
		if (
			! current.moved &&
			Math.hypot(
				event.clientX - current.startX,
				event.clientY - current.startY
			) < 4
		) {
			return;
		}
		const canvas = getCanvas();
		const rect = canvas?.getBoundingClientRect();
		if ( ! rect?.width || ! rect?.height ) {
			return;
		}
		current.moved = true;
		current.position = {
			x: roundPercentage(
				( ( event.clientX - current.offsetX - rect.left ) /
					rect.width ) *
					100
			),
			y: roundPercentage(
				( ( event.clientY - current.offsetY - rect.top ) /
					rect.height ) *
					100
			),
		};
		setDrag( current.position );
	};

	const endDrag = ( event, commit ) => {
		const current = dragRef.current;
		if ( ! current || current.pointerId !== event.pointerId ) {
			return;
		}
		dragRef.current = null;
		if ( event.currentTarget.hasPointerCapture?.( event.pointerId ) ) {
			event.currentTarget.releasePointerCapture( event.pointerId );
		}
		if ( commit && current.moved && current.position ) {
			setAttributes( current.position );
			speak(
				sprintf(
					/* translators: %s: The new position, such as "X 12.5%, Y 40.0%". */
					__( 'Hotspot moved to %s.', 'image-hotspots' ),
					formatPosition( current.position )
				)
			);
		}
		setDrag( null );
	};

	// Place the card next to the marker, the way the front end will.
	useLayoutEffect( () => {
		layoutHotspot( cardRef.current );
	} );

	// Again when the card or the image changes size.
	useEffect( () => {
		const card = cardRef.current;
		const view = card?.ownerDocument?.defaultView;
		if ( ! card || ! view?.ResizeObserver ) {
			return undefined;
		}
		let frame = 0;
		const observer = new view.ResizeObserver( () => {
			view.cancelAnimationFrame( frame );
			frame = view.requestAnimationFrame( () => layoutHotspot( card ) );
		} );
		observer.observe( card );
		const canvas = card.closest( '.wp-block-a8csp-image-hotspots__canvas' );
		if ( canvas ) {
			observer.observe( canvas );
		}
		return () => {
			view.cancelAnimationFrame( frame );
			observer.disconnect();
			resetCard( card );
		};
	}, [] );

	// A new hotspot needs a label: one inserted without one (from the
	// block toolbar's sibling inserter, say) gets "Hotspot N" to edit. Only
	// for a hotspot that is selected as it mounts, which is how the editor
	// inserts blocks, so that opening saved content never changes it.
	useEffect( () => {
		if ( isSelected && ! label.trim() ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( {
				label: sprintf(
					/* translators: %d: The hotspot's number. */
					__( 'Hotspot %d', 'image-hotspots' ),
					number
				),
			} );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	// A hotspot added while selected (by a click on the image, or from the
	// sidebar) gets its label field focused and selected, ready to type.
	useEffect( () => {
		if ( ! isSelected ) {
			return undefined;
		}
		const card = cardRef.current;
		const view = card?.ownerDocument?.defaultView;
		if ( ! view ) {
			return undefined;
		}
		const frame = view.requestAnimationFrame( () => {
			const input = card.querySelector(
				'.wp-block-a8csp-image-hotspots__card-label input'
			);
			if ( input ) {
				input.focus( { preventScroll: true } );
				input.select();
			}
		} );
		return () => view.cancelAnimationFrame( frame );
		// Only on mount: later selections keep focus where the editor puts it.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const blockProps = useBlockProps( {
		className: [
			`is-anchor-${ 'bottom' === anchorPoint ? 'bottom' : 'center' }`,
			isCardVisible && 'is-card-visible',
			drag && 'is-moving',
		]
			.filter( Boolean )
			.join( ' ' ),
		style: {
			'--a8csp-image-hotspots-x': `${ position.x }%`,
			'--a8csp-image-hotspots-y': `${ position.y }%`,
		},
		'data-card-position': cardPosition,
	} );

	const innerBlocksProps = useInnerBlocksProps( {
		className: 'wp-block-a8csp-image-hotspots__card-content',
	} );

	const markerRefs = useMergeRefs( [ markerRef, markerKeyboardRef ] );

	const markerName = sprintf(
		/* translators: 1: The hotspot's number. 2: Its label. */
		__( 'Hotspot %1$d: %2$s', 'image-hotspots' ),
		number,
		label || __( 'no label', 'image-hotspots' )
	);

	const setPosition = ( axis, value ) => {
		const parsed = parseFloat( value );
		if ( Number.isFinite( parsed ) ) {
			setAttributes( { [ axis ]: roundPercentage( parsed ) } );
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ sprintf(
						/* translators: %d: The hotspot's number. */
						__( 'Hotspot %d', 'image-hotspots' ),
						number
					) }
				>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Label', 'image-hotspots' ) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						help={ __(
							'Required. Screen readers announce the marker by this name, and List View lists it by this name. Keep it short and specific, such as a place.',
							'image-hotspots'
						) }
					/>
					<div className="wp-block-a8csp-image-hotspot__inspector-gap" />
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __(
							'X: across, from the left (%)',
							'image-hotspots'
						) }
						value={ x }
						min={ 0 }
						max={ 100 }
						step={ 0.1 }
						onChange={ ( value ) => setPosition( 'x', value ) }
					/>
					<div className="wp-block-a8csp-image-hotspot__inspector-gap" />
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __(
							'Y: down, from the top (%)',
							'image-hotspots'
						) }
						value={ y }
						min={ 0 }
						max={ 100 }
						step={ 0.1 }
						onChange={ ( value ) => setPosition( 'y', value ) }
					/>
					<p className="components-base-control__help">
						{ __(
							'Where the marker’s point is on the image, to 0.1%. You can also drag the marker, or focus it and use the arrow keys (0.5% a step, 5% with Shift).',
							'image-hotspots'
						) }
					</p>
					<RadioControl
						label={ __( 'Marker point', 'image-hotspots' ) }
						selected={ anchorPoint }
						options={ [
							{
								value: 'center',
								label: __( 'Center', 'image-hotspots' ),
							},
							{
								value: 'bottom',
								label: __(
									'Bottom tip (pin)',
									'image-hotspots'
								),
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { anchorPoint: value } )
						}
						help={ __(
							'Which point of the marker sits on X and Y: its center, or the tip at its bottom, as for a pin.',
							'image-hotspots'
						) }
					/>
					<div className="wp-block-a8csp-image-hotspot__inspector-gap" />
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Card position', 'image-hotspots' ) }
						value={ cardPosition }
						options={ [
							{
								value: 'auto',
								label: __(
									'Auto: the side with room',
									'image-hotspots'
								),
							},
							{
								value: 'above',
								label: __( 'Above', 'image-hotspots' ),
							},
							{
								value: 'below',
								label: __( 'Below', 'image-hotspots' ),
							},
							{
								value: 'left',
								label: __( 'Left', 'image-hotspots' ),
							},
							{
								value: 'right',
								label: __( 'Right', 'image-hotspots' ),
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { cardPosition: value } )
						}
						help={ __(
							'The card stays inside the image: a chosen side flips to the opposite side when the card does not fit there. On narrow screens, a card that fits on no side shows below the image.',
							'image-hotspots'
						) }
					/>
					<p className="components-base-control__help">
						{ sprintf(
							/* translators: 1: The hotspot's number. 2: How many hotspots the image has. */
							__(
								'Keyboard order: %1$d of %2$d. Visitors reach the hotspots with the Tab key in their List View order, not by their place on the image. Drag them in List View to change it.',
								'image-hotspots'
							),
							number,
							count
						) }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<button
					type="button"
					ref={ markerRefs }
					className="wp-block-a8csp-image-hotspots__marker"
					aria-label={ markerName }
					aria-describedby={ instructionsId }
					onPointerDown={ onPointerDown }
					onPointerMove={ onPointerMove }
					onPointerUp={ ( event ) => endDrag( event, true ) }
					onPointerCancel={ ( event ) => endDrag( event, false ) }
				>
					<span
						className="wp-block-a8csp-image-hotspots__marker-icon"
						aria-hidden="true"
					/>
					<span
						className="wp-block-a8csp-image-hotspot__number"
						aria-hidden="true"
					>
						{ number }
					</span>
				</button>
				<VisuallyHidden id={ instructionsId }>
					{ __(
						'Drag to move it, or use the arrow keys: 0.5% a step, 5% with Shift.',
						'image-hotspots'
					) }
				</VisuallyHidden>
				{ ( drag || isNudging ) && (
					<span
						className="wp-block-a8csp-image-hotspot__position"
						aria-hidden="true"
					>
						{ formatPosition( position ) }
					</span>
				) }
				<div
					ref={ cardRef }
					className="wp-block-a8csp-image-hotspots__card"
					hidden={ ! isCardVisible }
				>
					<div className="wp-block-a8csp-image-hotspots__card-label">
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ sprintf(
								/* translators: %d: The hotspot's number. */
								__(
									'Hotspot %d label, for screen readers',
									'image-hotspots'
								),
								number
							) }
							value={ label }
							onChange={ ( value ) =>
								setAttributes( { label: value } )
							}
						/>
						{ ! label.trim() && (
							<p className="wp-block-a8csp-image-hotspot__warning">
								{ __(
									'Add a label: without one, screen readers announce only “Hotspot”.',
									'image-hotspots'
								) }
							</p>
						) }
					</div>
					<div { ...innerBlocksProps } />
				</div>
			</div>
		</>
	);
}
