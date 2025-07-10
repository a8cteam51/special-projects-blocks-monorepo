<?php
/**
 * HTML Tag Processor
 *
 * @package wpcomsp
 */

/**
 * HTML Tag Processor
 *
 * This class extends the WP_HTML_Tag_Processor class to provide additional
 * methods for processing HTML content.
 */
class WPCOMSP_HTML_Tag_Processor extends WP_HTML_Tag_Processor {

	/**
	 * Replace the opener tag of a balanced tag with a new string.
	 *
	 * This method replaces the opener tag of a balanced tag with the provided
	 * replacement string. It uses bookmarks to track the position of the opener
	 * tag and updates the lexical updates accordingly.
	 *
	 * @param string $replacement The string to replace the opener tag with.
	 *
	 * @return boolean True on success, false on failure.
	 */
	public function replace_tag( $replacement ) {

		if ( ! $this->set_bookmark( 'opener_tag_of_balanced_tag' ) ) {
			return false;
		}

		$start  = $this->bookmarks['opener_tag_of_balanced_tag']->start;
		$length = $this->bookmarks['opener_tag_of_balanced_tag']->length;
		$this->release_bookmark( 'opener_tag_of_balanced_tag' );

		$this->lexical_updates[] = new WP_HTML_Text_Replacement( $start, $length, $replacement );
		return true;
	}
}
