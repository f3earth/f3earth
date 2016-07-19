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
	exports.AttributionControl = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _control = __webpack_require__(1);

	var _domEvent = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AttributionControl = exports.AttributionControl = function (_Control) {
	    _inherits(AttributionControl, _Control);

	    function AttributionControl() {
	        _classCallCheck(this, AttributionControl);

	        var ele = document.createElement('a');
	        ele.innerText = 'this is attribution';
	        ele.href = '#';
	        ele.style = 'display:block;\n            width:160px;\n            height:30px;\n            line-height:30px;\n            text-align:center;\n            background-color:#60F;\n            color:white;\n            margin-top:5px;\n            text-decoration:none;\n            position:absolute;\n\t\t\ttop:100;\n\t\t\tright:0;';
	        document.body.appendChild(ele);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AttributionControl).call(this, ele));

	        _domEvent.DomEvent.on(_this.element, 'click', _this._clickHandler, _this);
	        return _this;
	    }

	    _createClass(AttributionControl, [{
	        key: '_clickHandler',
	        value: function _clickHandler(e) {
	            e.preventDefault();
	            e.stopPropagation();
	            window.open('https://github.com/f3earth/f3earth');
	        }
	    }]);

	    return AttributionControl;
	}(_control.Control);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Control = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _observable = __webpack_require__(2);

	var _const = __webpack_require__(3);

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
/* 2 */
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

	Const.SourceEventType = {
	    CHANGE: 'sourceChange'
	};

	Const.ControlEventType = {
	    RENDER: 'controlRender'
	};

	Const.LayerType = {
	    LINE: 'line',
	    RASTER_TILE: 'rasterTile'
	};

	Const.SourceType = {
	    LINE: 'line'
	};

	exports.Const = Const;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DomEvent = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by zhangwenjin on 2016/7/13.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _util = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DomEvent = exports.DomEvent = function () {
	    function DomEvent() {
	        _classCallCheck(this, DomEvent);
	    }

	    _createClass(DomEvent, null, [{
	        key: 'on',

	        /**
	         * @function on(obj: HTMLElement, types: [], fn: Function, context?: Object): this
	         * Adds a listener function (`fn`) to a particular DOM event type of the
	         * element `obj`. You can optionally specify the context of the listener
	         * (object the `this` keyword will point to).
	         * space-separated types (e.g. `'click dblclick'`).
	        */
	        value: function on(obj, types, fn, context) {
	            var _this = this;

	            var typesArray = types;
	            if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) !== 'object') {
	                typesArray = _util.Util.splitWords(types);
	            }
	            typesArray.forEach(function (type) {
	                _this._on(obj, type, fn, context);
	            });
	            return this;
	        }
	        /**
	         * @function un(obj: HTMLElement, types: [], fn: Function, context?: Object): this
	         * Removes a previously added listener function. If no function is specified,
	         * it will remove all the listeners of that particular DOM event from the element.
	         * Note that if you passed a custom context to on, you must pass the same
	         * context to `un` in order to remove the listener.
	         */
	        /** now no need to use this method,so not suppot this function
	        * static un(obj, types, fn, context) {
	        *    types.forEach(type => this._un(obj, type, fn, context));
	        *    return this;
	        * }
	        */

	    }, {
	        key: '_on',
	        value: function _on(obj, type, fn, context) {
	            var self = this;
	            var handler = function handler(e) {
	                return fn.call(context || obj, e || window.event);
	            };

	            var originalHandler = handler;

	            if ('addEventListener' in obj) {
	                if (type === 'mousewheel') {
	                    obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);
	                } else if (type === 'mouseenter' || type === 'mouseleave') {
	                    handler = function handler(e) {
	                        var event = e || window.event;
	                        if (self._isExternalTarget(obj, event)) {
	                            originalHandler(event);
	                        }
	                    };
	                    obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);
	                } else {
	                    obj.addEventListener(type, handler, false);
	                }
	            } else if ('attachEvent' in obj) {
	                obj.attachEvent('on' + type, handler);
	            }
	            return this;
	        }

	        // static _un(obj, type, fn, context) {
	        //     if ('removeEventListener' in obj) {
	        //         if (type === 'mousewheel') {
	        //             obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', fn, false);
	        //         } else {
	        //             let eventType = type;
	        //             if (type === 'mouseenter') {
	        //                 eventType = 'mouseover';
	        //             } else if (type === 'mouseleave') {
	        //                 eventType = 'mouseout';
	        //             }
	        //             obj.removeEventListener(
	        //                 eventType, fn, false);
	        //         }
	        //     } else if ('detachEvent' in obj) {
	        //         obj.detachEvent(`on${type}`, fn);
	        //     }
	        //     return this;
	        // }

	        /**
	         * check if element really left/entered the event target (for mouseenter/mouseleave)
	         */

	    }, {
	        key: '_isExternalTarget',
	        value: function _isExternalTarget(el, e) {
	            var related = e.relatedTarget;

	            if (!related) {
	                return true;
	            }

	            try {
	                while (related && related !== el) {
	                    related = related.parentNode;
	                }
	            } catch (err) {
	                return false;
	            }
	            return related !== el;
	        }
	    }]);

	    return DomEvent;
	}();

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by zhangwenjin on 2016/7/18.
	 */

	var Util = exports.Util = function () {
	    function Util() {
	        _classCallCheck(this, Util);
	    }

	    _createClass(Util, null, [{
	        key: 'trim',
	        value: function trim(str) {
	            return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	        }
	    }, {
	        key: 'splitWords',
	        value: function splitWords(str) {
	            return Util.trim(str).split(/\s+/);
	        }
	    }]);

	    return Util;
	}();

/***/ }
/******/ ])
});
;