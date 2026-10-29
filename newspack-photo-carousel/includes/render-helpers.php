<?php
/**
 * Photo Carousel block: server-side render, called from the block's render.php.
 *
 * The render reads each core/image child instead of echoing its rendered
 * output: the image's link, lightbox and size settings would fight the
 * carousel's own controls and fixed-ratio stage.
 *
 * @package wpcomsp
 */

defined( 'ABSPATH' ) || exit;

/**
 * Renders the carousel.
 *
 * @param array<string, mixed> $attributes Block attributes.
 * @param string               $content    Unused: see the file comment.
 * @param WP_Block             $block      Block instance.
 *
 * @return string
 */
function newspack_photo_carousel_render_block( $attributes, $content, $block ) {
	if ( ! $block instanceof WP_Block ) {
		return '';
	}

	$slides = newspack_photo_carousel_get_slides( $block, ! empty( $attributes['showCaptions'] ), ! empty( $attributes['showCredits'] ) );
	if ( array() === $slides ) {
		return '';
	}

	$slides = newspack_photo_carousel_add_images( $slides );
	$count  = count( $slides );

	// Rendered on load: the first slide and its neighbours (the arrows wrap). The
	// rest get `hidden`, so their lazy images wait for the engine to show them.
	$window = array( 0, 1 % $count, $count - 1 );

	$label = trim( (string) ( $attributes['ariaLabel'] ?? '' ) );
	if ( '' === $label ) {
		$label = __( 'Photo carousel', 'newspack-photo-carousel' );
	}

	$ratio = (string) ( $attributes['aspectRatio'] ?? '' );
	if ( 1 !== preg_match( '#^\d+/\d+$#', $ratio ) ) {
		$ratio = '16/9';
	}

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'role'                 => 'region',
			'aria-roledescription' => _x( 'carousel', 'aria-roledescription', 'newspack-photo-carousel' ),
			'aria-label'           => $label,
			'style'                => '--newspack-photo-carousel-aspect-ratio:' . $ratio . ';',
			'data-autoplay'        => empty( $attributes['autoplay'] ) ? '0' : '1',
			// Floor the delay: a hand-edited 0 would spin setInterval.
			'data-autoplay-delay'  => (string) max( 1000, (int) ( $attributes['autoplayDelay'] ?? 5000 ) ),
		)
	);

	$media_class = 'wp-block-newspack-photo-carousel__slide-media' . ( empty( $attributes['imageCrop'] ) ? ' is-uncropped' : '' );

	// Prev is mirrored via CSS.
	$chevron = '<svg class="wp-block-newspack-photo-carousel__chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';

	// Unique per instance so ids don't collide across carousels on one page.
	$id_prefix = wp_unique_id( 'newspack-photo-carousel-' );

	ob_start();
	?>
	<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns escaped output. ?>>
		<button type="button" class="wp-block-newspack-photo-carousel__prev" aria-label="<?php esc_attr_e( 'Previous slide', 'newspack-photo-carousel' ); ?>">
			<?php echo $chevron; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static inline SVG. ?>
		</button>

		<div class="wp-block-newspack-photo-carousel__slides">
			<?php foreach ( $slides as $index => $slide ) : ?>
				<?php
				$slide_label = sprintf(
					/* translators: 1: slide number, 2: total number of slides. */
					__( 'Slide %1$d of %2$d', 'newspack-photo-carousel' ),
					$index + 1,
					$count
				);
				?>
				<figure
					class="wp-block-newspack-photo-carousel__slide<?php echo 0 === $index ? ' is-active' : ''; ?>"
					<?php echo in_array( $index, $window, true ) ? '' : 'hidden'; ?>
					id="<?php echo esc_attr( $id_prefix . '-slide-' . $index ); ?>"
					role="group"
					aria-roledescription="<?php echo esc_attr_x( 'slide', 'aria-roledescription', 'newspack-photo-carousel' ); ?>"
					aria-label="<?php echo esc_attr( $slide_label ); ?>"
					aria-describedby="<?php echo esc_attr( $id_prefix . '-caption-' . $index ); ?>"
				>
					<div class="<?php echo esc_attr( $media_class ); ?>">
						<?php echo $slide['stage_html']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in newspack_photo_carousel_get_image(). ?>
					</div>
				</figure>
			<?php endforeach; ?>
		</div>

		<button type="button" class="wp-block-newspack-photo-carousel__next" aria-label="<?php esc_attr_e( 'Next slide', 'newspack-photo-carousel' ); ?>">
			<?php echo $chevron; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static inline SVG. ?>
		</button>

		<?php // Pointer shortcut only: the arrows are the accessible control. ?>
		<ul class="wp-block-newspack-photo-carousel__rail" aria-hidden="true">
			<?php foreach ( $slides as $index => $slide ) : ?>
				<li>
					<button type="button" class="wp-block-newspack-photo-carousel__goto<?php echo 0 === $index ? ' is-active' : ''; ?>" tabindex="-1">
						<?php echo $slide['thumb_html']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in newspack_photo_carousel_get_image(). ?>
					</button>
				</li>
			<?php endforeach; ?>
		</ul>

		<div class="wp-block-newspack-photo-carousel__captions">
			<?php foreach ( $slides as $index => $slide ) : ?>
				<div
					class="wp-block-newspack-photo-carousel__caption<?php echo 0 === $index ? ' is-active' : ''; ?>"
					id="<?php echo esc_attr( $id_prefix . '-caption-' . $index ); ?>"
				>
					<?php echo wp_kses_post( $slide['caption_html'] ); ?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="wp-block-newspack-photo-carousel__caption-status" aria-live="polite" aria-atomic="true"></div>
	</div>
	<?php
	return (string) ob_get_clean();
}

