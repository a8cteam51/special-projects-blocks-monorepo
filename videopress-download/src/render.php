<?php
	$wpcomsp_blocks_text           = $attributes['text'] ?? __( 'Download', 'videopress-download' );
	$wpcomsp_blocks_guid           = $attributes['guid'] ?? 0;
	$wpcomsp_blocks_src            = $attributes['src'] ?? '';
	$wpcomsp_blocks_allow_download = $attributes['allowDownload'];
	$wpcomsp_blocks_is_private     = $attributes['isPrivate'] ?? false;


if ( ! $wpcomsp_blocks_allow_download || ( ! $wpcomsp_blocks_guid || ! $wpcomsp_blocks_src ) ) {
	return null;
}

$extra_attributes = apply_filters( 'wpcomsp_video_container_attributes', array() );

?>
<a
	<?php echo wp_kses_data( get_block_wrapper_attributes( $extra_attributes ) ); ?>
	data-wp-interactive="wpcomsp/video-download-link"
	<?php if ( $wpcomsp_blocks_is_private ) { ?>
		data-wp-init="callbacks.asyncGetVideoLink"
	<?php } else { ?>
		data-wp-init="callbacks.getVideoLink"
	<?php } ?>
	data-wp-class--is-ready="context.isReady"
	data-wp-class--is-error="context.isError"
	
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'post_id'     => get_the_ID(),
				'guid'        => esc_attr( $wpcomsp_blocks_guid ),
				'src'         => esc_url( $wpcomsp_blocks_src ),
				'text'        => esc_html( $wpcomsp_blocks_text ),
				'isReady'     => false,
				'isError'     => false,
				'isErrorText' => apply_filters( 'wpcomsp_video_download_error', __( 'Video cannot be downloaded', 'videopress-download' ) ),
			)
		)
	);
	?>
>
	<span data-wp-text="context.text"></span>
	<svg id="icons" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m21 19h-18a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2z"/><path d="m12 2a1 1 0 0 0 -1 1v10.59l-3.29-3.3a1 1 0 0 0 -1.42 1.42l5 5a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 -1.42-1.42l-3.29 3.3v-10.59a1 1 0 0 0 -1-1z"/></svg>
</a>
