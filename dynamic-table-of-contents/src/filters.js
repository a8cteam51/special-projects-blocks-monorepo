export const addCustomTitleAttribute = ( settings, name ) => {
	if ( name !== 'core/heading' ) {
		return settings;
	}
	settings.attributes = {
		...settings.attributes,
		customTitle: {
			type: 'string',
		},
	};
	return settings;
};

export const saveCustomTitleAttribute = ( extraProps, blockType, attr ) => {
	if ( blockType.name !== 'core/heading' ) {
		return extraProps;
	}

	if ( ! attr?.customTitle ) {
		return extraProps;
	}

	const updatedProps = {
		...extraProps,
		customTitle: attr.customTitle,
	};

	return updatedProps;
};
