// WordPress dependencies.
import {
	__experimentalToolsPanelItem as ToolsPanelItem, // eslint-disable-line
} from '@wordpress/components';

// Internal dependencies.
import { CornerControl } from './corner-control';

export const AxisControls = ( {
	corners,
	label,
	onChange,
	onDeselect,
	presetKey = 'spacing',
	presets = [],
	values,
	hasValue,
} ) => {
	return (
		<ToolsPanelItem
			label={ label }
			hasValue={ hasValue }
			onDeselect={ onDeselect }
		>
			<div className="dynamic-shapes-axis-controls">
				<legend className="components-base-control__label dynamic-shapes-axis-controls__label">
					{ label }
				</legend>
				{ corners.map( ( { key, label: cornerLabel } ) => (
					<CornerControl
						key={ key }
						corner={ key }
						label={ cornerLabel }
						value={ values?.[ key ] || '' }
						onChange={ ( value ) =>
							onChange( {
								...( values || {} ),
								[ key ]: value || '',
							} )
						}
						presets={ presets }
						presetKey={ presetKey }
					/>
				) ) }
			</div>
		</ToolsPanelItem>
	);
};
