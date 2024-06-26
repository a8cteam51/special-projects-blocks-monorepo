import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjustFontSize: () => (/* binding */ adjustFontSize)
/* harmony export */ });
function adjustFontSize(element, content) {
  if (element) {
    const containerWidth = element.parentElement.offsetWidth;

    // Create a temporary hidden element for measurement
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.whiteSpace = 'nowrap';
    tempElement.style.visibility = 'hidden';
    tempElement.style.fontFamily = window.getComputedStyle(element).fontFamily;
    tempElement.style.fontWeight = window.getComputedStyle(element).fontWeight;
    tempElement.style.fontStyle = window.getComputedStyle(element).fontStyle;
    tempElement.style.fontSize = window.getComputedStyle(element).fontSize; // Use the current font size for measurement
    tempElement.innerHTML = content;
    document.body.appendChild(tempElement);
    const textWidth = tempElement.offsetWidth;
    document.body.removeChild(tempElement); // Clean up the temporary element

    // Avoid division by zero or very small widths
    if (textWidth > 0) {
      const size = containerWidth / textWidth;
      element.style.fontSize = `${size * parseFloat(window.getComputedStyle(element).fontSize)}px`; // Scale based on the current font size
      element.style.whiteSpace = 'nowrap'; // Ensure text does not wrap
    }
  }
}

/***/ }),

/***/ "@wordpress/interactivity":
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
/***/ ((module) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");


const useInView = () => {
  const [inView, setInView] = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const {
      ref
    } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });
    observer.observe(ref);
    return () => ref && observer.unobserve(ref);
  }, []);
  return inView;
};
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('wpsp-stretchy-type', {
  callbacks: {
    handleResize: () => {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__.adjustFontSize)(ref, ref.innerHTML);
    },
    logInView: () => {
      const isInView = useInView();
      (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (isInView) {
          const {
            ref
          } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
          (0,_utils__WEBPACK_IMPORTED_MODULE_1__.adjustFontSize)((0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)().ref, (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)().ref.innerHTML);
        }
      });
    }
  }
});
})();


//# sourceMappingURL=view.js.map