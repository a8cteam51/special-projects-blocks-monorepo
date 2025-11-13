import { ToggleControl, Flex } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const VideoControls = () => {
	return (
		<Flex alignment="center" direction="column" gap={4}>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Auto Play", "featured-video")}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Loop", "featured-video")}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Mute", "featured-video")}
			/>
		</Flex>
	);
};
export default VideoControls;
