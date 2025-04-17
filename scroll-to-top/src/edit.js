/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	Button,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {JSX.Element} Element to render.
 */

export default function Edit( { attributes, setAttributes } ) {
	const {
		backgroundColor,
		backgroundColorHover,
		borderColor,
		borderRadius,
		borderWidth,
		useCustomIcon,
		iconUpload,
		iconColor,
		buttonPosition,
		buttonFloatingRight,
		buttonFloatingBottom,
	} = attributes;

	const setBackgroundColor = ( newColor ) => {
		setAttributes( { backgroundColor: newColor } );
	};

	const setbackgroundColorHover = ( newColor ) => {
		setAttributes( { backgroundColorHover: newColor } );
	};

	const setBorderColor = ( newColor ) => {
		setAttributes( { borderColor: newColor } );
	};

	const setBorderRadius = ( newValue ) => {
		setAttributes( { borderRadius: parseInt( newValue ) } );
	};

	const setBorderThickness = ( newValue ) => {
		setAttributes( { borderWidth: parseInt( newValue ) } );
	};

	const seticonColor = ( newColor ) => {
		setAttributes( { iconColor: newColor } );
	};

	const onSelectIcon = ( media ) => {
		setAttributes( { iconUpload: media } );
	};

	const onRemoveIcon = () => {
		setAttributes( { iconUpload: null } );
	};

	const toggleCustomIcon = () => {
		if ( ! useCustomIcon ) {
			setAttributes( { iconUpload: null } );
		}
		setAttributes( { useCustomIcon: ! useCustomIcon } );
	};

	const setButtonPosition = ( newPosition ) => {
		setAttributes( { buttonPosition: newPosition } );
	};

	const setButtonFloatingRight = ( newValue ) => {
		setAttributes( { buttonFloatingRight: parseInt( newValue ) } );
	};

	const setButtonFloatingBottom = ( newValue ) => {
		setAttributes( { buttonFloatingBottom: parseInt( newValue ) } );
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelColorSettings
					title={ __(
						'Background Settings',
						'scroll-to-top'
					) }
					initialOpen={ true }
					colorSettings={ [
						{
							value: backgroundColor,
							onChange: setBackgroundColor,
							label: __(
								'Background Color',
								'scroll-to-top'
							),
						},
						{
							value: backgroundColorHover,
							onChange: setbackgroundColorHover,
							label: __(
								'Background Hover Color',
								'scroll-to-top'
							),
						},
					] }
				/>
				<PanelBody>
					<PanelColorSettings
						title={ __(
							'Border Settings',
							'scroll-to-top'
						) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: borderColor,
								onChange: setBorderColor,
								label: __(
									'Border Color',
									'scroll-to-top'
								),
							},
						] }
						className="no-padding-panel"
					/>
					<RangeControl
						label={ __(
							'Border Radius (px)',
							'scroll-to-top'
						) }
						value={ borderRadius }
						onChange={ ( value ) => setBorderRadius( value ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __(
							'Border Thickness (px)',
							'scroll-to-top'
						) }
						value={ borderWidth }
						onChange={ ( value ) => setBorderThickness( value ) }
						min={ 1 }
						max={ 10 }
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Icon Settings', 'scroll-to-top' ) }
				>
					{ ! useCustomIcon && (
						<PanelColorSettings
							initialOpen={ false }
							colorSettings={ [
								{
									value: iconColor,
									onChange: seticonColor,
									label: __(
										'Default icon Color',
										'scroll-to-top'
									),
								},
							] }
							className="no-padding-panel no-margin-top"
						/>
					) }
					<ToggleControl
						label={ __(
							'Use Custom Icon',
							'scroll-to-top'
						) }
						checked={ useCustomIcon }
						onChange={ toggleCustomIcon }
					/>
					{ useCustomIcon && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectIcon }
								allowedTypes={ [ 'image' ] }
								value={ iconUpload ? iconUpload.id : null }
								render={ ( { open } ) => (
									<Button onClick={ open }>
										{ iconUpload ? (
											<img
												src={ iconUpload.url }
												alt={ iconUpload.alt }
												style={ { maxWidth: '20px' } }
											/>
										) : (
											__(
												'Upload Icon',
												'scroll-to-top'
											)
										) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
					) }
					{ iconUpload && useCustomIcon && (
						<Button onClick={ onRemoveIcon }>
							{ __( 'Remove Icon', 'scroll-to-top' ) }
						</Button>
					) }
				</PanelBody>
				<PanelBody
					title={ __(
						'Button Position',
						'scroll-to-top'
					) }
				>
					<SelectControl
						label={ __(
							'Button Position',
							'scroll-to-top'
						) }
						value={ buttonPosition }
						options={ [
							{ label: 'Floating', value: 'fixed' },
							{ label: 'Static', value: 'relative' },
						] }
						onChange={ setButtonPosition }
					/>
					{ buttonPosition === 'fixed' && (
						<>
							<RangeControl
								label={ __(
									'Floating Right (px)',
									'scroll-to-top'
								) }
								value={ buttonFloatingRight }
								onChange={ ( value ) =>
									setButtonFloatingRight( value )
								}
								min={ 0 }
								max={ 100 }
							/>
							<RangeControl
								label={ __(
									'Floating Bottom (px)',
									'scroll-to-top'
								) }
								value={ buttonFloatingBottom }
								onChange={ ( value ) =>
									setButtonFloatingBottom( value )
								}
								min={ 0 }
								max={ 100 }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<button
				className="scroll-to-top-button"
				style={ {
					borderColor,
					borderRadius: `${ borderRadius }px`,
					borderWidth: `${ borderWidth }px`,
					position: buttonPosition === 'fixed' ? 'fixed' : 'relative',
					right:
						buttonPosition === 'fixed'
							? `${ buttonFloatingRight }px`
							: 'auto',
					bottom:
						buttonPosition === 'fixed'
							? `${ buttonFloatingBottom }px`
							: 'auto',
				} }
				data-position={ buttonPosition }
			>
				{ ! useCustomIcon ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="17"
						viewBox="0 0 16 17"
						fill="none"
					>
						<path
							transform="rotate(180 8 8.5)"
							d="M7.29289 16.7071C7.68342 17.0976 8.31658 17.0976 8.70711 16.7071L15.0711 10.3431C15.4616 9.95262 15.4616 9.31946 15.0711 8.92893C14.6805 8.53841 14.0474 8.53841 13.6569 8.92893L8 14.5858L2.34315 8.92893C1.95262 8.53841 1.31946 8.53841 0.928932 8.92893C0.538408 9.31946 0.538408 9.95262 0.928932 10.3431L7.29289 16.7071ZM7 0L7 16H9V0L7 0Z"
							fill={ iconColor }
						/>
					</svg>
				) : (
					<img
						src={ iconUpload ? iconUpload.url : '' }
						alt={ iconUpload ? iconUpload.alt : '' }
						style={ { maxWidth: '20px' } }
					/>
				) }
			</button>
			<style>
				{ `
					.scroll-to-top-button {
						background-color: ${ backgroundColor };
					}
					.scroll-to-top-button:hover {
						background-color: ${ backgroundColorHover };
					}
				` }
			</style>
		</div>
	);
}
