import { ToggleControl, Flex } from "@wordpress/components";
import { useEntityProp } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";

const VideoControls = (props) => {
	const { videoSource } = props;

	if ("local" !== videoSource) {
		return null;
	}

	const META_KEY = "_wpcomsp_featured_video_options";
	const [meta, setMeta] = useEntityProp("postType", "post", "meta");

	const videoOptions = meta?.[META_KEY] || {};
	const setOption = (key, value) => {
		const updatedOptions = { ...videoOptions, [key]: value };
		setMeta({ [META_KEY]: updatedOptions });
	};

	return (
		<Flex alignment="center" direction="column" gap={4}>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Auto Play", "featured-video")}
				onChange={(value) => setOption("autoplay", value)}
				checked={
					"boolean" === typeof videoOptions.autoplay
						? videoOptions.autoplay
						: false
				}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Loop", "featured-video")}
				onChange={(value) => setOption("loop", value)}
				checked={
					"boolean" === typeof videoOptions.loop ? videoOptions.loop : false
				}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Mute", "featured-video")}
				onChange={(value) => setOption("muted", value)}
				checked={
					"boolean" === typeof videoOptions.muted ? videoOptions.muted : false
				}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Play Inline", "featured-video")}
				onChange={(value) => setOption("playsinline", value)}
				checked={
					"boolean" === typeof videoOptions.playsinline
						? videoOptions.playsinline
						: true
				}
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Show Controls", "featured-video")}
				onChange={(value) => setOption("controls", value)}
				checked={
					"boolean" === typeof videoOptions.controls
						? videoOptions.controls
						: true
				}
			/>
		</Flex>
	);
};
export default VideoControls;
