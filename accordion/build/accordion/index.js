(()=>{"use strict";var e,o={865:()=>{const e=window.wp.blocks,o=window.React;function t(e){var o,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e)){var l=e.length;for(o=0;o<l;o++)e[o]&&(n=t(e[o]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}const n=function(){for(var e,o,n=0,r="",l=arguments.length;n<l;n++)(e=arguments[n])&&(o=t(e))&&(r&&(r+=" "),r+=o);return r},r=window.wp.blockEditor,l=window.wp.i18n,i=window.wp.components,a=[["wpsp/accordion-item",{}]],c=JSON.parse('{"UU":"wpsp/accordion"}');(0,e.registerBlockType)(c.UU,{edit:function({attributes:e,setAttributes:t}){const{allowedBlocks:c,iconPosition:s}=e,p=n({"icon-position-left":"left"===s});return(0,o.createElement)(o.Fragment,null,(0,o.createElement)(r.InspectorControls,{key:"setting"},(0,o.createElement)(i.PanelBody,null,(0,o.createElement)(i.PanelRow,null,(0,o.createElement)(i.__experimentalToggleGroupControl,{__nextHasNoMarginBottom:!0,isBlock:!0,label:(0,l.__)("Icon Position"),value:s,onChange:e=>{t({iconPosition:e})}},(0,o.createElement)(i.__experimentalToggleGroupControlOption,{label:"Left",value:"left"}),(0,o.createElement)(i.__experimentalToggleGroupControlOption,{label:"Right",value:"right"}))))),(0,o.createElement)("div",{...(0,r.useBlockProps)({className:p})},(0,o.createElement)(r.InnerBlocks,{allowedBlocks:c,renderAppender:r.InnerBlocks.DefaultBlockAppender,template:a})))},save:function({attributes:e}){const{iconPosition:t}=e,l=n({"icon-position-left":"left"===t});return(0,o.createElement)("div",{...r.useBlockProps.save({className:l})},(0,o.createElement)(r.InnerBlocks.Content,null))}})}},t={};function n(e){var r=t[e];if(void 0!==r)return r.exports;var l=t[e]={exports:{}};return o[e](l,l.exports,n),l.exports}n.m=o,e=[],n.O=(o,t,r,l)=>{if(!t){var i=1/0;for(p=0;p<e.length;p++){for(var[t,r,l]=e[p],a=!0,c=0;c<t.length;c++)(!1&l||i>=l)&&Object.keys(n.O).every((e=>n.O[e](t[c])))?t.splice(c--,1):(a=!1,l<i&&(i=l));if(a){e.splice(p--,1);var s=r();void 0!==s&&(o=s)}}return o}l=l||0;for(var p=e.length;p>0&&e[p-1][2]>l;p--)e[p]=e[p-1];e[p]=[t,r,l]},n.o=(e,o)=>Object.prototype.hasOwnProperty.call(e,o),(()=>{var e={170:0,246:0};n.O.j=o=>0===e[o];var o=(o,t)=>{var r,l,[i,a,c]=t,s=0;if(i.some((o=>0!==e[o]))){for(r in a)n.o(a,r)&&(n.m[r]=a[r]);if(c)var p=c(n)}for(o&&o(t);s<i.length;s++)l=i[s],n.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return n.O(p)},t=globalThis.webpackChunkaccordion=globalThis.webpackChunkaccordion||[];t.forEach(o.bind(null,0)),t.push=o.bind(null,t.push.bind(t))})();var r=n.O(void 0,[246],(()=>n(865)));r=n.O(r)})();