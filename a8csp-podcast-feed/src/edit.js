import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	Spinner,
	Notice,
	Button,
	Placeholder,
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { rss, list, grid } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';

import './editor.scss';

/**
 * Convert a WordPress spacing value to a CSS value.
 *
 * Handles preset references like "var:preset|spacing|30" and plain values.
 *
 * @param {string} value The spacing value.
 * @return {string} CSS-ready value.
 */
function getGapCssValue( value ) {
	if ( ! value ) {
		return '';
	}
	if ( typeof value === 'string' && value.startsWith( 'var:' ) ) {
		return `var(--wp--${ value.slice( 4 ).replace( /\|/g, '--' ) })`;
	}
	return value;
}

/**
 * Build inline styles for an individual episode element from
 * the block's border and background color attributes.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} React style object for the episode element.
 */
function getEpisodeStyle( attributes ) {
	const style = {};
	const blockStyle = attributes.style || {};

	// Background color from preset or custom.
	if ( attributes.backgroundColor ) {
		style.backgroundColor = `var(--wp--preset--color--${ attributes.backgroundColor })`;
	} else if ( blockStyle?.color?.background ) {
		style.backgroundColor = blockStyle.color.background;
	}

	// Text color from preset or custom.
	if ( attributes.textColor ) {
		style.color = `var(--wp--preset--color--${ attributes.textColor })`;
	} else if ( blockStyle?.color?.text ) {
		style.color = blockStyle.color.text;
	}

	// Border styles.
	const border = blockStyle?.border || {};

	// Border color from preset or custom.
	if ( attributes.borderColor ) {
		style.borderColor = `var(--wp--preset--color--${ attributes.borderColor })`;
	} else if ( border.color ) {
		style.borderColor = border.color;
	}
	if ( border.width ) {
		style.borderWidth = border.width;
	}
	if ( attributes.borderColor || border.color || border.width ) {
		style.borderStyle = border.style || 'solid';
	} else if ( border.style ) {
		style.borderStyle = border.style;
	}
	if ( border.radius ) {
		if ( typeof border.radius === 'object' ) {
			style.borderTopLeftRadius = border.radius.topLeft;
			style.borderTopRightRadius = border.radius.topRight;
			style.borderBottomRightRadius = border.radius.bottomRight;
			style.borderBottomLeftRadius = border.radius.bottomLeft;
		} else {
			style.borderRadius = border.radius;
		}
	}

	// Per-side borders.
	[ 'top', 'right', 'bottom', 'left' ].forEach( ( side ) => {
		if ( border[ side ] ) {
			const sideBorder = border[ side ];
			const Side = side.charAt( 0 ).toUpperCase() + side.slice( 1 );
			if ( sideBorder.color ) {
				style[ `border${ Side }Color` ] = sideBorder.color;
			}
			if ( sideBorder.width ) {
				style[ `border${ Side }Width` ] = sideBorder.width;
			}
			if ( sideBorder.style ) {
				style[ `border${ Side }Style` ] = sideBorder.style;
			}
		}
	} );

	return style;
}

/**
 * Episode component to render a single episode in the editor.
 *
 * @param {Object} props            Component props.
 * @param {Object} props.episode    Episode data.
 * @param {Object} props.attributes Block attributes.
 * @return {Element} Episode component.
 */