/**
 * Lists the carousel's slides from its core/image inner blocks.
 *
 * `url`, `alt` and `caption` are HTML-sourced in core/image's schema, so
 * WP_Block::attributes never hydrates them server-side (only JS does): they
 * are parsed from each image's own inner_html. `id` has no source, so it is
 * read from the attributes.
 *
 * @param WP_Block $block         The carousel block.
 * @param boolean  $show_captions Whether slides show a caption.
 * @param boolean  $show_credits  Whether slides show a credit.
 *
 * @return array<int, array{id: int, url: string, alt: string, caption_html: string}>
 */
function newspack_photo_carousel_get_slides( WP_Block $block, bool $show_captions, bool $show_credits ): array {
	$slides = array();

	foreach ( $block->inner_blocks as $image ) {
		// allowedBlocks is editor-only: a non-image child could still arrive
		// via code view, REST, or an import.
		if ( 'core/image' !== $image->name ) {
			continue;
		}

		$html     = (string) $image->inner_html;
		$image_id = (int) ( $image->attributes['id'] ?? 0 );
		$caption  = $show_captions ? newspack_photo_carousel_get_caption( $html, $image_id ) : '';
		$credit   = $show_credits ? newspack_photo_carousel_get_slide_credit( $image_id, $image->parsed_block ) : '';
		$tags     = new WP_HTML_Tag_Processor( $html );
		$has_img  = $tags->next_tag( 'img' );

		$parts = array();
		if ( '' !== $caption ) {
			$parts[] = '<span class="wp-block-newspack-photo-carousel__caption-text">' . $caption . '</span>';
		}
		if ( '' !== $credit ) {
			$parts[] = '<span class="wp-block-newspack-photo-carousel__caption-credit">' . $credit . '</span>';
		}

		$slides[] = array(
			'id'           => $image_id,
			'url'          => $has_img ? (string) ( $tags->get_attribute( 'src' ) ?? '' ) : '',
			'alt'          => $has_img ? (string) ( $tags->get_attribute( 'alt' ) ?? '' ) : '',
			// The newline keeps the live region from reading caption and credit as one run.
			'caption_html' => implode( "\n", $parts ),
		);
	}

	return $slides;
}

/**
 * A slide's caption HTML: the image block's own caption, else the image's
 * Media Library caption (as Newspack's carousel shows), else ''.
 *
 * @param string  $image_html The image block's saved markup.
 * @param integer $image_id   Its attachment ID.
 *
 * @return string
 */
function newspack_photo_carousel_get_caption( string $image_html, int $image_id ): string {
	$caption = '';
	if ( 1 === preg_match( '/<figcaption\b[^>]*>(.*?)<\/figcaption>/s', $image_html, $match ) ) {
		$caption = trim( $match[1] );
	}

	if ( '' === $caption && 0 !== $image_id ) {
		$caption = trim( (string) wp_get_attachment_caption( $image_id ) );
	}

	// A newline after each <br> lets the live region read a line break as a space.
	return (string) preg_replace( '#<br\s*/?>#i', '$0' . "\n", $caption );
}

/**
 * A slide's credit markup, or '' when it has none.
 *
 * The block itself prints no credit: Newspack_Photo_Carousel_Credits, loaded
 * only while the Newspack plugin is active, supplies Newspack's markup through
 * this filter at priority 5.
 *
 * @param integer              $attachment_id The slide's attachment ID.
 * @param array<string, mixed> $parsed_block  The slide's parsed core/image block.
 *
 * @return string
 */
