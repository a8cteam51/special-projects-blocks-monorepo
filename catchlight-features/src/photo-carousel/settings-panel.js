/**
 * The carousel's "Carousel settings" sidebar panel.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Notice,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { hasCreditProvider } from '../editor/credit-provider';

const ASPECT_RATIOS = [
	{
		label: __( 'Landscape (16:9)', 'catchlight-features' ),
		value: '16/9',
	},
	{ label: __( 'Classic (3:2)', 'catchlight-features' ), value: '3/2' },
	{ label: __( 'Standard (4:3)', 'catchlight-features' ), value: '4/3' },
	{ label: __( 'Square (1:1)', 'catchlight-features' ), value: '1/1' },
	{ label: __( 'Portrait (4:5)', 'catchlight-features' ), value: '4/5' },
];

export default function SettingsPanel( { attributes, setAttributes } ) {
	const {
		ariaLabel,
		aspectRatio,
		imageCrop,
		autoplay,
		autoplayDelay,
		showCaptions,
		showCredits,
	} = attributes;
	const hasCredits = hasCreditProvider();

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Carousel settings', 'catchlight-features' ) }
			>
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __(
						'Accessible label',
						'catchlight-features'
					) }
					help={ __(
						'Briefly describe the carousel for screen reader users.',
						'catchlight-features'
					) }
					value={ ariaLabel }
					onChange={ ( value ) =>
						setAttributes( { ariaLabel: value } )
					}
				/>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Aspect ratio', 'catchlight-features' ) }
					options={ ASPECT_RATIOS }
					value={ aspectRatio }
					onChange={ ( value ) =>
						setAttributes( { aspectRatio: value } )
					}
				/>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __(
						'Crop images to fill the frame',
						'catchlight-features'
					) }
					help={
						imageCrop
							? __(
									'Photos fill the frame; edges may be cropped.',
									'catchlight-features'
								)
							: __(
									'Whole photos are shown, letterboxed inside the frame.',
									'catchlight-features'
								)
					}
					checked={ imageCrop }
					onChange={ ( value ) =>
						setAttributes( { imageCrop: value } )
					}
				/>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __(
						'Auto-advance slides',
						'catchlight-features'
					) }
					help={ __(
						'Pauses on hover and while the carousel has focus. Never runs for visitors who prefer reduced motion.',
						'catchlight-features'
					) }
					checked={ autoplay }
					onChange={ ( value ) =>
						setAttributes( { autoplay: value } )
					}
				/>
				{ autoplay && (
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __(
							'Delay between slides (seconds)',
							'catchlight-features'
						) }
						min={ 1 }
						max={ 30 }
						step={ 1 }
						// Stored in ms to match the engine's setInterval.
						value={ Math.round( autoplayDelay / 1000 ) }
						onChange={ ( value ) =>
							setAttributes( {
								autoplayDelay: ( value ?? 5 ) * 1000,
							} )
						}
					/>
				) }
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show captions', 'catchlight-features' ) }
					help={ __(
						'Hides every slide’s caption in the editor preview and on the front end. The text is kept.',
						'catchlight-features'
					) }
					checked={ showCaptions }
					onChange={ ( value ) =>
						setAttributes( { showCaptions: value } )
					}
				/>
				{ hasCredits && (
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __(
							'Show credits',
							'catchlight-features'
						) }
						help={ __(
							'Shows each slide’s Newspack photo credit in the editor preview and on the front end.',
							'catchlight-features'
						) }
						checked={ showCredits }
						onChange={ ( value ) =>
							setAttributes( { showCredits: value } )
						}
					/>
				) }
				<Notice status="info" isDismissible={ false }>
					{ hasCredits
						? __(
								'Select a slide to edit its caption and credit in the image’s sidebar (Photo Caption and Photo Credit panels).',
								'catchlight-features'
							)
						: __(
								'Select a slide to edit its caption in the image’s sidebar (Photo Caption panel).',
								'catchlight-features'
							) }
				</Notice>
			</PanelBody>
		</InspectorControls>
	);
}
