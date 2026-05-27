import { registerPlugin } from "@wordpress/plugins";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";
import { store as coreStore } from "@wordpress/core-data";
import { SelectControl, Flex, FlexItem } from "@wordpress/components";
import { useState } from "@wordpress/element";

import LocalControl from "./local-control";
import ExternalControl from "./external-control";
import VideoControls from "./video-controls";

const META_KEY = "_wpcomsp_featured_video_id";
const META_OPTIONS_KEY = "_wpcomsp_featured_video_options";

const isAttachmentId = (value) => /^\d+$/.test(String(value));

const FeaturedVideo = () => {
	const postType = useSelect(
		(select) => select("core/editor").getCurrentPostType(),
		[],
	);

	const hasPostThumbnailSupport = useSelect(
		(select) => {
			const postTypeObject = select(coreStore).getPostType(postType);
			return postTypeObject?.supports?.["thumbnail"] ?? false;
		},
		[postType],
	);

	const [meta, setMeta] = useEntityProp("postType", postType, "meta");

	const selectedVideoId = meta?.[META_KEY] || "";
	const videoOptions = meta?.[META_OPTIONS_KEY] || {};
	const posterId = videoOptions.posterId || "";

	const posterSourceUrl = useSelect(
		(select) =>
			posterId ? select("core").getMedia(posterId)?.source_url : null,
		[posterId],
	);

	// Tracks the user's choice of source when no video is set yet. Once a
	// video exists, `videoSource` is derived from the stored value so the
	// panel stays in sync even after the entity meta hydrates.
	const [chosenSource, setChosenSource] = useState("local");

	if (!hasPostThumbnailSupport) {
		return null;
	}

	const videoSource = selectedVideoId
		? isAttachmentId(selectedVideoId)
			? "local"
			: "external"
		: chosenSource;

	const setOptions = (updates) => {
		setMeta({ [META_OPTIONS_KEY]: { ...videoOptions, ...updates } });
	};

	const setOption = (key, value) => {
		setOptions({ [key]: value });
	};

	const setPoster = (media) => {
		if ("object" === typeof media) {
			setOption("posterId", media.id);
		}
	};

	const removePoster = () => {
		setOption("posterId", 0);
	};

	const removeVideo = () => {
		setMeta({ [META_KEY]: "" });
	};

	const onChangeVideoSource = (newSource) => {
		if (videoSource !== newSource) {
			// Clear the id and the options together in one write — separate
			// `setMeta` calls would each capture the same stale options and
			// the later one would overwrite the earlier.
			setMeta({ [META_KEY]: "", [META_OPTIONS_KEY]: {} });
		}
		setChosenSource(newSource);
	};

	const setVideoId = (media) => {
		if ("object" === typeof media) {
			setMeta({ [META_KEY]: media.id.toString() });
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
			<Flex alignment="center" direction="column" gap={4}>
				<Flex alignment="center" direction="column">
					<FlexItem>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__("Video Source", "featured-video")}
							options={[
								{
									label: __("Media Library", "featured-video"),
									value: "local",
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
					{videoSource === "local" && (
						<FlexItem>
							<LocalControl
								selectedVideoId={selectedVideoId}
								setVideoId={setVideoId}
								removeVideo={removeVideo}
								posterSourceUrl={posterSourceUrl}
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
								{videoSource === "local"
									? __("Choose a video from media library", "featured-video")
									: __(
											"Paste a video URL. Supported Providers: As supported by WordPress Embeds",
											"featured-video",
									  )}
							</p>
						</FlexItem>
					)}
				</Flex>
				<VideoControls
					selectedVideoId={selectedVideoId}
					videoSource={videoSource}
					videoOptions={videoOptions}
					setPoster={setPoster}
					removePoster={removePoster}
					setOption={setOption}
					setOptions={setOptions}
				/>
			</Flex>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("wpcomsp-featured-video", {
	render: FeaturedVideo,
});
