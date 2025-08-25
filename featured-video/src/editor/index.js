import { registerPlugin } from "@wordpress/plugins";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";
import { store as coreStore } from "@wordpress/core-data";
import { Button, SelectControl, Flex, FlexItem } from "@wordpress/components";
import { useState } from "@wordpress/element";

import LocalControl from "./local-control";
import ExternalControl from "./external-control";

const FeaturedVideo = () => {
	const postType = useSelect(
		(select) => select("core/editor").getCurrentPostType(),
		[]
	);

	const hasPostThumbnailSupport = useSelect(
		(select) => {
			const postTypeObject = select(coreStore).getPostType(postType);
			return postTypeObject?.supports?.["thumbnail"] ?? false;
		},
		[postType]
	);

	if (!hasPostThumbnailSupport) {
		return null;
	}

	const META_KEY = "_wpcomsp_featured_video_id";
	const [meta, setMeta] = useEntityProp("postType", postType, "meta");

	const selectedVideoId = meta?.[META_KEY] || "";

	const removeVideo = () => {
		setMeta({ [META_KEY]: null });
	};

	const [videoSource, setVideoSource] = useState("upload");

	const onChangeVideoSource = (newSource) => {
		if (videoSource !== newSource) {
			removeVideo();
		}

		setVideoSource(newSource);
	};

	const setVideoId = (media) => {
		if ("object" === typeof media) {
			setMeta({ [META_KEY]: media.id });
		} else if ("string" === typeof media) {
			setMeta({ [META_KEY]: media });
		}
	};

	return (
		<PluginDocumentSettingPanel
			name="featured-video-control"
			title={__("Featured Video", "featured-video")}
			className="video-metabox"
		>
			<Flex alignment="center" direction="column">
				<FlexItem>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__("Video Source", "featured-video")}
						options={[
							{
								label: __("Media Library", "featured-video"),
								value: "upload",
							},
							{
								label: __("External Video", "featured-video"),
								value: "external",
							},
						]}
						value={videoSource}
						onChange={onChangeVideoSource}
					/>
				</FlexItem>
				{videoSource === "upload" && (
					<FlexItem>
						<LocalControl
							selectedVideoId={selectedVideoId}
							setVideoId={setVideoId}
							removeVideo={removeVideo}
						/>
					</FlexItem>
				)}
				{videoSource === "external" && (
					<FlexItem>
						<ExternalControl
							selectedVideoId={selectedVideoId}
							setVideoId={setVideoId}
							removeVideo={removeVideo}
						/>
					</FlexItem>
				)}

				{!selectedVideoId && (
					<FlexItem>
						<p className="featured-video-source-description">
							{videoSource === "upload"
								? __("Choose a video from media library", "featured-video")
								: __(
										"Paste a video URL. Supported Providers: As supported by WordPress Embeds",
										"featured-video"
								  )}
						</p>
					</FlexItem>
				)}
			</Flex>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("wpcomsp-featured-video", {
	render: FeaturedVideo,
});
