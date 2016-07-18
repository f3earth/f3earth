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
	exports.Control = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _observable = __webpack_require__(1);

	var _const = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Control = exports.Control = function (_Observable) {
	    _inherits(Control, _Observable);

	    function Control(element) {
	        _classCallCheck(this, Control);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Control).call(this));

	        _this._element = element;
	        _this._earth = null;
	        return _this;
	    }

	    _createClass(Control, [{
	        key: 'setEarth',
	        value: function setEarth(earth) {
	            this._earth = earth;
	            if (earth) {
	                this._earth.on('rendered', this.render, this);
	            }
	            return this;
	        }
	    }, {
	        key: 'render',
	        value: function render(camera) {
	            this.trigger(_const.Const.ControlEventType, camera);
	            console.log(camera);
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            this._earth.un('rendered', this.render, this);
	            this.element.parentNode.removeChild(this._element);
	            this._earth = null;
	        }
	    }, {
	        key: 'earth',
	        get: function get() {
	            return this._earth;
	        }
	    }, {
	        key: 'element',
	        get: function get() {
	            return this._element;
	        }
	    }]);

	    return Control;
	}(_observable.Observable);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Methods mixed in to other classes for observe capabilities.
	 * @mixin Observable
	 */

	var Observable = exports.Observable = function () {
	    function Observable() {
	        _classCallCheck(this, Observable);
	    }

	    _createClass(Observable, [{
	        key: "on",

	        /**
	         * Subscribe to a specified observe with a listener function
	         * the latter gets the data object that was passed to `fire`
	         * and additionally `target` and `type` properties
	         *
	         * @param {string} type Observable type
	         * @param {Function} listener Function to be called when the event is fired
	         * @returns {Object} `this`
	         */
	        value: function on(type, listener, thisObj) {
	            this._listens = this._listens || {};
	            this._listens[type] = this._listens[type] || [];
	            var newListener = { fn: listener, ctx: thisObj };
	            this._listens[type].push(newListener);
	            return this;
	        }

	        /**
	         * Remove a observe listener
	         *
	         * @param {string} [type] Observable type. If none is specified, remove all listeners
	         * @param {Function} [listener] Function to be called when the observe is trigger.
	         * If none is specified all listeners are removed
	         * @returns {Object} `this`
	         */

	    }, {
	        key: "un",
	        value: function un(type, listener, thisObj) {
	            if (!type) {
	                return this;
	            }
	            if (!this.hasListens(type)) return this;
	            for (var i = 0, len = this._listens[type].length; i < len; i++) {
	                var l = this._listens[type][i];
	                if (len > 1) {
	                    if (l.fn === listener) {
	                        this._listens[type].splice(i, 1);
	                        break;
	                    }
	                } else {
	                    delete this._listens[type];
	                }
	            }

	            return this;
	        }
	    }, {
	        key: "unAll",
	        value: function unAll() {
	            delete this._listens;
	            return this;
	        }
	        /**
	         * Call a function once when an observe has trigger
	         *
	         * @param {string} type Observable type.
	         * @param {Function} listener Function to be called once when the event is trigger
	         * @returns {Object} `this`
	         */

	    }, {
	        key: "once",
	        value: function once(type, listener, thisObj) {
	            var _this = this;

	            var wrapper = function wrapper() {
	                _this.un(type, listener, thisObj);
	                _this.un(type, wrapper, thisObj);
	            };
	            return this.on(type, listener, thisObj).on(type, wrapper, thisObj);
	        }

	        /**
	         * trigger observe of a given string eventType with the given data object
	         *
	         * @param {string} eventType Observable eventType
	         * @param {Object} [data] Optional data passed to the event receiver (e.g. {@link event})
	         * @returns {Object} `this`
	         */

	    }, {
	        key: "trigger",
	        value: function trigger(eventType, data) {
	            var _this2 = this;

	            if (!this.hasListens(eventType)) return this;
	            var event = {};
	            Object.assign(event, data);
	            Object.assign(event, { type: eventType, target: this });

	            // make sure adding/removing listeners inside other listeners won't cause infinite loop
	            var listeners = this._listens[eventType].slice();
	            listeners.forEach(function (l) {
	                return l.fn.call(l.ctx || _this2, event);
	            });
	            return this;
	        }

	        /**
	         * Check if an observe is registered to a type
	         * @param {string} type Observable type
	         * @returns {boolean} `true`
	         *  if there is at least one registered listener for events of type `type`
	         */

	    }, {
	        key: "hasListens",
	        value: function hasListens(type) {
	            return !!(this._listens && this._listens[type]);
	        }
	    }]);

	    return Observable;
	}();

/***/ },
/* 2 */
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

/***/ }
/******/ ])
});
;