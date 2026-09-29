import { TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const ExternalControl = (props) => {
	const { selectedVideoId, setVideoId } = props;
	return (
		<TextControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={__("External Video URL", "featured-video")}
			value={selectedVideoId}
			type="url"
			onChange={(value) => {
				setVideoId(value);
			}}
		/>
	);
};

export default ExternalControl;
