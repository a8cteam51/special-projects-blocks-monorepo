// WordPress dependencies.
import {
	Button,
	__experimentalToolsPanelItem as ToolsPanelItem, // eslint-disable-line
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import { CornerControl } from './corner-control';

export const AxisControls = ( {
	corners,
	label,
	onChange,
	presetKey = 'spacing',
	presets = [],
	values,
	hasValue,
	onReset,
} ) => {
	return (
		<ToolsPanelItem label={ label } hasValue={ hasValue }>
			<div className="dynamic-shapes-axis-controls">
				<div className="dynamic-shapes-axis-controls__row">
					<legend className="components-base-control__label dynamic-shapes-axis-controls__label">
						{ label }
					</legend>
					<Button
						onClick={ onReset }
						className="component-box-control__reset-button"
						variant="secondary"
						size="small"
					>
						{ __( 'Reset', 'dynamic-shapes' ) }
					</Button>
				</div>
				{ corners.map( ( { key, label: cornerLabel } ) => (
					<CornerControl
						key={ key }
						corner={ key }
						label={ cornerLabel }
						value={ values?.[ key ] || '' }
						onChange={ ( value ) =>
							onChange( { ...values, [ key ]: value || '' } )
						}
						presets={ presets }
						presetKey={ presetKey }
					/>
				) ) }
			</div>
		</ToolsPanelItem>
	);
};
