import { ToggleControl, Flex, Button, FlexBlock } from "@wordpress/components";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

const VideoControls = (props) => {
	const { videoSource, videoOptions, setPoster, setOption, selectedVideoId } =
		props;

	if ("local" !== videoSource || !selectedVideoId) {
		return null;
	}

	const { posterId } = videoOptions;

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
								{posterId && (
									<FlexBlock>
										<Button
											__next40pxDefaultSize
											variant="secondary"
											style={{ width: "100%", justifyContent: "center" }}
											onClick={() => {
												setOption("posterId", "");
											}}
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