function Episode( { episode, attributes } ) {
	const {
		showTitle,
		showCoverArt,
		showPlayer,
		showDescription,
		showDuration,
		showPublishDate,
		showEpisodeNumber,
	} = attributes;

	const formatDate = ( dateString ) => {
		if ( ! dateString ) {
			return '';
		}
		const date = new Date( dateString );
		return date.toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		} );
	};

	const episodeStyle = getEpisodeStyle( attributes );

	return (
		<div className="podcast-feed__episode" style={ episodeStyle }>
			{ showCoverArt && episode.coverArt && (
				<div className="podcast-feed__episode-cover">
					<img src={ episode.coverArt } alt={ episode.title } />
				</div>
			) }
			<div className="podcast-feed__episode-content">
				{ showTitle && episode.title && (
					<h3 className="podcast-feed__episode-title">
						{ episode.title }
					</h3>
				) }
				<div className="podcast-feed__episode-meta">
					{ showEpisodeNumber && episode.episodeNumber && (
						<span className="podcast-feed__episode-number">
							{ __( 'Episode', 'a8csp-podcast-feed' ) }{ ' ' }
							{ episode.episodeNumber }
						</span>
					) }
					{ showPublishDate && episode.pubDate && (
						<span className="podcast-feed__episode-date">
							{ formatDate( episode.pubDate ) }
						</span>
					) }
					{ showDuration && episode.duration && (
						<span className="podcast-feed__episode-duration">
							{ episode.duration }
						</span>
					) }
				</div>
				{ showDescription && episode.description && (
					<div className="podcast-feed__episode-description">
						<div
							className="podcast-feed__episode-description-content"
							dangerouslySetInnerHTML={ {
								__html: episode.description,
							} }
						/>
					</div>
				) }
				{ showPlayer && episode.audioUrl && (
					<div className="podcast-feed__episode-player">
						<audio controls src={ episode.audioUrl }>
							{ __(
								'Your browser does not support the audio element.',
								'a8csp-podcast-feed'
							) }
						</audio>
					</div>
				) }
			</div>
		</div>
	);
}

/**
 * Shared display option controls.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @param {boolean}  props.initialOpen   Whether the panel starts open.
 * @return {Element} Display options panel.
 */
