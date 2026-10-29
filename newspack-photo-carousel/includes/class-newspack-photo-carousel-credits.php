<?php
/**
 * Newspack Photo Carousel: photo credits from the Newspack plugin.
 *
 * Loaded by newspack_photo_carousel_load_credits() only while the Newspack
 * plugin is active.
 *
 * @package wpcomsp
 */

defined( 'ABSPATH' ) || exit;

/**
 * Adds Newspack's photo credit to each slide, the editor's credit box (the
 * build/credits script), and the REST permission that box needs.
 */
final class Newspack_Photo_Carousel_Credits {
	/**
	 * Newspack's image credits class.
	 */
	const NEWSPACK_CREDITS = 'Newspack\Newspack_Image_Credits';

	/**
	 * Newspack's attachment meta keys edited by the credit box.
	 */
	const META_KEYS = array( '_media_credit', '_media_credit_url', '_navis_media_credit_org' );

	/**
	 * The editor script's handle.
	 */
	const SCRIPT_HANDLE = 'newspack-photo-carousel-credits';

	/**
	 * The single instance of the class.
	 *
	 * @var Newspack_Photo_Carousel_Credits|null
	 */
	protected static $instance = null;

	/**
	 * Main instance.
	 *
	 * @return Newspack_Photo_Carousel_Credits
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		// Newspack registers the keys without an auth_callback, so core falls
		// back to __return_false for these protected keys and REST rejects the
		// write. Newspack's own Media Library save path requires this capability.
		foreach ( self::META_KEYS as $key ) {
			add_filter( "auth_post_meta_{$key}_for_attachment", array( __CLASS__, 'can_edit_attachment' ), 20, 4 );
		}

		// Priority 5, so a site's own filter at the default priority sees Newspack's markup.
		add_filter( 'newspack_photo_carousel_slide_credit', array( __CLASS__, 'filter_slide_credit' ), 5, 3 );
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_editor_assets' ) );
	}

	/**
	 * Meta auth callback: the user can edit the attachment.
	 *
	 * @param boolean $allowed  Whether the user can edit the meta key.
	 * @param string  $meta_key The meta key.
	 * @param integer $post_id  The attachment ID.
	 * @param integer $user_id  The user ID.
	 *
	 * @return boolean
	 */
	public static function can_edit_attachment( $allowed, $meta_key, $post_id, $user_id ) {
		return user_can( $user_id, 'edit_post', $post_id );
	}

	/**
	 * Fills an empty slide credit with Newspack's markup.
	 *
	 * Mirrors Newspack's own image block credit: the attachment's credit first,
	 * then one stored on the block's `meta` attribute.
	 *
	 * @param string               $html          Credit markup so far.
	 * @param integer              $attachment_id The slide's attachment ID.
	 * @param array<string, mixed> $parsed_block  The slide's parsed core/image block.
	 *
	 * @return string
	 */
	public static function filter_slide_credit( $html, $attachment_id, $parsed_block ) {
		if ( '' !== $html || 0 === $attachment_id ) {
			return $html;
		}

		$credits    = self::NEWSPACK_CREDITS;
		$block_meta = $parsed_block['attrs']['meta'] ?? array();
		$html       = (string) $credits::get_media_credit_string( $attachment_id );

		if ( '' === $html && is_array( $block_meta ) && ! empty( $block_meta['_media_credit'] ) ) {
			$html = (string) $credits::get_media_credit_string( $attachment_id, $block_meta );
		}

		return $html;
	}

	/**
	 * Enqueues the editor's credit box and passes it Newspack's credit
	 * settings, so its preview matches Newspack's markup.
	 *
	 * @return void
	 */
	public static function enqueue_editor_assets() {
		$plugin_file = dirname( __DIR__ ) . '/newspack-photo-carousel.php';
		$asset_file  = dirname( __DIR__ ) . '/build/credits/index.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;
		wp_enqueue_script(
			self::SCRIPT_HANDLE,
			plugins_url( 'build/credits/index.js', $plugin_file ),
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_set_script_translations( self::SCRIPT_HANDLE, 'newspack-photo-carousel' );

		$settings = array(
			'prefixLabel' => '',
			'className'   => 'image-credit',
		);

		if ( method_exists( self::NEWSPACK_CREDITS, 'get_settings' ) ) {
			$credits                 = self::NEWSPACK_CREDITS;
			$settings['prefixLabel'] = (string) $credits::get_settings( 'newspack_image_credits_prefix_label' );
			$settings['className']   = (string) $credits::get_settings( 'newspack_image_credits_class_name' );
		}

		wp_add_inline_script(
			self::SCRIPT_HANDLE,
			'window.newspackPhotoCarousel = ' . wp_json_encode( array( 'credits' => $settings ) ) . ';',
			'before'
		);
	}
}
