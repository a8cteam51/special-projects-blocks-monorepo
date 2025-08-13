=== Modal ===
Contributors:      The WordPress Contributors
Tags:              block
Tested up to:      6.6
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A Modal block using the Interactivity API

== Description ==

This modal block adds the ability to create a modal to any post / page or navigation.

Features:

- A modal section under Patterns > Modal where the site user can create as many modals as they like and add any custom block into the modal. 
- To create a new modal, go to Patterns > Add New Pattern > Add new Template Part then choose the `Modal` category.
- Every modal window has a label and description setting that is updated via the options API so they are consistent accross all instances of the modal.
- The modal should close when: The escape key is pressed, the close button is pressed or when clicking outside the modal
- Once the modal is open the focasable element should gain focus. Otherwise the close button should gain focus.
- When the modal is closed, the originally clicked button should gain focus.
- The modal button can be placed inside another modal to trigger the new modal. The focus will return to the button that was originally clicked to open a modal when the second modal is closed.


== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/modal` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


== Frequently Asked Questions ==

= A question that someone might have =

An answer to that question.


== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 0.1.0 =
* Release