function DisplayOptionsPanel( {
	attributes,
	setAttributes,
	initialOpen = true,
} ) {
	const {
		numberOfEpisodes,
		showTitle,
		showCoverArt,
		showPlayer,
		showDescription,
		showDuration,
		showPublishDate,
		showEpisodeNumber,
	} = attributes;

	return (
		<PanelBody
			title={ __( 'Display Options', 'a8csp-podcast-feed' ) }
			initialOpen={ initialOpen }
		>
			<RangeControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Number of Episodes', 'a8csp-podcast-feed' ) }
				value={ numberOfEpisodes }
				onChange={ ( value ) =>
					setAttributes( { numberOfEpisodes: value } )
				}
				min={ 1 }
				max={ 99 }
			/>
			<TextControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Season', 'a8csp-podcast-feed' ) }
				value={ attributes.season }
				onChange={ ( value ) => setAttributes( { season: value } ) }
				placeholder={ __( 'All seasons', 'a8csp-podcast-feed' ) }
				help={ __(
					'Enter a season number to filter episodes, or leave blank for all seasons.',
					'a8csp-podcast-feed'
				) }
			/>
			<TextControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'No Episodes Message', 'a8csp-podcast-feed' ) }
				value={ attributes.noEpisodesMessage }
				onChange={ ( value ) =>
					setAttributes( { noEpisodesMessage: value } )
				}
				placeholder={ __(
					'e.g. Season 2 is coming soon!',
					'a8csp-podcast-feed'
				) }
				help={ __(
					'Message to display when no episodes match. Leave blank to show nothing.',
					'a8csp-podcast-feed'
				) }
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show Episode Title', 'a8csp-podcast-feed' ) }
				checked={ showTitle }
				onChange={ ( value ) => setAttributes( { showTitle: value } ) }
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show Cover Art', 'a8csp-podcast-feed' ) }
				checked={ showCoverArt }
				onChange={ ( value ) =>
					setAttributes( { showCoverArt: value } )
				}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show Audio Player', 'a8csp-podcast-feed' ) }
				checked={ showPlayer }
				onChange={ ( value ) => setAttributes( { showPlayer: value } ) }
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show Description', 'a8csp-podcast-feed' ) }
				checked={ showDescription }
				onChange={ ( value ) =>
					setAttributes( { showDescription: value } )
				}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show Duration', 'a8csp-podcast-feed' ) }
				checked={ showDuration }
				onChange={ ( value ) =>
					setAttributes( { showDuration: value } )
				}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show Publish Date', 'a8csp-podcast-feed' ) }
				checked={ showPublishDate }
				onChange={ ( value ) =>
					setAttributes( { showPublishDate: value } )
				}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show Episode Number', 'a8csp-podcast-feed' ) }
				checked={ showEpisodeNumber }
				onChange={ ( value ) =>
					setAttributes( { showEpisodeNumber: value } )
				}
			/>
		</PanelBody>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { feedUrl, numberOfEpisodes, layoutType, columns, season } =
		attributes;

	const [ isLoading, setIsLoading ] = useState( false );
	const [ isRefreshing, setIsRefreshing ] = useState( false );
	const [ refreshResult, setRefreshResult ] = useState( null );
	const [ error, setError ] = useState( null );
	const [ inputUrl, setInputUrl ] = useState( feedUrl );
	const [ episodes, setEpisodes ] = useState( [] );

	const fetchEpisodes = useCallback(
		async ( { signal } = {} ) => {
			if ( ! feedUrl ) {
				return;
			}

			setIsLoading( true );
			setError( null );

			try {
				const seasonParam = season
					? `&season=${ encodeURIComponent( season ) }`
					: '';
				const response = await apiFetch( {
					path: `/a8csp/v1/podcast-feed/episodes?url=${ encodeURIComponent(
						feedUrl
					) }${ seasonParam }`,
					signal,
				} );

				setEpisodes( response.episodes );
			} catch ( err ) {
				if ( err.name !== 'AbortError' ) {
					setError(
						err.message ||
							__(
								'Failed to fetch RSS feed.',
								'a8csp-podcast-feed'
							)
					);
					setEpisodes( [] );
				}
			} finally {
				setIsLoading( false );
			}
		},
		[ feedUrl, season ]
	);

	useEffect( () => {
		if ( ! feedUrl ) {
			return;
		}

		const controller = new AbortController();
		fetchEpisodes( { signal: controller.signal } );

		return () => controller.abort();
	}, [ feedUrl, season, fetchEpisodes ] );

	const handleRefresh = async () => {
		if ( ! feedUrl || isRefreshing ) {
			return;
		}

		setIsRefreshing( true );
		setRefreshResult( null );
		setError( null );

		const previousCount = episodes.length;

		try {
			const seasonParam = season
				? `&season=${ encodeURIComponent( season ) }`
				: '';
			const response = await apiFetch( {
				path: `/a8csp/v1/podcast-feed/refresh?url=${ encodeURIComponent(
					feedUrl
				) }${ seasonParam }`,
				method: 'POST',
			} );

			const newCount = response.episodes.length - previousCount;
			setEpisodes( response.episodes );
			setRefreshResult( newCount );
		} catch ( err ) {
			setError(
				err.message ||
					__( 'Failed to refresh feed.', 'a8csp-podcast-feed' )
			);
		} finally {
			setIsRefreshing( false );
		}
	};

	const handleSubmit = ( event ) => {
		event.preventDefault();
		setAttributes( { feedUrl: inputUrl } );
	};

	const displayedEpisodes = episodes.slice( 0, numberOfEpisodes );

	const episodesContainerStyle = ( () => {
		const s = {};
		if ( layoutType === 'grid' ) {
			s.gridTemplateColumns = `repeat(${ columns }, 1fr)`;
		}
		const gapValue = getGapCssValue( attributes.style?.spacing?.blockGap );
		if ( gapValue ) {
			s.gap = gapValue;
		}
		return Object.keys( s ).length > 0 ? s : undefined;
	} )();

	const blockProps = useBlockProps();

	const layoutControls = (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					icon={ list }
					label={ __( 'List view', 'a8csp-podcast-feed' ) }
					isPressed={ layoutType === 'list' }
					onClick={ () => setAttributes( { layoutType: 'list' } ) }
				/>
				<ToolbarButton
					icon={ grid }
					label={ __( 'Grid view', 'a8csp-podcast-feed' ) }
					isPressed={ layoutType === 'grid' }
					onClick={ () => setAttributes( { layoutType: 'grid' } ) }
				/>
			</ToolbarGroup>
		</BlockControls>
	);

	const gridControls = layoutType === 'grid' && (
		<PanelBody
			title={ __( 'Layout', 'a8csp-podcast-feed' ) }
			initialOpen={ false }
		>
			<RangeControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Columns', 'a8csp-podcast-feed' ) }
				value={ columns }
				onChange={ ( value ) => setAttributes( { columns: value } ) }
				min={ 1 }
				max={ 6 }
			/>
		</PanelBody>
	);

	if ( ! feedUrl ) {
		return (
			<>
				{ layoutControls }
				<InspectorControls>
					{ gridControls }
					<DisplayOptionsPanel
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				</InspectorControls>
				<div { ...blockProps }>
					<Placeholder
						icon={ rss }
						label={ __( 'Podcast RSS Feed', 'a8csp-podcast-feed' ) }
						instructions={ __(
							'Display episodes from any podcast RSS feed.',
							'a8csp-podcast-feed'
						) }
					>
						<form
							onSubmit={ handleSubmit }
							className="wp-block-rss__placeholder-form"
						>
							<input
								type="url"
								value={ inputUrl }
								onChange={ ( event ) =>
									setInputUrl( event.target.value )
								}
								placeholder={ __(
									'Enter RSS feed URL…',
									'a8csp-podcast-feed'
								) }
								className="components-placeholder__input"
							/>
							<Button variant="primary" type="submit">
								{ __( 'Use URL', 'a8csp-podcast-feed' ) }
							</Button>
						</form>
					</Placeholder>
				</div>
			</>
		);
	}

	return (
		<>
			{ layoutControls }
			<InspectorControls>
				<PanelBody
					title={ __( 'Feed Settings', 'a8csp-podcast-feed' ) }
				>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'RSS Feed URL', 'a8csp-podcast-feed' ) }
						value={ feedUrl }
						onChange={ ( value ) =>
							setAttributes( { feedUrl: value } )
						}
						placeholder="https://example.com/feed.xml"
						help={ __(
							'Enter your podcast RSS feed URL.',
							'a8csp-podcast-feed'
						) }
					/>
					<Button
						variant="secondary"
						onClick={ handleRefresh }
						isBusy={ isRefreshing }
						disabled={ isRefreshing || ! feedUrl }
					>
						{ isRefreshing
							? __( 'Refreshing…', 'a8csp-podcast-feed' )
							: __( 'Refresh Feed', 'a8csp-podcast-feed' ) }
					</Button>
					{ refreshResult !== null && (
						<p
							className="components-base-control__help"
							style={ { marginTop: '8px' } }
						>
							{ refreshResult > 0
								? sprintf(
										/* translators: %d: number of new episodes */
										__(
											'%d new episode(s) found.',
											'a8csp-podcast-feed'
										),
										refreshResult
								  )
								: __(
										'Feed is up to date.',
										'a8csp-podcast-feed'
								  ) }
						</p>
					) }
				</PanelBody>
				{ gridControls }
				<DisplayOptionsPanel
					attributes={ attributes }
					setAttributes={ setAttributes }
					initialOpen={ false }
				/>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="podcast-feed">
					{ isLoading && (
						<div className="podcast-feed__loading">
							<Spinner />
							<p>
								{ __(
									'Loading episodes…',
									'a8csp-podcast-feed'
								) }
							</p>
						</div>
					) }
					{ error && (
						<Notice status="error" isDismissible={ false }>
							{ error }
						</Notice>
					) }
					{ ! isLoading &&
						! error &&
						displayedEpisodes.length > 0 && (
							<div
								className={ `podcast-feed__episodes podcast-feed__episodes--${ layoutType }` }
								style={ episodesContainerStyle }
							>
								{ displayedEpisodes.map( ( episode, index ) => (
									<Episode
										key={ index }
										episode={ episode }
										attributes={ attributes }
									/>
								) ) }
							</div>
						) }
					{ ! isLoading &&
						! error &&
						episodes.length === 0 &&
						feedUrl &&
						( attributes.noEpisodesMessage ? (
							<p className="podcast-feed__no-episodes">
								{ attributes.noEpisodesMessage }
							</p>
						) : (
							<Notice status="info" isDismissible={ false }>
								{ __(
									'No episodes found in this feed.',
									'a8csp-podcast-feed'
								) }
							</Notice>
						) ) }
				</div>
			</div>
		</>
	);
}
