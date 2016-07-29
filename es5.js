module.exports = 
/******/ (function(modules) { // webpackBootstrap
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

	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.Box = __webpack_require__(2);
	exports.Reflection = __webpack_require__(4);
	exports.BoxReflection = __webpack_require__(19);
	exports.Connection = __webpack_require__(13);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Definition = __webpack_require__(3);
	var Definitions = __webpack_require__(8);
	var Factory = __webpack_require__(9);

	var Reflection = __webpack_require__(4);
	var Connections = __webpack_require__(12);

	var Connector = __webpack_require__(14);
	var Accessor = __webpack_require__(20);
	var BoxReflection = __webpack_require__(19);

	module.exports = function () {
	    function Box() {
	        _classCallCheck(this, Box);

	        this._definitions = new Definitions();
	        this._connections = new Connections();
	        this._factory = new Factory();
	        this._contextValue = undefined;
	        this._names = new Map();

	        BoxReflection.addName(this, 'self');
	    }

	    _createClass(Box, [{
	        key: 'add',
	        value: function add(name, definition, dependencies) {
	            this.remove(name);

	            if (definition instanceof Box) {
	                BoxReflection.addBox({
	                    box: this,
	                    name: name,
	                    child: definition,
	                    dependencies: dependencies
	                });
	            } else {
	                this._definitions.add(name, Definition.create(name, definition, dependencies));
	            }

	            BoxReflection.addName(this, name);

	            return this;
	        }
	    }, {
	        key: 'get',
	        value: function get(name) {
	            if (name === 'self') {
	                return this;
	            }

	            if (Accessor.isPath(name)) {
	                return Accessor.path(name)(this);
	            }

	            if (!this._definitions.isResolved(name)) {
	                this._definitions.resolve(name, this.create(name));
	            }

	            if (this._connections.has(name)) {
	                this._connections.get(name).init(this);
	                return this._connections.get(name).getState();
	            }

	            return this._definitions.getResolved(name);
	        }
	    }, {
	        key: 'remove',
	        value: function remove(name) {

	            if (this._definitions.has(name)) {
	                this._definitions.remove(name);
	            }

	            if (this._connections.has(name)) {
	                this._connections.remove(name);
	            }
	        }
	    }, {
	        key: 'keys',
	        value: function keys() {
	            return this._definitions.keys().concat(this._connections.keys());
	        }

	        //@@ re-think, should it be public?

	    }, {
	        key: 'create',
	        value: function create(name) {
	            if (this._definitions.isDefinition(name)) {
	                return this._factory.create(this, this._definitions.get(name));
	            } else {
	                return BoxReflection.clone(this);
	            }
	        }
	    }, {
	        key: 'connect',
	        value: function connect(name, service) {
	            return Connector.connect({
	                box: this,
	                name: name,
	                service: service
	            });
	        }
	    }, {
	        key: 'context',
	        value: function context() {
	            var _this = this;

	            var map = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	            if (!map && this._contextValue) {
	                return this._contextValue;
	            }

	            var _map = map || {};
	            _map['self'] = function () {
	                return _this;
	            };

	            var names = this.keys().concat(Reflection.keys(_map));
	            names = Reflection.uniqueArray(names);

	            var context = Reflection.defineNames({}, names, function (name) {
	                var _name = _map[name] || name;

	                if (Reflection.isFunction(_name)) {
	                    return _name(_this.context());
	                }

	                return _this.get(_name);
	            });

	            if (!map) {
	                this._contextValue = context;
	            }

	            return context;
	        }
	    }], [{
	        key: 'create',
	        value: function create() {
	            return new Box();
	        }
	    }]);

	    return Box;
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Reflection = __webpack_require__(4);
	var Observer = __webpack_require__(5);
	var ObjectObserver = __webpack_require__(6);
	var FunctionObserver = __webpack_require__(7);
	// let Box = require('../Box');

	module.exports = function () {
	    function Definition(name, definition, dependencies) {
	        _classCallCheck(this, Definition);

	        this.name = name;
	        this.definition = definition;
	        this.dependencies = dependencies;

	        this.reset();
	    }

	    _createClass(Definition, [{
	        key: 'setMeta',
	        value: function setMeta() {
	            var meta = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            this.meta = this.meta || {};
	            Reflection.merge(this.meta, meta);
	        }
	    }, {
	        key: 'getMeta',
	        value: function getMeta() {
	            this.setMeta();
	            return this.meta;
	        }
	    }, {
	        key: 'getName',
	        value: function getName() {
	            return this.name;
	        }
	    }, {
	        key: 'getValue',
	        value: function getValue() {
	            return this.value;
	        }
	    }, {
	        key: 'isResolved',
	        value: function isResolved() {
	            return this.resolved;
	        }
	    }, {
	        key: 'resolve',
	        value: function resolve(value) {
	            var _this = this;

	            this.originValue = value;
	            this.value = value;

	            if (this.isConnected()) {
	                if (Reflection.isPureObject(value)) {
	                    this.value = ObjectObserver(value, function (payload) {
	                        return _this.observer.notify(payload);
	                    });
	                } else if (Reflection.isFunction(value)) {
	                    this.value = FunctionObserver(value, {}, function (payload) {
	                        return _this.observer.notify(payload);
	                    });
	                }
	            }

	            this.resolved = true;
	        }
	    }, {
	        key: 'getOriginValue',
	        value: function getOriginValue() {
	            return this.originValue;
	        }
	    }, {
	        key: 'getResolved',
	        value: function getResolved() {
	            return this.value;
	        }
	    }, {
	        key: 'getDependencies',
	        value: function getDependencies() {
	            return this.dependencies;
	        }
	    }, {
	        key: 'getDefinition',
	        value: function getDefinition() {
	            return this.definition;
	        }
	    }, {
	        key: 'subscribe',
	        value: function subscribe(observer) {
	            if (!this.isConnected() && this.isResolved()) {
	                this.connected = true;
	                this.resolve(this.getValue());
	            }

	            this.connected = true;
	            this.observer = this.observer || new Observer();
	            this.observer.subscribe(observer);
	        }
	    }, {
	        key: 'isConnected',
	        value: function isConnected() {
	            return this.connected;
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.resolved = false;
	            this.value = undefined;
	            this.originValue = undefined;
	            this.observer = undefined;
	            this.connected = false;
	            this.meta = undefined;
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Definition(this.name, this.definition, this.dependencies);
	        }
	    }], [{
	        key: 'create',
	        value: function create(name, definition, dependencies) {
	            if (Reflection.isFunction(definition)) {
	                return new Definition(name, definition, dependencies);
	            } else if (definition instanceof Definition) {
	                return definition;
	            } else if (Reflection.isPureObject(definition)) {
	                var _definition = new Definition(name, definition, dependencies);
	                _definition.resolve(definition);
	                return _definition;
	            } else {
	                return definition;
	            }
	        }
	    }]);

	    return Definition;
	}();

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = function () {
	    function Reflection() {
	        _classCallCheck(this, Reflection);
	    }

	    _createClass(Reflection, null, [{
	        key: 'isPureObject',
	        value: function isPureObject(object) {
	            return this.isObject(object) && !this.isFunction(object) && !this.isArray(object);
	        }
	    }, {
	        key: 'isArray',
	        value: function isArray(object) {
	            return Array.isArray(object);
	        }
	    }, {
	        key: 'isObject',
	        value: function isObject(object) {
	            return object instanceof Object;
	        }
	    }, {
	        key: 'isClass',
	        value: function isClass(object) {
	            return this.isFunction(object) && (/^\s*class\s+/.test(object.toString()) || /_classCallCheck/igm.test(object.toString()));
	        }
	    }, {
	        key: 'isFunction',
	        value: function isFunction(object) {
	            return object instanceof Function;
	        }
	    }, {
	        key: 'isPromise',
	        value: function isPromise(object) {
	            return object instanceof Promise || this.isObject(object) && Reflection.isFunction(object.then) && Reflection.catch(object.then);
	        }
	    }, {
	        key: 'isString',
	        value: function isString(object) {
	            return typeof object === 'string';
	        }
	    }, {
	        key: 'getNames',
	        value: function getNames(object) {
	            return this.getPropertyNames(object).concat(this.getMethodNames(object));
	        }
	    }, {
	        key: 'getMethodNames',
	        value: function getMethodNames(object) {
	            var prototype = this.getPrototype(object);

	            if (prototype == Object.prototype) {
	                return [];
	            }
	            return Object.getOwnPropertyNames(prototype);
	        }
	    }, {
	        key: 'getPrototype',
	        value: function getPrototype(object) {
	            return Object.getPrototypeOf(object);
	        }
	    }, {
	        key: 'getPropertyNames',
	        value: function getPropertyNames(object) {
	            return this.keys(object);
	        }
	    }, {
	        key: 'keys',
	        value: function keys(object) {
	            return Object.keys(object);
	        }
	    }, {
	        key: 'defineName',
	        value: function defineName(context, name) {
	            var onGet = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	            var onSet = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	            var hidden = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

	            var description = {};

	            if (onGet) {
	                description.get = function () {
	                    return onGet(name);
	                };
	            }

	            if (onSet) {
	                description.set = function (value) {
	                    return onSet(name, value);
	                };
	            }

	            if (hidden) {
	                description.configurable = true;
	                description.enumerable = false;
	            }

	            Object.defineProperty(context, name, description);
	        }
	    }, {
	        key: 'defineNames',
	        value: function defineNames(context, names) {
	            var _this = this;

	            var onGet = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	            var onSet = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	            names.forEach(function (name) {
	                _this.defineName(context, name, onGet, onSet);
	            });
	            return context;
	        }
	    }, {
	        key: 'iteratorToArray',
	        value: function iteratorToArray(iterator) {
	            var result = [];
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = iterator[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var item = _step.value;

	                    result.push(item);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }

	            return result;
	        }
	    }, {
	        key: 'clone',
	        value: function clone(object) {
	            if (this.isObject(object)) {
	                var _clone = function _clone() {
	                    return this;
	                };

	                _clone.prototype = object;
	                return new _clone();
	            }

	            return object;
	        }
	    }, {
	        key: 'constructCreator',
	        value: function constructCreator(_class, args) {
	            var _a = args;

	            var a = args.map(function (value, idx) {
	                return '_a[' + idx + ']';
	            }).join(', ');

	            return function () {
	                //@@ improve with reflect if possible in the env
	                return eval('new _class(' + a + ')');
	            };
	        }
	    }, {
	        key: 'uniqueArray',
	        value: function uniqueArray(names) {
	            return [].concat(_toConsumableArray(new Set(names)));
	        }
	    }, {
	        key: 'merge',
	        value: function merge(subject) {
	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            args.forEach(function (arg) {
	                for (var i in arg) {
	                    subject[i] = arg[i];
	                }
	            });
	            return subject;
	        }
	    }]);

	    return Reflection;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Reflection = __webpack_require__(4);

	module.exports = function () {
	    function Observer() {
	        _classCallCheck(this, Observer);

	        this.observers = [];
	    }

	    _createClass(Observer, [{
	        key: 'subscribe',
	        value: function subscribe(observer) {
	            this.observers.push(observer);
	        }
	    }, {
	        key: 'unsubscribe',
	        value: function unsubscribe(observer) {
	            var idx = this.observers.indexOf(observer);
	            if (idx >= 0) {
	                this.observers.splice(idx, 1);
	            }
	        }
	    }, {
	        key: 'notify',
	        value: function notify() {
	            var _this = this;

	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }

	            this.observers.forEach(function (observer) {
	                return observer.apply(_this, args);
	            });
	        }
	    }], [{
	        key: 'notifier',
	        value: function notifier(defaults) {
	            return function () {
	                var observer = arguments.length <= 0 || arguments[0] === undefined ? function () {
	                    return null;
	                } : arguments[0];

	                var notify = function notify(updates) {
	                    return !notify.locked && observer(Reflection.merge({}, defaults, updates));
	                };

	                return notify;
	            };
	        }
	    }]);

	    return Observer;
	}();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflection = __webpack_require__(4);
	var FunctionObserver = __webpack_require__(7);
	var Observer = __webpack_require__(5);

	module.exports = function (origin) {
	    var observer = arguments.length <= 1 || arguments[1] === undefined ? function () {
	        return null;
	    } : arguments[1];

	    var wrapper = Reflection.clone(origin);
	    var methodsMap = new Map();

	    var notify = Observer.notifier({ origin: origin })(observer);

	    Reflection.defineNames(wrapper, Reflection.getNames(origin), function (name) {
	        var value = origin[name];

	        if (Reflection.isFunction(value)) {
	            if (!methodsMap.has(name)) {
	                methodsMap.set(name, FunctionObserver(value, wrapper, notify));
	            }

	            return methodsMap.get(name);
	        }

	        return value;
	    }, function (name, value) {
	        var isChanged = origin[name] !== value;

	        origin[name] = value;

	        isChanged && notify({
	            type: 'SET',
	            name: name,
	            value: value,
	            wrapper: wrapper
	        });
	    });

	    return wrapper;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflection = __webpack_require__(4);
	var Observer = __webpack_require__(5);

	module.exports = function (origin, context) {
	    var observer = arguments.length <= 2 || arguments[2] === undefined ? function () {
	        return null;
	    } : arguments[2];


	    var notify = Observer.notifier({
	        origin: origin,
	        context: context,
	        type: 'CALL'
	    })(observer);

	    var wrapper = function wrapper() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        observer.locked = true;
	        var result = origin.apply(context, args);
	        observer.locked = false;

	        notify({
	            arguments: args,
	            result: result
	        });

	        if (Reflection.isPromise(result)) {
	            result.then(function (result) {

	                setTimeout(function () {
	                    return notify({
	                        type: 'CALL_ASYNC_OK',
	                        arguments: args,
	                        result: result
	                    });
	                }, 0);

	                return result;
	            }, function (result) {

	                setTimeout(function () {
	                    return notify({
	                        type: 'CALL_ASYNC_REJECT',
	                        arguments: args,
	                        result: result
	                    });
	                }, 0);

	                return result;
	            });
	        }
	        return result;
	    };

	    wrapper.prototype = origin;

	    return wrapper;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Definition = __webpack_require__(3);
	var Reflection = __webpack_require__(4);

	module.exports = function () {
	    function Definitions() {
	        _classCallCheck(this, Definitions);

	        this.definitions = new Map();
	        this.values = new Map();
	    }

	    _createClass(Definitions, [{
	        key: 'add',
	        value: function add(name, definition) {
	            if (definition instanceof Definition) {
	                this.definitions.set(definition.getName(), definition);
	            } else {
	                this.values.set(name, definition);
	            }
	        }
	    }, {
	        key: 'remove',
	        value: function remove(name) {
	            if (this.isValue(name)) {
	                this.values.delete(name);
	            }

	            if (this.isDefinition(name)) {
	                this.definitions.get(name).reset();
	                this.definitions.delete(name);
	            }
	        }
	    }, {
	        key: 'has',
	        value: function has(name) {
	            return this.isDefinition(name) || this.isValue(name);
	        }
	    }, {
	        key: 'get',
	        value: function get(name) {
	            if (this.isDefinition(name)) {
	                return this.definitions.get(name);
	            } else {
	                return this.values.get(name);
	            }
	        }
	    }, {
	        key: 'isResolved',
	        value: function isResolved(name) {
	            if (this.isDefinition(name)) {
	                return this.get(name).isResolved();
	            }

	            return true;
	        }
	    }, {
	        key: 'isDefinition',
	        value: function isDefinition(name) {
	            return this.definitions.has(name);
	        }
	    }, {
	        key: 'isValue',
	        value: function isValue(name) {
	            return this.values.has(name);
	        }
	    }, {
	        key: 'getResolved',
	        value: function getResolved(name) {
	            if (this.isDefinition(name)) {
	                return this.get(name).getResolved();
	            }

	            return this.values.get(name);
	        }
	    }, {
	        key: 'resolve',
	        value: function resolve(name, value) {
	            if (this.isDefinition(name)) {
	                this.definitions.get(name).resolve(value);
	            } else {
	                this.values.set(name, value);
	            }
	        }
	    }, {
	        key: 'keys',
	        value: function keys() {
	            return Reflection.iteratorToArray(this.values.keys()).concat(Reflection.iteratorToArray(this.definitions.keys()));
	        }
	    }, {
	        key: 'each',
	        value: function each(iterator) {
	            var _this = this;

	            this.keys().forEach(function (name) {
	                return iterator(_this.get(name), name);
	            });
	        }
	    }]);

	    return Definitions;
	}();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Creator = __webpack_require__(10);

	module.exports = function () {
	    function Factory() {
	        _classCallCheck(this, Factory);
	    }

	    _createClass(Factory, [{
	        key: 'create',
	        value: function create(box, definition) {
	            return Creator.create(definition)(box)();
	        }
	    }]);

	    return Factory;
	}();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Reflection = __webpack_require__(4);
	var Dependency = __webpack_require__(11);

	module.exports = function () {
	    function Creator(definition) {
	        _classCallCheck(this, Creator);

	        this.definition = definition;
	    }

	    _createClass(Creator, [{
	        key: 'create',
	        value: function create() {
	            if (Reflection.isClass(this.definition.getDefinition())) {
	                return this.makeClass();
	            } else if (Reflection.isFunction(this.definition.getDefinition())) {
	                return this.makeFunction();
	            } else if (this.definition.getMeta().box) {
	                return this.makeBox();
	            } else {
	                throw new Error('Unexpected definition type');
	            }
	        }
	    }, {
	        key: 'makeClass',
	        value: function makeClass() {
	            var _this = this;

	            return function (box) {
	                var dependencies = Dependency.create(_this.definition)(box);
	                var _class = _this.definition.getDefinition();

	                return Reflection.constructCreator(_class, dependencies);
	            };
	        }
	    }, {
	        key: 'makeFunction',
	        value: function makeFunction() {
	            var _this2 = this;

	            return function (box) {
	                var dependencies = Dependency.create(_this2.definition)(box);

	                var it = _this2.definition.getDefinition();

	                var creator = function creator() {
	                    return it.apply(this, dependencies);
	                };

	                creator.prototype = it.prototype;

	                return creator;
	            };
	        }
	    }, {
	        key: 'makeBox',
	        value: function makeBox() {
	            var _this3 = this;

	            return function (box) {
	                return function () {

	                    var dependencies = Dependency.create(_this3.definition)(box);

	                    var child = _this3.definition.getDefinition();

	                    for (var name in dependencies) {
	                        child.add(name, dependencies[name]);
	                    }

	                    return child;
	                };
	            };
	        }
	    }], [{
	        key: 'create',
	        value: function create(definition) {
	            return new Creator(definition).create();
	        }
	    }]);

	    return Creator;
	}();

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Reflection = __webpack_require__(4);

	module.exports = function () {
	    function Dependency(definition) {
	        _classCallCheck(this, Dependency);

	        this.definition = definition;

	        this.hasDependencies = !!definition.getDependencies();

	        this.isArrayDeps = Reflection.isArray(definition.getDependencies());
	        this.isObjectDeps = !this.isArrayDeps && Reflection.isPureObject(definition.getDependencies());
	    }

	    _createClass(Dependency, [{
	        key: 'isClass',
	        value: function isClass() {
	            return Reflection.isClass(this.definition.getDefinition());
	        }
	    }, {
	        key: 'isFunction',
	        value: function isFunction() {
	            return !this.isClass() && Reflection.isFunction(this.definition.getDefinition());
	        }
	    }, {
	        key: 'isBox',
	        value: function isBox() {
	            return this.definition.getMeta().box;
	        }
	    }, {
	        key: 'create',
	        value: function create() {
	            if (this.isClass()) {
	                return this.makeClass();
	            }

	            if (this.isFunction()) {
	                return this.makeFunction();
	            }

	            if (this.isBox()) {
	                return this.makeBox();
	            }

	            return function () {
	                return [];
	            };
	        }
	    }, {
	        key: 'makeBox',
	        value: function makeBox() {
	            if (this.isObjectDeps) {
	                return Dependency.objectBoxWay(this.definition);
	            }

	            return function () {
	                return [];
	            };
	        }
	    }, {
	        key: 'makeFunction',
	        value: function makeFunction() {
	            if (!this.hasDependencies || this.isObjectDeps) {
	                return Dependency.objectWay(this.definition);
	            }

	            if (this.isArrayDeps) {
	                return Dependency.arrayWay(this.definition);
	            }

	            return function () {
	                return [];
	            };
	        }
	    }, {
	        key: 'makeClass',
	        value: function makeClass() {
	            if (this.isArrayDeps) {
	                return Dependency.arrayWay(this.definition);
	            }

	            if (this.isObjectDeps) {
	                return Dependency.objectWay(this.definition);
	            }

	            return function () {
	                return [];
	            };
	        }
	    }], [{
	        key: 'arrayWay',
	        value: function arrayWay(definition) {
	            return function (box) {
	                return definition.getDependencies().map(function (name) {
	                    if (Reflection.isFunction(name)) {
	                        return name(box.context());
	                    }

	                    return box.get(name);
	                });
	            };
	        }
	    }, {
	        key: 'objectWay',
	        value: function objectWay(definition) {
	            return function (box) {
	                var dependencies = definition.getDependencies() || {};
	                // @@ think maybe need to save context to the definition to speedup
	                return [box.context(dependencies)];
	            };
	        }
	    }, {
	        key: 'objectBoxWay',
	        value: function objectBoxWay(definition) {
	            return function (box) {
	                var dependencies = definition.getDependencies() || {};

	                var result = {};

	                for (var name in dependencies) {
	                    var value = dependencies[name];
	                    if (Reflection.isFunction(value)) {
	                        result[name] = value(box.context());
	                    } else {
	                        result[name] = box.get(dependencies[name]);
	                    }
	                }

	                return result;
	            };
	        }
	    }, {
	        key: 'create',
	        value: function create(definition) {
	            return new Dependency(definition).create();
	        }
	    }]);

	    return Dependency;
	}();

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Connection = __webpack_require__(13);
	var Reflection = __webpack_require__(4);

	module.exports = function () {
	    function Connections() {
	        _classCallCheck(this, Connections);

	        this.connections = new Map();
	    }

	    _createClass(Connections, [{
	        key: 'add',
	        value: function add(connection) {
	            if (connection instanceof Connection) {
	                this.connections.set(connection.getName(), connection);
	            }
	        }
	    }, {
	        key: 'get',
	        value: function get(name) {
	            return this.connections.get(name);
	        }
	    }, {
	        key: 'has',
	        value: function has(name) {
	            return this.connections.has(name);
	        }
	    }, {
	        key: 'keys',
	        value: function keys() {
	            return Reflection.iteratorToArray(this.connections.keys());
	        }
	    }, {
	        key: 'each',
	        value: function each(iterator) {
	            var _this = this;

	            this.keys().forEach(function (name) {
	                return iterator(_this.get(name), name);
	            });
	        }
	    }, {
	        key: 'remove',
	        value: function remove(name) {
	            if (this.has(name)) {
	                this.get(name).reset();
	            }
	        }
	    }]);

	    return Connections;
	}();

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Observer = __webpack_require__(5);
	var Reflection = __webpack_require__(4);

	var connectionSymbol = '___Symbol__connection';

	module.exports = function () {
	    function Connection(name, service) {
	        _classCallCheck(this, Connection);

	        this.name = name;
	        this.service = service;

	        this.reset();
	    }

	    _createClass(Connection, [{
	        key: 'init',
	        value: function init(box) {
	            if (!this.hasState()) {
	                this.notify(box, {
	                    type: 'CONNECTION_INIT',
	                    name: this.getName(),
	                    box: box
	                });
	            }
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.observer = undefined;
	            this.stateCreator = undefined;
	            this.stateValue = undefined;

	            this.actionsCreator = undefined;
	            this.actionsCalled = false;
	            this.actionsValue = undefined;
	        }
	    }, {
	        key: 'getName',
	        value: function getName() {
	            return this.name;
	        }
	    }, {
	        key: 'getService',
	        value: function getService() {
	            return this.service;
	        }
	    }, {
	        key: 'state',
	        value: function state(creator) {
	            if (Reflection.isFunction(creator)) {
	                this.stateCreator = creator;
	            }
	            return this;
	        }
	    }, {
	        key: 'model',
	        value: function model(creator) {
	            return this.state(creator);
	        }
	    }, {
	        key: 'actions',
	        value: function actions(creator) {
	            if (Reflection.isFunction(creator)) {
	                this.actionsCreator = creator;
	            }
	            return this;
	        }
	    }, {
	        key: 'subscribe',
	        value: function subscribe(observer) {
	            this.observer = this.observer || new Observer();
	            this.observer.subscribe(observer);
	        }
	    }, {
	        key: 'unsubscribe',
	        value: function unsubscribe(observer) {
	            this.observer && this.observer.unsubscribe(observer);
	        }
	    }, {
	        key: 'notifyObservers',
	        value: function notifyObservers(box, event) {
	            var state = this.getState();
	            this.observer && this.observer.notify(event, Connection.clearState(state));
	        }
	    }, {
	        key: 'hasState',
	        value: function hasState() {
	            return !!this.stateValue;
	        }
	    }, {
	        key: 'getState',
	        value: function getState() {
	            var state = this.stateValue || this.resetState();
	            Connection.defineSymbol(state, this);
	            return state;
	        }
	    }, {
	        key: 'resetState',
	        value: function resetState() {
	            this.stateValue = {};
	            return this.stateValue;
	        }
	    }, {
	        key: 'applyState',
	        value: function applyState(state) {
	            this.stateValue = this.getState();

	            if (Reflection.isPureObject(state)) {
	                Reflection.merge(this.stateValue, state);
	            }
	        }
	    }, {
	        key: 'notify',
	        value: function notify(box, event) {
	            this.notifyIt(box, event);
	        }
	    }, {
	        key: 'notifyIt',
	        value: function notifyIt(box, event) {
	            this.resetState();

	            this.callActionsCreator(box);
	            this.callStateCreator(box);

	            this.notifyObservers(box, event);
	        }
	    }, {
	        key: 'callActionsCreator',
	        value: function callActionsCreator(box) {
	            if (this.actionsCreator && !this.actionsCalled) {
	                var value = this.actionsCreator(this.getActionsContext(box));
	                this.actionsValue = value;
	                this.actionsCalled = true;
	                this.applyState(value);
	            } else {
	                this.applyState(this.actionsValue);
	            }
	        }
	    }, {
	        key: 'callStateCreator',
	        value: function callStateCreator(box) {
	            if (this.stateCreator) {
	                this.applyState(this.stateCreator(this.getStateContext(box)));
	            }
	        }
	    }, {
	        key: 'getActionsContext',
	        value: function getActionsContext(box) {
	            return box.context();
	        }
	    }, {
	        key: 'getOriginValue',
	        value: function getOriginValue() {
	            return this.getState();
	        }
	    }, {
	        key: 'getValue',
	        value: function getValue() {
	            return this.getOriginValue();
	        }
	    }, {
	        key: 'getStateContext',
	        value: function getStateContext(box) {
	            return box.context();
	        }
	    }], [{
	        key: 'isStateObject',
	        value: function isStateObject(state) {
	            return state[connectionSymbol];
	        }
	    }, {
	        key: 'subscribe',
	        value: function subscribe(state, subscriber) {
	            var connection = state[connectionSymbol];
	            if (connection) {
	                connection.subscribe(subscriber);
	            }
	        }
	    }, {
	        key: 'unsubscribe',
	        value: function unsubscribe(state, subscriber) {
	            var connection = state[connectionSymbol];
	            if (connection) {
	                connection.unsubscribe(subscriber);
	            }
	        }
	    }, {
	        key: 'clearState',
	        value: function clearState(state) {
	            if (Connection.isStateObject(state)) {
	                state[connectionSymbol] && delete state[connectionSymbol];
	            }

	            return state;
	        }
	    }, {
	        key: 'defineSymbol',
	        value: function defineSymbol(state, connection) {
	            if (Reflection.isString(connectionSymbol)) {
	                if (!Connection.isStateObject(state)) {
	                    Reflection.defineName(state, connectionSymbol, function () {
	                        return connection;
	                    }, null, true);
	                }
	            } else {
	                state[connectionSymbol] = connection;
	            }

	            return state;
	        }
	    }]);

	    return Connection;
	}();

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DefinitionConnection = __webpack_require__(15);
	var Connection = __webpack_require__(13);
	var ConnectionConnection = __webpack_require__(16);
	var ArrayConnection = __webpack_require__(17);
	var ObjectConnection = __webpack_require__(18);

	var Reflection = __webpack_require__(4);
	var BoxReflection = __webpack_require__(19);
	var Accessor = __webpack_require__(20);

	module.exports = function () {
	    function Connector() {
	        _classCallCheck(this, Connector);
	    }

	    _createClass(Connector, null, [{
	        key: 'createConnection',
	        value: function createConnection(_ref) {
	            var _this = this;

	            var name = _ref.name;
	            var service = _ref.service;
	            var box = _ref.box;


	            var definitions = BoxReflection.getDefinitions(box);
	            var connections = BoxReflection.getConnections(box);

	            var connection = void 0;

	            if (!connection && definitions.isDefinition(service)) {
	                var definition = definitions.get(service);
	                connection = new DefinitionConnection(name, service, definition);
	                definition.subscribe(function (event) {
	                    return connection.notify(box, event);
	                });
	            }

	            if (!connection && connections.has(service)) {
	                connection = new ConnectionConnection(name, service);
	                connections.get(service).subscribe(function (event) {
	                    return connection.notify(box, event);
	                });
	            }

	            if (!connection && Reflection.isPureObject(service)) {
	                connection = new ObjectConnection(name, service);

	                var items = {};

	                for (var name in service) {
	                    var value = service[name];

	                    var child = this.createConnection({
	                        name: value,
	                        service: value,
	                        box: box
	                    });

	                    items[name] = child;

	                    child.subscribe(function (event) {
	                        var result = Connector.getBoxPath(box, value);
	                        var connections = BoxReflection.getConnections(result.box);

	                        if (connections.has(result.service)) {
	                            var originalChildConnection = connections.get(result.service);
	                            child.resetState();
	                            child.applyState(originalChildConnection.getState());
	                        }
	                        return connection.notify(box, event);
	                    });
	                }

	                connection.setConnections(items);
	            }

	            if (!connection && Reflection.isArray(service)) {
	                connection = new ArrayConnection(name, service);

	                var _items = service.map(function (service) {
	                    var child = _this.createConnection({
	                        name: service,
	                        service: service,
	                        box: box
	                    });

	                    child.subscribe(function (event) {
	                        if (connections.has(service)) {
	                            var originalChildConnection = connections.get(service);
	                            child.resetState();
	                            child.applyState(originalChildConnection.getState());
	                        }

	                        return connection.notify(box, event);
	                    });

	                    return child;
	                });

	                connection.setConnections(_items);
	            }

	            if (!connection && Accessor.isPath(service)) {
	                var _result = Connector.getBoxPath(box, service);
	                connection = this.createConnection({
	                    name: name,
	                    service: _result.service,
	                    box: _result.box
	                });
	            }

	            if (!connection) {
	                throw new Error('Unexpected connection, no definition or another connection');
	            }

	            return connection;
	        }
	    }, {
	        key: 'connect',
	        value: function connect(_ref2) {
	            var name = _ref2.name;
	            var service = _ref2.service;
	            var box = _ref2.box;

	            var connections = BoxReflection.getConnections(box);

	            box.remove(name);

	            var connection = void 0;

	            if (service instanceof Connection) {
	                var _connection = service;

	                connection = this.createConnection({
	                    name: name,
	                    service: _connection.getService(),
	                    box: box
	                });

	                connection.state(_connection.stateCreator).actions(_connection.actionsCreator);
	            } else {
	                connection = this.createConnection({
	                    name: name,
	                    service: service,
	                    box: box
	                });
	            }

	            connections.add(connection);

	            BoxReflection.addName(box, name);

	            return connection;
	        }
	    }, {
	        key: 'getBoxPath',
	        value: function getBoxPath(box, path) {

	            if (Accessor.isPath(path)) {
	                var _path = Accessor.toArray(path);
	                var service = _path.pop();

	                var _box = Accessor.path(_path)(box);
	                if (BoxReflection.isBox(_box)) {
	                    return {
	                        box: _box,
	                        service: service
	                    };
	                } else {
	                    throw new Error('Unexpected path to connected service: ' + service);
	                }
	            } else {
	                return {
	                    box: box,
	                    service: path
	                };
	            }
	        }
	    }]);

	    return Connector;
	}();

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Connection = __webpack_require__(13);

	module.exports = function (_Connection) {
	    _inherits(DefinitionConnection, _Connection);

	    function DefinitionConnection(name, service, definition) {
	        _classCallCheck(this, DefinitionConnection);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DefinitionConnection).call(this, name, service));

	        _this.definition = definition;
	        _this.context = undefined;
	        return _this;
	    }

	    _createClass(DefinitionConnection, [{
	        key: 'notify',
	        value: function notify(box, event) {
	            if (event.type == 'CONNECTION_INIT') {
	                box.get(this.service);
	            }

	            this.notifyIt(box, event);
	        }
	    }, {
	        key: 'getStateContext',
	        value: function getStateContext(box) {
	            var _this2 = this;

	            if (!this.context) {
	                this.context = box.context(_defineProperty({}, this.service, function () {
	                    return _this2.getOriginValue();
	                }));
	            }

	            return this.context;
	        }
	    }, {
	        key: 'getValue',
	        value: function getValue() {
	            return this.definition.getValue();
	        }
	    }, {
	        key: 'getOriginValue',
	        value: function getOriginValue() {
	            return this.definition.getOriginValue();
	        }
	    }]);

	    return DefinitionConnection;
	}(Connection);

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Connection = __webpack_require__(13);
	module.exports = Connection;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Connection = __webpack_require__(13);

	module.exports = function (_Connection) {
	    _inherits(ArrayConnection, _Connection);

	    function ArrayConnection(name, service) {
	        _classCallCheck(this, ArrayConnection);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayConnection).call(this, name, service));

	        _this.connections = undefined;
	        _this.context = undefined;
	        return _this;
	    }

	    _createClass(ArrayConnection, [{
	        key: 'setConnections',
	        value: function setConnections(connections) {
	            this.connections = connections;
	        }
	    }, {
	        key: 'makeRelations',
	        value: function makeRelations(box, event) {
	            this.connections.forEach(function (connection) {
	                return box.get(connection.getName());
	            });
	        }
	    }, {
	        key: 'notify',
	        value: function notify(box, event) {
	            if (event && event.type === 'CONNECTION_INIT') {
	                this.makeRelations(box, event);
	            }

	            this.notifyIt(box, event);
	        }
	    }, {
	        key: 'getStateContext',
	        value: function getStateContext(box) {

	            if (!this.context) {
	                var map = {};

	                this.connections.forEach(function (connection) {
	                    map[connection.getName()] = function () {
	                        return connection.getOriginValue();
	                    };
	                });

	                this.context = box.context(map);
	            }

	            return this.context;
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.connections = undefined;
	            this.context = undefined;
	            _get(Object.getPrototypeOf(ArrayConnection.prototype), 'reset', this).call(this);
	        }
	    }]);

	    return ArrayConnection;
	}(Connection);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Connection = __webpack_require__(13);

	module.exports = function (_Connection) {
	    _inherits(ObjectConnection, _Connection);

	    function ObjectConnection(name, service) {
	        _classCallCheck(this, ObjectConnection);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectConnection).call(this, name, service));

	        _this.connections = undefined;
	        _this.stateContext = undefined;
	        _this.actionsContext = undefined;
	        return _this;
	    }

	    _createClass(ObjectConnection, [{
	        key: 'setConnections',
	        value: function setConnections(connections) {
	            this.connections = connections;
	        }
	    }, {
	        key: 'makeRelations',
	        value: function makeRelations(box, event) {
	            for (var name in this.connections) {
	                box.get(this.connections[name].getName());
	            }
	        }
	    }, {
	        key: 'notify',
	        value: function notify(box, event) {
	            if (event && event.type === 'CONNECTION_INIT') {
	                this.makeRelations(box, event);
	            }

	            this.notifyIt(box, event);
	        }
	    }, {
	        key: 'getStateContext',
	        value: function getStateContext(box) {
	            if (!this.stateContext) {
	                var map = {};

	                var define = function define(key, connection) {
	                    return map[key] = function () {
	                        return connection.getOriginValue();
	                    };
	                };

	                for (var name in this.connections) {
	                    define(name, this.connections[name]);
	                }

	                this.stateContext = box.context(map);
	            }

	            return this.stateContext;
	        }
	    }, {
	        key: 'getActionsContext',
	        value: function getActionsContext(box) {
	            if (!this.actionsContext) {
	                var map = {};

	                var define = function define(key, connection) {
	                    return map[key] = function () {
	                        return connection.getValue();
	                    };
	                };

	                for (var name in this.connections) {
	                    define(name, this.connections[name]);
	                }

	                this.actionsContext = box.context(map);
	            }

	            return this.actionsContext;
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.connections = undefined;
	            this.stateContext = undefined;
	            _get(Object.getPrototypeOf(ObjectConnection.prototype), 'reset', this).call(this);
	        }
	    }]);

	    return ObjectConnection;
	}(Connection);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Reflection = __webpack_require__(4);
	var Definition = __webpack_require__(3);
	module.exports = function () {
	    function BoxReflection() {
	        _classCallCheck(this, BoxReflection);
	    }

	    _createClass(BoxReflection, null, [{
	        key: 'getDefinitions',
	        value: function getDefinitions(box) {
	            return box._definitions;
	        }
	    }, {
	        key: 'getConnections',
	        value: function getConnections(box) {
	            return box._connections;
	        }
	    }, {
	        key: 'addBox',
	        value: function addBox(_ref) {
	            var box = _ref.box;
	            var name = _ref.name;
	            var child = _ref.child;
	            var dependencies = _ref.dependencies;

	            var definition = new Definition(name, child, dependencies);
	            definition.setMeta({ box: true });

	            this.getDefinitions(box).add(name, definition);
	        }
	    }, {
	        key: 'addName',
	        value: function addName(box, name) {
	            if (!box._names.has(name) && !(name in box)) {
	                Reflection.defineName(box, name, function (name) {
	                    return box.get(name);
	                }, function (name, value) {
	                    return box.add(name, value);
	                });
	                box._names.set(name, name);
	            }
	        }
	    }, {
	        key: 'isBox',
	        value: function isBox(box) {
	            return box instanceof __webpack_require__(2);
	        }
	    }, {
	        key: 'clone',
	        value: function clone(box) {
	            var Box = __webpack_require__(2);
	            var _box = Box.create();

	            this.getDefinitions(box).each(function (definition, name) {
	                return _box.add(name, definition.clone());
	            });
	            this.getConnections(box).each(function (connection, name) {
	                return _box.connect(name, connection);
	            });

	            return _box;
	        }
	    }]);

	    return BoxReflection;
	}();

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Reflection = __webpack_require__(4);
	module.exports = function () {
	    function Accessor() {
	        _classCallCheck(this, Accessor);
	    }

	    _createClass(Accessor, null, [{
	        key: 'getCache',
	        value: function getCache() {
	            this._cache = this._cache || new Map();
	            return this._cache;
	        }
	    }, {
	        key: 'isPath',
	        value: function isPath(path) {
	            var delimiter = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

	            return !!(Reflection.isArray(path) || Reflection.isString(path) && path.indexOf(delimiter) > 0);
	        }
	    }, {
	        key: 'toArray',
	        value: function toArray(path) {
	            var delimiter = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

	            if (this.isPath(path)) {
	                return Reflection.isArray(path) ? path : path.split(delimiter);
	            }
	            return [];
	        }
	    }, {
	        key: 'create',
	        value: function create(name) {
	            var cache = this.getCache();
	            if (cache.has(name)) {
	                return cache.get(name);
	            }

	            var accessor = function accessor(context) {
	                if (Reflection.isObject(context)) {
	                    if (Reflection.isFunction(context['get'])) {
	                        return context['get'](name);
	                    }
	                    return context[name];
	                }
	            };

	            this.getCache().set(name, accessor);

	            return accessor;
	        }
	    }, {
	        key: 'path',
	        value: function path(_path) {
	            var _this = this;

	            var delimiter = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

	            var names = Reflection.isArray(_path) ? _path : _path.split(delimiter);
	            var items = names.map(function (name) {
	                return _this.create(name);
	            });

	            return function (context) {
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var item = _step.value;

	                        context = item(context);
	                        if (context === undefined) break;
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator.return) {
	                            _iterator.return();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }

	                return context;
	            };
	        }
	    }]);

	    return Accessor;
	}();

/***/ }
/******/ ]);