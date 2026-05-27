import { ToggleControl, Flex, Button, FlexBlock } from "@wordpress/components";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

const VideoControls = (props) => {
	const {
		videoSource,
		videoOptions,
		setPoster,
		removePoster,
		setOption,
		setOptions,
		selectedVideoId,
	} = props;

	if ("local" !== videoSource || !selectedVideoId) {
		return null;
	}

	const { posterId } = videoOptions;

	const onChangeAutoplay = (value) => {
		// Batch both writes — two separate setOption calls would each capture
		// the same stale videoOptions and the second would clobber the first,
		// silently dropping the implicit `muted: true`.
		if (value && !videoOptions.muted) {
			setOptions({ autoplay: value, muted: true });
			return;
		}
		setOption("autoplay", value);
	};

	return (
		<Flex alignment="center" direction="column" gap={4}>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Auto Play", "featured-video")}
				help={__(
					"Browsers require autoplaying videos to be muted.",
					"featured-video",
				)}
				onChange={onChangeAutoplay}
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
			<ToggleControl
				__nextHasNoMarginBottom
				label={__("Show Play Icon", "featured-video")}
				help={__(
					"Display a centred play button overlay on the frontend.",
					"featured-video",
				)}
				onChange={(value) => setOption("showPlayIcon", value)}
				checked={
					"boolean" === typeof videoOptions.showPlayIcon
						? videoOptions.showPlayIcon
						: false
				}
			/>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={setPoster}
					allowedTypes={["image"]}
					value={null}
					render={({ open }) => (
						<div className="editor-post-featured-image__container">
							<Flex alignment="center" direction="column">
								{!posterId && (
									<FlexBlock>
										<Button
											__next40pxDefaultSize
											variant="primary"
											onClick={open}
											style={{ width: "100%", justifyContent: "center" }}
										>
											{__("Add Poster", "featured-video")}
										</Button>
									</FlexBlock>
								)}
								{!!posterId && (
									<FlexBlock>
										<Button
											__next40pxDefaultSize
											variant="secondary"
											style={{ width: "100%", justifyContent: "center" }}
											onClick={removePoster}
										>
											{__("Remove Poster", "featured-video")}
										</Button>
									</FlexBlock>
								)}
							</Flex>
						</div>
					)}
				/>
			</MediaUploadCheck>
		</Flex>
	);
};
export default VideoControls;
