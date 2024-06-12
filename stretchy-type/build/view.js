/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
console.log('Hello World! (from wpsp-stretchy-type block)');
/* eslint-enable no-console */

// Set the font size of the element to take up 100% of the width of its container

function handleFontSize() {
  const elements = document.querySelectorAll('.wp-block-wpsp-stretchy-type');
  elements.forEach(element => {
    const containerWidth = 200; // Get the container's width
    const characters = element.innerHTML.length; // Get the number of characters
    const size = containerWidth / characters; // Calculate the font size based on container width and characters
    element.style.fontSize = `${size}vw`; // Set the font size in pixels
  });
}
document.addEventListener('DOMContentLoaded', handleFontSize);
// resize the font when the window is resized
document.addEventListener('resize', handleFontSize);
/******/ })()
;
//# sourceMappingURL=view.js.map