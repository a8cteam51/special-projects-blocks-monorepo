import { registerPlugin } from "@wordpress/plugins";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import {
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from "@wordpress/components"; // eslint-disable-line @wordpress/no-unsafe-wp-apis
import { useRef } from "@wordpress/element";


const FeaturedVideo = () => {
	const postType = useSelect(
		(select) => select("core/editor").getCurrentPostType(),
		[]
	);


	if ("post" !== postType) {
		return null;
	}

	const META_KEY = "_wpcomsp_featured_video_id";
	const [meta, setMeta] = useEntityProp("postType", postType, "meta");
	const selectedVideoId = meta?.[META_KEY] || "";
	const toggleRef = useRef();
	const mediaSourceUrl = useSelect(
		(select) =>
			selectedVideoId
				? select("core").getMedia(selectedVideoId)?.source_url
				: null,
		[selectedVideoId]
	);

	const onRemoveVideo = () => {
		setMeta({ [META_KEY]: "" });
	};

	const setVideoSelection = (media) => {
		setMeta({ [META_KEY]: media.id });
	};

	return (
		<PluginDocumentSettingPanel
			name="featured-video-control"
			title={__("Featured Video", "featured-video")}
			className="video-metabox"
		>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={setVideoSelection}
					allowedTypes={["video"]}
					value={selectedVideoId}
					render={({ open }) => (
						<div className="editor-post-featured-image__container">
							<VStack alignment="center">
								<Button
									ref={toggleRef}
									className={
										!selectedVideoId
											? "editor-post-featured-image__toggle"
											: "editor-post-featured-image__preview"
									}
									onClick={open}
								>
									{!selectedVideoId ? (
										__("Set featured video", "featured-video")
									) : (
										<video
											className="editor-post-featured-image__preview-video"
											controls
											src={mediaSourceUrl}
											poster={mediaSourceUrl}
											alt={__("Selected Video")}
										/>
									)}
								</Button>

								{selectedVideoId && (
									<HStack alignment="center">
										<Button
											__next40pxDefaultSize
											variant="secondary"
											onClick={open}
										>
											{__("Replace")}
										</Button>
										<Button
											__next40pxDefaultSize
											variant="secondary"
											onClick={() => {
												onRemoveVideo();
												toggleRef.current.focus();
											}}
										>
											{__("Remove")}
										</Button>
									</HStack>
								)}
							</VStack>
						</div>
					)}
				/>
			</MediaUploadCheck>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("wpcomsp-featured-video", {
	render: FeaturedVideo,
});
