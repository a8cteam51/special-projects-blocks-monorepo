<?php
/**
 * Manages Carousel block registration and rendering.
 *
 * @package wpcomsp
 */

namespace WPCOMSP\CarouselBlock;

add_action( 'init', __NAMESPACE__ . '\init' );

/**
 * Register the block using the metadata loaded from the `block.json` file.
 *
 * @return void
 */
function init(): void {
	register_block_type(
		dirname( __DIR__ ) . '/build',
		array(
			'render_callback' => __NAMESPACE__ . '\render',
		)
	);
}

/**
 * Render the block.
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block content.
 *
 * @return string
 */
function render( array $attributes, string $content ): string {
	$attrs = wp_parse_args(
		$attributes,
		array(
			'animate'          => 'one',
			'itemCount'        => 0,
			'overflow'         => 'hidden',
			'pagination'       => false,
			'prevNext'         => true,
			'prevNextPosition' => 'sides',
			'title'            => 'Carousel',
		)
	);

	$classnames = array(
		'animate-visible'                          => 'all-visible' === $attrs['animate'],
		'has-overflow-' . $attrs['overflow']       => true,
		'has-pagination'                           => $attrs['pagination'],
		'has-arrows-' . $attrs['prevNextPosition'] => $attrs['prevNext'],
	);
	$classnames = array_keys( array_filter( $classnames ) );

	$styles    = array( '--item-count: ' . $attrs['itemCount'] );
	$block_gap = $attrs['style']['spacing']['blockGap'] ?? 'var:preset|spacing|20';
	if ( $block_gap ) {
		$block_gap = str_replace( 'var:preset|spacing|', 'var(--wp--preset--spacing--', $block_gap ) . ')';
		$styles[]  = '--item-gap: ' . $block_gap;
	}

	$extra_attributes = array(
		'aria-label' => $attrs['title'],
		'class'      => implode( ' ', $classnames ),
		'role'       => 'region',
		'style'      => implode( '; ', $styles ),
	);

	if ( 'Carousel' !== $attrs['title'] ) {
		$extra_attributes['aria-roledescription'] = 'carousel';
	}

	$arrows     = $attrs['prevNext'] ? prev_next_buttons() : '';
	$pagination = $attrs['pagination'] ? pagination_buttons( $attrs['itemCount'] ) : '';

	$block = sprintf(
		'<div %s>%s%s%s</div>',
		wp_kses_data( get_block_wrapper_attributes( $extra_attributes ) ),
		wp_kses_post( $arrows ),
		wp_kses_post( $pagination ),
		$content,
	);

	return $block;
}

/**
 * Renders previous/next button markup for a carousel.
 *
 * @return string The rendered previous/next buttons.
 */
function prev_next_buttons(): string {
	ob_start();
	?>
	<div
		aria-label="<?php esc_attr_e( 'Previous/next controls', 'carousel' ); ?>"
		class="wp-block-wpcomsp-carousel__prev-next"
		role="group"
	>
		<button class="wp-block-wpcomsp-carousel__prev-next-button prev">
			<span class="screen-reader-text"><?php esc_html_e( 'Previous slide', 'carousel' ); ?></span>
		</button>
		<button class="wp-block-wpcomsp-carousel__prev-next-button next">
			<span class="screen-reader-text"><?php esc_html_e( 'Next slide', 'carousel' ); ?></span>
		</button>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Renders pagination button markup for a carousel.
 *
 * @param integer $count The number of items in the carousel.
 *
 * @return string The rendered pagination buttons.
 */
function pagination_buttons( int $count ): string {
	ob_start();
	?>
	<div
		aria-label="<?php esc_attr_e( 'Slide controls', 'carousel' ); ?>"
		class="wp-block-wpcomsp-carousel__pagination"
		role="group"
	>
		<?php
		for ( $i = 0; $i < $count; $i++ ) :
			$label = sprintf(
				/* translators: 1: Current slide number, 2: Total number of slides */
				esc_html__( 'Slide %1$d of %2$d', 'carousel' ),
				$i + 1,
				$count
			);
			?>
			<button class="wp-block-wpcomsp-carousel__pagination-button">
				<span class="screen-reader-text"><?php echo esc_html( $label ); ?></span>
			</button>
		<?php endfor; ?>
	</div>
	<?php
	return ob_get_clean();
}