function newspack_photo_carousel_get_slide_credit( int $attachment_id, array $parsed_block ): string {
	/**
	 * Filters a slide's credit markup.
	 *
	 * @param string               $html          Credit markup, '' for none. Newspack's
	 *                                            markup from priority 5 when Newspack is active.
	 * @param int                  $attachment_id The slide's attachment ID.
	 * @param array<string, mixed> $parsed_block  The slide's parsed core/image block.
	 */
	return (string) apply_filters( 'newspack_photo_carousel_slide_credit', '', $attachment_id, $parsed_block );
}

/**
 * Adds each slide's stage and rail `<img>` markup as `stage_html` and `thumb_html`.
 *
 * Both skip srcset/sizes. Under object-fit: cover a width-only pick lands too
 * small for the crop, so the stage uses one large size to bound the file; the
 * thumbs' 300px `sizes` pulled a 768px file into a 90px box on retina.
 *
 * @param array<int, array<string, mixed>> $slides Slides from newspack_photo_carousel_get_slides().
 *
 * @return array<int, array<string, mixed>>
 */
function newspack_photo_carousel_add_images( array $slides ): array {
	/**
	 * Filters the image size of the carousel's main photos.
	 *
	 * @param string $size Registered image size name.
	 */
	$stage_size = (string) apply_filters( 'newspack_photo_carousel_image_size', '2048x2048' );

	/**
	 * Filters the image size of the thumbnail rail.
	 *
	 * @param string $size Registered image size name.
	 */
	$thumb_size = (string) apply_filters( 'newspack_photo_carousel_thumbnail_size', 'medium' );

	add_filter( 'wp_calculate_image_srcset_meta', '__return_empty_array', PHP_INT_MAX );
	add_filter( 'wp_get_attachment_image_attributes', 'newspack_photo_carousel_strip_jetpack_data', PHP_INT_MAX );

	foreach ( $slides as $index => $slide ) {
		$stage_attr = array(
			'class' => 'wp-block-newspack-photo-carousel__slide-image',
			'alt'   => $slide['alt'],
		);
		if ( 0 !== $index ) {
			// Fetch after the first slide. Core drops `lazy` when given `low` alone.
			$stage_attr['fetchpriority'] = 'low';
			$stage_attr['loading']       = 'lazy';
		}

		$slides[ $index ]['stage_html'] = newspack_photo_carousel_get_image( $slide, $stage_size, $stage_attr );
		$slides[ $index ]['thumb_html'] = newspack_photo_carousel_get_image(
			$slide,
			$thumb_size,
			array(
				'class'   => 'wp-block-newspack-photo-carousel__goto-image',
				'loading' => 'lazy',
			)
		);
	}

	remove_filter( 'wp_get_attachment_image_attributes', 'newspack_photo_carousel_strip_jetpack_data', PHP_INT_MAX );
	remove_filter( 'wp_calculate_image_srcset_meta', '__return_empty_array', PHP_INT_MAX );

	return $slides;
}

/**
 * A slide's attachment `<img>`, or a plain one from the saved URL when the
 * attachment is gone (an external URL, or deleted since save).
 *
 * @param array<string, mixed>  $slide A slide.
 * @param string                $size  Image size.
 * @param array<string, string> $attr  Attributes for the `<img>`.
 *
 * @return string
 */
function newspack_photo_carousel_get_image( array $slide, string $size, array $attr ): string {
	$html = 0 !== $slide['id'] ? wp_get_attachment_image( $slide['id'], $size, false, $attr ) : '';
	if ( '' !== $html ) {
		return $html;
	}

	$attr = array_merge(
		array(
			'src' => $slide['url'],
			'alt' => $slide['alt'],
		),
		$attr
	);

	$html = '<img';
	foreach ( $attr as $name => $value ) {
		$html .= sprintf( ' %s="%s"', $name, 'src' === $name ? esc_url( $value ) : esc_attr( $value ) );
	}

	return $html . ' />';
}

/**
 * Drops the lightbox data Jetpack Carousel adds to every attachment image
 * (~1 KB each). The photo carousel never opens that lightbox.
 *
 * @param array<string, string> $attr Image attributes.
 *
 * @return array<string, string>
 */
function newspack_photo_carousel_strip_jetpack_data( array $attr ): array {
	$jetpack_keys = array(
		'data-attachment-id',
		'data-permalink',
		'data-orig-file',
		'data-orig-size',
		'data-comments-opened',
		'data-image-meta',
		'data-image-title',
		'data-image-description',
		'data-image-caption',
		'data-large-file',
	);

	return array_diff_key( $attr, array_flip( $jetpack_keys ) );
}
