<?php

namespace A8CSP;

/**
 * Class BuddyPress_Breadcrumbs
 *
 * Handles the generation and management of breadcrumbs for BuddyPress pages.
 *
 * @package A8CSP
 */
class BuddyPress_Breadcrumbs {

	/**
	 * Array of breadcrumb items.
	 *
	 * Each breadcrumb item is an associative array with the following keys:
	 * - 'link' (string): The URL of the breadcrumb.
	 * - 'label' (string): The label of the breadcrumb.
	 * - 'current' (bool): Whether the breadcrumb is the current page.
	 *
	 * @var array
	 */
	private static $crumbs = array();

	/**
	 * Get the array of breadcrumb items.
	 *
	 * If the breadcrumbs have not been built yet, this method will build them.
	 *
	 * @return array Array of breadcrumb items.
	 */
	public static function get_crumbs(): array {
		if ( empty( self::$crumbs ) ) {
			self::build_crumbs();
		}

		return self::$crumbs;
	}

	/**
	 * Add a breadcrumb item to the list.
	 *
	 * @param string  $link    The URL of the breadcrumb.
	 * @param string  $label   The label of the breadcrumb.
	 * @param boolean $current Whether the breadcrumb is the current page. Default false.
	 *
	 * @return void
	 */
	public static function add_crumb( string $link, string $label, bool $current = false ): void {
		self::$crumbs[] = array(
			'link'    => esc_url_raw( untrailingslashit( $link ) ),
			'label'   => sanitize_text_field( $label ),
			'current' => $current,
		);
	}

	/**
	 * Build the breadcrumbs for the current BuddyPress context.
	 *
	 * This method determines the current BuddyPress page and adds the appropriate breadcrumbs.
	 *
	 * @return void
	 */
	public static function build_crumbs(): void {
		if ( ! is_buddypress() ) {
			return;
		}

		switch ( true ) {
			case bp_is_activity_directory():
				self::set_activity_page();
				break;
			case bp_is_groups_directory():
				self::set_groups_page();
				break;
			case bp_is_group():
				self::set_group_page();
				break;
			case bp_is_members_directory():
				self::set_members_page( true );
				break;
			case bp_is_user():
				self::set_user_page();
				break;
			case bp_is_group_create():
				self::set_group_create_page();
				break;
		}
	}

	/**
	 * Set the breadcrumb for the Groups directory page.
	 *
	 * @return void
	 */
	private static function set_groups_page(): void {
		self::add_crumb( bp_get_groups_directory_url(), bp_get_directory_title( 'groups' ), true );
	}

	/**
	 * Set the breadcrumb for a user's profile page.
	 *
	 * Adds breadcrumbs for the Members directory and the displayed user's profile.
	 *
	 * @return void
	 */
	private static function set_user_page(): void {
		$user_id = buddypress()->displayed_user->id;
		$user    = get_userdata( $user_id );
		self::set_members_page();
		self::add_crumb( bp_displayed_user_url(), $user->display_name, true );
	}

	/**
	 * Set the breadcrumb for the Create Group page.
	 *
	 * @return void
	 */
	private static function set_group_create_page(): void {
		self::add_crumb( trailingslashit( bp_get_groups_directory_url() . 'create' ), 'Create Group', true );
	}

	/**
	 * Set the breadcrumb for a specific group page.
	 *
	 * @return void
	 */
	private static function set_group_page(): void {
		$group_id = bp_get_current_group_id();
		$group    = groups_get_group( $group_id );
		self::add_crumb( bp_get_groups_directory_url(), bp_get_directory_title( 'groups' ), false );
		self::add_crumb( bp_get_group_url( $group_id ), $group->name, true );
	}

	/**
	 * Set the breadcrumb for the Members directory page.
	 *
	 * @param boolean $current_page Whether this is the current page. Default false.
	 *
	 * @return void
	 */
	private static function set_members_page( $current_page = false ): void {
		self::add_crumb( bp_get_members_directory_permalink(), bp_get_directory_title( 'members' ), $current_page );
	}

	/**
	 * Set the breadcrumb for the Activity directory page.
	 *
	 * @return void
	 */
	private static function set_activity_page(): void {
		self::add_crumb( bp_get_activity_directory_permalink(), 'Activity', true );
	}
}
