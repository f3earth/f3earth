(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.MouseWheelZoomInteraction = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _interaction = __webpack_require__(6);

	var _const = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by zhangwenjin on 2016/7/14.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var MouseWheelZoomInteraction = exports.MouseWheelZoomInteraction = function (_Interaction) {
	    _inherits(MouseWheelZoomInteraction, _Interaction);

	    function MouseWheelZoomInteraction() {
	        _classCallCheck(this, MouseWheelZoomInteraction);

	        return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseWheelZoomInteraction).apply(this, arguments));
	    }

	    _createClass(MouseWheelZoomInteraction, [{
	        key: 'addHandle',
	        value: function addHandle() {
	            this._earth.on(_const.Const.EarthEventType.MOUSEWHEEL, this._onmousewheel, this);
	            return this;
	        }
	    }, {
	        key: 'removeHandle',
	        value: function removeHandle() {
	            this._earth.un(_const.Const.EarthEventType.MOUSEWHEEL, this._onmousewheel, this);
	            return this;
	        }
	    }, {
	        key: '_onmousewheel',
	        value: function _onmousewheel(e) {
	            var originalEvent = e.originalEvent;
	            var zoomDelta = -originalEvent.deltaY / 100;
	            var zoom = this._earth.zoom + zoomDelta;
	            this._earth.setZoom(zoom);
	        }
	    }]);

	    return MouseWheelZoomInteraction;
	}(_interaction.Interaction);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by zhangwenjin on 2016/7/16.
	 */

	var Const = function Const() {
	    _classCallCheck(this, Const);
	};

	Const.EarthEventType = {
	    ZOOM_START: 'earthZoomStart',
	    ZOOM_END: 'earthZoomEnd',
	    CLICK: 'earthClick',
	    DBLCLICK: 'earthDblclick',
	    MOUSEDOWN: 'earthMousedown',
	    MOUSEUP: 'earthMouseup',
	    MOUSEOVER: 'earthMouseover',
	    MOUSEOUT: 'earthMouseout',
	    MOUSEMOVE: 'earthMousemove',
	    MOUSEWHEEL: 'earthMousewheel',
	    KEYPRESS: 'earthKeypress'
	};
	Const.TileSourceEventType = {
	    CHANGE: 'tileSourceChange'
	};
	Const.ControlEventType = {
	    RENDER: 'controlRender'
	};
	exports.Const = Const;

/***/ },
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by zhangwenjin on 2016/7/13.
	 * @class Interaction
	 * Abstract class for earth interaction handlers
	 */

	var Interaction = exports.Interaction = function () {
	    function Interaction() {
	        _classCallCheck(this, Interaction);

	        this._earth = null;
	        this._enabled = false;
	    }

	    _createClass(Interaction, [{
	        key: "setEarth",
	        value: function setEarth(earth) {
	            this._earth = earth;
	            return this;
	        }
	    }, {
	        key: "getEarth",
	        value: function getEarth() {
	            return this._earth;
	        }
	    }, {
	        key: "enable",
	        value: function enable() {
	            if (this._enabled) {
	                return this;
	            }
	            this._enabled = true;
	            this.addHandle();
	            return this;
	        }
	    }, {
	        key: "disable",
	        value: function disable() {
	            if (!this._enabled) {
	                return this;
	            }

	            this._enabled = false;
	            this.removeHandle();
	            return this;
	        }
	    }, {
	        key: "enabled",
	        value: function enabled() {
	            return !!this._enabled;
	        }
	    }]);

	    return Interaction;
	}();

/***/ }
/******/ ])
});
;