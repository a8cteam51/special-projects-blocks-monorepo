import { useSelect } from "@wordpress/data";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { uploadMedia } from "@wordpress/media-utils";
import { Button, DropZone, Flex, FlexItem } from "@wordpress/components";
import { useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

const LocalControl = (props) => {
	const { selectedVideoId, setVideoId, removeVideo, posterSourceUrl } = props;

	const mediaSourceUrl = useSelect(
		(select) =>
			selectedVideoId
				? select("core").getMedia(selectedVideoId)?.source_url
				: null,
		[selectedVideoId],
	);

	const toggleRef = useRef();

	const onFilesDrop = (filesList) => {
		uploadMedia({
			filesList,
			allowedTypes: ["video"],
			onFileChange: ([file]) => {
				if (file?.id) {
					setVideoId(file);
				}
			},
			onError: () => {},
		});
	};

	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={setVideoId}
				allowedTypes={["video"]}
				value={selectedVideoId}
				render={({ open }) => (
					<div className="editor-post-featured-image__container">
						<Flex alignment="center" direction="column">
							<FlexItem>
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
											alt={__("Selected Video", "featured-video")}
											poster={posterSourceUrl}
										/>
									)}
									<DropZone onFilesDrop={onFilesDrop} />
								</Button>
							</FlexItem>
							{selectedVideoId && (
								<FlexItem>
									<Flex align="center">
										<FlexItem>
											<Button
												__next40pxDefaultSize
												variant="secondary"
												onClick={open}
											>
												{__("Replace", "featured-video")}
											</Button>
										</FlexItem>
										<FlexItem>
											<Button
												__next40pxDefaultSize
												variant="secondary"
												onClick={() => {
													removeVideo();
													toggleRef.current.focus();
												}}
											>
												{__("Remove", "featured-video")}
											</Button>
										</FlexItem>
									</Flex>
								</FlexItem>
							)}
						</Flex>
					</div>
				)}
			/>
		</MediaUploadCheck>
	);
};

export default LocalControl;
