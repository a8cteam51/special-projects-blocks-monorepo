// WordPress dependencies.
import {
	Button,
	RangeControl,
	Tooltip,
	__experimentalUnitControl as UnitControl, // eslint-disable-line
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useState, useMemo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { settings } from '@wordpress/icons';

// Internal dependencies.
import { CornerIcon } from './corner-icon';
import { isPresetValue } from './utils';

export const CornerControl = ( {
	corner,
	label,
	value,
	onChange,
	presets = [],
	presetKey = 'spacing',
} ) => {
	const [ showCustomValueControl, setShowCustomValueControl ] = useState(
		value !== undefined && value !== '' && ! isPresetValue( value )
	);

	const presetIndex = useMemo( () => {
		const getPresetIndexFromValue = ( v ) => {
			if ( ! isPresetValue( v ) ) {
				return undefined;
			}

			const match = v.match(
				new RegExp( `^var:preset\\|${ presetKey }\\|(.+)$` )
			);
			if ( ! match ) {
				return undefined;
			}

			const slug = match[ 1 ];
			const index = presets.findIndex( ( preset ) => {
				return preset.slug === slug;
			} );

			return index !== -1 ? index : undefined;
		};

		return isPresetValue( value )
			? getPresetIndexFromValue( value )
			: undefined;
	}, [ value, presetKey, presets ] );

	const marks = useMemo( () => {
		return presets.length > 0
			? [
					{
						value: 0,
						label: '',
						tooltip: __( 'None' ),
					},
					...presets.map( ( preset, index ) => ( {
						value: index + 1,
						label: '',
						tooltip: preset.name ?? preset.slug,
					} ) ),
			  ]
			: [];
	}, [ presets ] );

	const inputId = useInstanceId( CornerControl, 'corner-control-input' );

	const handleToggleMode = useCallback( () => {
		setShowCustomValueControl( ! showCustomValueControl );
	}, [ showCustomValueControl ] );

	const handleRangeChange = useCallback(
		( newValue ) => {
			onChange( newValue + 'px' );
		},
		[ onChange ]
	);

	const handlePresetChange = useCallback(
		( newIndex ) => {
			const getPresetValueFromIndex = ( index ) => {
				const preset = presets[ index ];
				return `var:preset|${ presetKey }|${ preset.slug }`;
			};

			const newValue =
				newIndex === 0 || newIndex === undefined
					? undefined
					: getPresetValueFromIndex( newIndex - 1 );
			onChange( newValue );
		},
		[ onChange, presets, presetKey ]
	);

	return (
		<div className="dynamic-shapes-corner-control">
			<CornerIcon corner={ corner } />
			{ showCustomValueControl || marks.length === 0 ? (
				<>
					<Tooltip placement="top-end" text={ label }>
						<UnitControl
							__next40pxDefaultSize={ true }
							min={ 0 }
							className="dynamic-shapes-corner-control__unit-control"
							id={ inputId }
							isPressEnterToChange
							units={ [
								{ value: 'px', label: 'px', default: 0 },
							] }
							value={ value }
							onChange={ onChange }
							onUnitChange={ () => {} }
							onFocus={ () => {} }
							label={ label }
							hideLabelFromVision
						/>
					</Tooltip>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						className="dynamic-shapes-corner-control__range-control"
						aria-controls={ inputId }
						label={ label }
						hideLabelFromVision
						value={ parseInt( value ) || 0 }
						onChange={ handleRangeChange }
						min={ 0 }
						max={ 100 }
						step={ 1 }
						withInputField={ false }
					/>
				</>
			) : (
				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					className="dynamic-shapes-corner-control__range-control"
					value={ presetIndex !== undefined ? presetIndex + 1 : 0 }
					onChange={ handlePresetChange }
					withInputField={ false }
					aria-valuenow={
						presetIndex !== undefined ? presetIndex + 1 : 0
					}
					aria-valuetext={
						marks[ presetIndex !== undefined ? presetIndex + 1 : 0 ]
							.tooltip
					}
					renderTooltipContent={ ( index ) =>
						marks[ ! index ? 0 : index ].tooltip
					}
					min={ 0 }
					max={ marks.length - 1 }
					marks={ marks }
					label={ label }
					hideLabelFromVision
				/>
			) }
			{ marks.length > 0 && (
				<Button
					label={
						showCustomValueControl
							? __( 'Use size preset' )
							: __( 'Set custom size' )
					}
					icon={ settings }
					onClick={ handleToggleMode }
					isPressed={ showCustomValueControl }
					size="small"
					iconSize={ 24 }
				/>
			) }
		</div>
	);
};
