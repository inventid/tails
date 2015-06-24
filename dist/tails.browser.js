(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tails = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Associable = Associable;

var _collectable = require('./collectable');

var _interceptable = require('./interceptable');

function Associable(target) {
    if (!(0, _collectable.isCollectable)(target)) (0, _collectable.Collectable)(target);
    if (!(0, _interceptable.isInterceptable)(target)) (0, _interceptable.Interceptable)(target);
    target.extend(Associable);
}

var Associable;
exports.Associable = Associable;
(function (Associable) {
    var ClassMethods;
    (function (ClassMethods) {
        function belongsTo(klass, options) {
            throw new Error('Not implemented.');
            // var name: string = <string>this['name'];
            // var foreignKey = Utils.underscore(name) + "_id";
            //
            // console.log(name, foreignKey, klass);
            // return model.zoom(foreignKey).flatMap( (id: number) => {
            //   return Model.where(this.all(), "id", id);
            // });
        }
        ClassMethods.belongsTo = belongsTo;
        function hasOne(klass, options) {
            throw new Error('Not implemented.');
            // return hasMany(klass, options);
        }
        ClassMethods.hasOne = hasOne;
        function hasMany(klass, options) {
            throw new Error('Not implemented.');
            // var name: string = <string>klass['name'];
            // var foreignKey = Utils.underscore(name) + "_id";
            //
            // console.log(name, foreignKey, klass);
            //
            // return model.zoom('id').flatMap((id: number) => {
            //   return Model.where((<T>target).all(), foreignKey, id);
            // });
        }
        ClassMethods.hasMany = hasMany;
    })(ClassMethods = Associable.ClassMethods || (Associable.ClassMethods = {}));
})(Associable || (exports.Associable = exports.Associable = Associable = {}));
exports['default'] = Associable;

//

},{"./collectable":2,"./interceptable":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Collectable = Collectable;
exports.isCollectable = isCollectable;

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}

var _mixable = require('./mixable');

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

function Collectable(target) {
    if (!(0, _mixable.isMixable)(target)) (0, _mixable.Mixable)(target);
    target.extend(Collectable);
}

var Collectable;
exports.Collectable = Collectable;
(function (Collectable) {
    var ClassMethods;
    (function (ClassMethods) {
        ClassMethods._collection = undefined;
        function _keyFn(model) {
            return model.id || null;
        }
        ClassMethods._keyFn = _keyFn;
        ;
        function all() {
            return this._collection = this._collection ? this._collection : new _collection2['default']([], { keyFn: _keyFn });
        }
        ClassMethods.all = all;
    })(ClassMethods = Collectable.ClassMethods || (Collectable.ClassMethods = {}));
})(Collectable || (exports.Collectable = exports.Collectable = Collectable = {}));

function isCollectable(obj) {
    return Object.keys(Collectable.ClassMethods).reduce(function (memo, key) {
        return memo && !(obj[key] == null);
    }, true);
}

exports['default'] = Collectable;

},{"./collection":3,"./mixable":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
})();

var _get = function get(_x, _x2, _x3) {
    var _again = true;_function: while (_again) {
        var object = _x,
            property = _x2,
            receiver = _x3;desc = parent = getter = undefined;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);if (parent === null) {
                return undefined;
            } else {
                _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
            }
        } else if ('value' in desc) {
            return desc.value;
        } else {
            var getter = desc.get;if (getter === undefined) {
                return undefined;
            }return getter.call(receiver);
        }
    }
};

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
}

var _node_modulesKnucklesDistCollection = require('../node_modules/knuckles/dist/collection');

var _node_modulesKnucklesDistCollection2 = _interopRequireDefault(_node_modulesKnucklesDistCollection);

var _node_modulesSonicDistMutable_list = require('../node_modules/sonic/dist/mutable_list');

var _node_modulesSonicDistArray_list = require('../node_modules/sonic/dist/array_list');

var _node_modulesSonicDistArray_list2 = _interopRequireDefault(_node_modulesSonicDistArray_list);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _node_modulesSonicDistObservable_cache = require('../node_modules/sonic/dist/observable_cache');

var _node_modulesSonicDistObservable_cache2 = _interopRequireDefault(_node_modulesSonicDistObservable_cache);

var Collection = (function (_MutableList) {
    function Collection(models, options) {
        var _this = this;

        if (models === undefined) models = [];

        _classCallCheck(this, Collection);

        _get(Object.getPrototypeOf(Collection.prototype), 'constructor', this).call(this);
        this.has = function (key) {
            return _this._cache.has(key);
        };
        this.get = function (key) {
            if (!_this.has(key)) _this._record.get(key);
            return _this._cache.get(key);
        };
        this._models = new _node_modulesSonicDistArray_list2['default'](models);
        this._record = new _node_modulesKnucklesDistCollection2['default'](this.url(), []);
        this._cache = new _node_modulesSonicDistObservable_cache2['default'](this._models);
        // this._record.observe({
        //   onInvalidate: (key: Key) => {
        //     this._models.set(key)
        //   }
        // })
    }

    _inherits(Collection, _MutableList);

    _createClass(Collection, [{
        key: 'url',
        value: function url() {
            return _utils2['default'].underscore(this.constructor.name);
        }
    }]);

    return Collection;
})(_node_modulesSonicDistMutable_list.MutableList);

exports.Collection = Collection;
exports['default'] = Collection;

},{"../node_modules/knuckles/dist/collection":10,"../node_modules/sonic/dist/array_list":32,"../node_modules/sonic/dist/mutable_list":39,"../node_modules/sonic/dist/observable_cache":41,"./utils":9}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Debug = Debug;
exports.isDebug = isDebug;

function _defineProperty(obj, key, value) {
    return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}

var _mixable = require('./mixable');

var _interceptable = require('./interceptable');

function Debug(target) {
    if (!(0, _mixable.isMixable)(target)) (0, _mixable.Mixable)(target);
    if (!(0, _interceptable.isInterceptable)(target)) (0, _interceptable.Interceptable)(target);
    target.extend(Debug);
}

var Debug;
exports.Debug = Debug;
(function (Debug) {
    var ClassMethods;
    (function (ClassMethods) {
        function debug() {
            var _this = this;

            for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
                keys[_key] = arguments[_key];
            }

            keys.forEach(function (key) {
                if (_this[key] instanceof Function) {
                    var debugFn = function debugFn(context, fn, args) {
                        console.log('Intercept', context, key, fn, args);
                        debugger;
                    };
                    _this.intercept(_defineProperty({}, key, debugFn));
                }
            });
        }
        ClassMethods.debug = debug;
    })(ClassMethods = Debug.ClassMethods || (Debug.ClassMethods = {}));
})(Debug || (exports.Debug = exports.Debug = Debug = {}));

function isDebug(obj) {
    return Object.keys(Debug.ClassMethods).reduce(function (memo, key) {
        return memo && !(obj[key] == null);
    }, true);
}

exports['default'] = Debug;

},{"./interceptable":5,"./mixable":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Interceptable = Interceptable;
exports.isInterceptable = isInterceptable;

var _mixable = require('./mixable');

function Interceptable(target) {
    if (!(0, _mixable.isMixable)(target)) (0, _mixable.Mixable)(target);
    target.extend(Interceptable);
}

var Interceptable;
exports.Interceptable = Interceptable;
(function (Interceptable) {
    var ClassMethods;
    (function (ClassMethods) {
        function intercept(obj) {
            var _this = this;

            Object.keys(obj).forEach(function (key) {
                var _fn = obj[key].bind(_this),
                    fn = _this[key].bind(_this);
                _this[key] = function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    _fn(_this, fn, args);
                };
            });
        }
        ClassMethods.intercept = intercept;
        function before(obj) {
            var _this2 = this;

            Object.keys(obj).forEach(function (key) {
                var _fn = obj[key].bind(_this2),
                    fn = _this2[key].bind(_this2);
                _this2[key] = function () {
                    _fn.apply(undefined, arguments);
                    fn.apply(undefined, arguments);
                };
            });
        }
        ClassMethods.before = before;
        function after(obj) {
            var _this3 = this;

            Object.keys(obj).forEach(function (key) {
                var _fn = obj[key].bind(_this3),
                    fn = _this3[key].bind(_this3);
                _this3[key] = function () {
                    fn.apply(undefined, arguments);
                    _fn.apply(undefined, arguments);
                };
            });
        }
        ClassMethods.after = after;
    })(ClassMethods = Interceptable.ClassMethods || (Interceptable.ClassMethods = {}));
})(Interceptable || (exports.Interceptable = exports.Interceptable = Interceptable = {}));

function isInterceptable(obj) {
    return Object.keys(Interceptable.ClassMethods).reduce(function (memo, key) {
        return memo && !(obj[key] == null);
    }, true);
}

exports['default'] = Interceptable;

},{"./mixable":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Mixable = Mixable;
exports.isMixable = isMixable;

function Mixable(target) {
    if (!isMixable(target)) Mixable.ClassMethods.extend.call(target, Mixable);
}

var Mixable;
exports.Mixable = Mixable;
(function (Mixable) {
    var ClassMethods;
    (function (ClassMethods) {
        ClassMethods._includedMixins = undefined;
        ClassMethods._extendedMixins = undefined;
        function extend() {
            var _this = this;

            for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
                mixins[_key] = arguments[_key];
            }

            mixins.forEach(function (mixin) {
                // This becomes a non-enumerable property in the next part so it doesn't mess up with CoffeeScript extends
                _this._extendedMixins = _this._extendedMixins ? _this._extendedMixins : [];
                if (mixin.ClassMethods == null || _this._extendedMixins.indexOf(mixin) != -1) return;
                Object.keys(mixin.ClassMethods).forEach(function (key) {
                    console.log(key);
                    var _value = mixin.ClassMethods[key];
                    _value = _value != null ? _value : _this[key];
                    var desc = {
                        get: function get() {
                            return _value;
                        },
                        set: function set(value) {
                            return _value = value;
                        },
                        // This hides non-functions from derived classes
                        enumerable: _value instanceof Function
                    };
                    Object.defineProperty(_this, key, desc);
                });
                _this._extendedMixins.push(mixin);
            });
        }
        ClassMethods.extend = extend;
        function include() {
            var _this2 = this;

            for (var _len2 = arguments.length, mixins = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                mixins[_key2] = arguments[_key2];
            }

            mixins.forEach(function (mixin) {
                _this2._includedMixins = _this2._includedMixins ? _this2._includedMixins : [];
                if (mixin.InstanceMethods == null || _this2._includedMixins.indexOf(mixin) != -1) return;
                Object.keys(mixin.InstanceMethods).forEach(function (key) {
                    _this2.prototype[key] = mixin.InstanceMethods[key];
                });
                _this2._includedMixins.push(mixin);
            });
        }
        ClassMethods.include = include;
        function concern() {
            extend.apply(undefined, arguments);
            concern.apply(undefined, arguments);
        }
        ClassMethods.concern = concern;
    })(ClassMethods = Mixable.ClassMethods || (Mixable.ClassMethods = {}));
})(Mixable || (exports.Mixable = exports.Mixable = Mixable = {}));

function isMixable(obj) {
    return Object.keys(Mixable).reduce(function (memo, key) {
        return memo && !(obj[key] == null);
    }, true);
}

exports["default"] = Mixable;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
})();

var _get = function get(_x, _x2, _x3) {
    var _again = true;_function: while (_again) {
        var object = _x,
            property = _x2,
            receiver = _x3;desc = parent = getter = undefined;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);if (parent === null) {
                return undefined;
            } else {
                _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
            }
        } else if ("value" in desc) {
            return desc.value;
        } else {
            var getter = desc.get;if (getter === undefined) {
                return undefined;
            }return getter.call(receiver);
        }
    }
};

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { "default": obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
}

var _mixable = require("./mixable");

var _mixable2 = _interopRequireDefault(_mixable);

var _collectable = require("./collectable");

var _collectable2 = _interopRequireDefault(_collectable);

var _associable = require("./associable");

var _associable2 = _interopRequireDefault(_associable);

var _interceptable = require("./interceptable");

var _interceptable2 = _interopRequireDefault(_interceptable);

var _debug = require("./debug");

var _debug2 = _interopRequireDefault(_debug);

var _node_modulesKnucklesDistSimple_record = require("../node_modules/knuckles/dist/simple_record");

var _node_modulesKnucklesDistSimple_record2 = _interopRequireDefault(_node_modulesKnucklesDistSimple_record);

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2:
            return decorators.reduceRight(function (o, d) {
                return d && d(o) || o;
            }, target);
        case 3:
            return decorators.reduceRight(function (o, d) {
                return (d && d(target, key), void 0);
            }, void 0);
        case 4:
            return decorators.reduceRight(function (o, d) {
                return d && d(target, key, o) || o;
            }, desc);
    }
};
var Model = (function (_SimpleRecord) {
    var _class = function Model(object) {
        _classCallCheck(this, _class);

        _get(Object.getPrototypeOf(_class.prototype), "constructor", this).call(this, object);
        this.constructor.all().push(this);
        this.initialize();
    };

    _inherits(_class, _SimpleRecord);

    _createClass(_class, [{
        key: "initialize",
        value: function initialize() {}
    }]);

    return _class;
})(_node_modulesKnucklesDistSimple_record2["default"]);
exports.Model = Model;
exports.Model = Model = __decorate([_mixable2["default"], _interceptable2["default"], _collectable2["default"], _associable2["default"], _debug2["default"]], Model);
exports["default"] = Model;

},{"../node_modules/knuckles/dist/simple_record":14,"./associable":1,"./collectable":2,"./debug":4,"./interceptable":5,"./mixable":6}],8:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}

var _mixable = require('./mixable');

var _mixable2 = _interopRequireDefault(_mixable);

var _collectable = require('./collectable');

var _collectable2 = _interopRequireDefault(_collectable);

var _associable = require('./associable');

var _associable2 = _interopRequireDefault(_associable);

var _interceptable = require('./interceptable');

var _interceptable2 = _interopRequireDefault(_interceptable);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var Tails;
(function (Tails) {
    var Mixins;
    (function (Mixins) {
        Mixins.Mixable = _mixable2['default'];
        Mixins.Collectable = _collectable2['default'];
        Mixins.Associable = _associable2['default'];
        Mixins.Interceptable = _interceptable2['default'];
        Mixins.Debug = _debug2['default'];
    })(Mixins = Tails.Mixins || (Tails.Mixins = {}));
    Tails.Model = _model2['default'];
    // export var View             = _View;
    Tails.Collection = _collection2['default'];
    Tails.Utils = _utils2['default'];
})(Tails || (Tails = {}));
module.exports = Tails;

},{"./associable":1,"./collectable":2,"./collection":3,"./debug":4,"./interceptable":5,"./mixable":6,"./model":7,"./utils":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Utils;
exports.Utils = Utils;
(function (Utils) {
    function underscore(string) {
        return string.replace(/((!?[^|\s])[A-Z][a-z0-9])/, "_$1").toLowerCase();
    }
    Utils.underscore = underscore;
})(Utils || (exports.Utils = Utils = {}));
exports["default"] = Utils;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _simple_record = require('./simple_record');

var _xhr = require('./xhr');

var Collection = (function (_SimpleRecord) {
    function Collection(urlRoot, models) {
        _classCallCheck(this, Collection);

        _get(Object.getPrototypeOf(Collection.prototype), 'constructor', this).call(this, {});
        this._urlRoot = urlRoot;
    }

    _inherits(Collection, _SimpleRecord);

    _createClass(Collection, [{
        key: 'all',
        value: function all() {
            var _this = this;

            return _xhr.XHR.get(this._urlRoot).then(function (res) {
                var arr = JSON.parse(res.responseText);
                arr.forEach(function (value) {
                    _get(Object.getPrototypeOf(Collection.prototype), 'set', _this).call(_this, value.id, value);
                });
                return arr;
            });
        }
    }, {
        key: 'has',
        value: function has(key) {
            var _this2 = this;

            return _get(Object.getPrototypeOf(Collection.prototype), 'has', this).call(this, key).then(function (has) {
                return has || _xhr.XHR.head(_this2._urlRoot + '/' + key).then(function () {
                    return true;
                })['catch'](function () {
                    return false;
                });
            });
        }
    }, {
        key: 'get',
        value: function get(key) {
            var _this3 = this;

            return key in this._object ? _get(Object.getPrototypeOf(Collection.prototype), 'get', this).call(this, key) : _xhr.XHR.get(this._urlRoot + '/' + key).then(function (res) {
                var value = JSON.parse(res.responseText);
                _get(Object.getPrototypeOf(Collection.prototype), 'set', _this3).call(_this3, key, value);
                return value;
            });
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            var _this4 = this;

            if (key in this._object) return _xhr.XHR.put(this._urlRoot + '/' + key, value).then(function (res) {
                return _get(Object.getPrototypeOf(Collection.prototype), 'set', _this4).call(_this4, key, JSON.parse(res.responseText));
            });else return _xhr.XHR.post(this._urlRoot, value).then(function (res) {
                var value = JSON.parse(res.responseText);
                return _get(Object.getPrototypeOf(Collection.prototype), 'set', _this4).call(_this4, value.id, value);
            });
        }
    }, {
        key: 'observe',
        value: function observe(observer) {
            return this._subject.observe(observer);
        }
    }, {
        key: 'delete',
        value: function _delete(key) {
            var _this5 = this;

            return _xhr.XHR['delete'](this._urlRoot + '/' + key).then(function (res) {
                return _get(Object.getPrototypeOf(Collection.prototype), 'delete', _this5).call(_this5, key);
            });
        }
    }]);

    return Collection;
})(_simple_record.SimpleRecord);

exports.Collection = Collection;
exports['default'] = Collection;

},{"./simple_record":14,"./xhr":15}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _observable_record = require('./observable_record');

var _node_modulesSonicDistMutable_list = require('../node_modules/sonic/dist/mutable_list');

;

var MutableRecord = (function (_ObservableRecord) {
    function MutableRecord(record) {
        _classCallCheck(this, MutableRecord);

        _get(Object.getPrototypeOf(MutableRecord.prototype), 'constructor', this).call(this, record);
        if (record != null) {
            this.set = record.set;
            this['delete'] = record['delete'];
        }
    }

    _inherits(MutableRecord, _ObservableRecord);

    _createClass(MutableRecord, [{
        key: 'set',
        value: function set(key, value) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'delete',
        value: function _delete(key) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'zoom',
        value: function zoom(key) {
            return _node_modulesSonicDistMutable_list.MutableList.create(MutableRecord.zoom(this, key));
        }
    }], [{
        key: 'create',

        // compose<W>(lens: ILens<V,W>): MutableRecord<W> {
        //   return MutableRecord.create<W>(MutableRecord.compose<V,W>(this, lens));
        // }
        value: function create(record) {
            return new MutableRecord(record);
        }
    }, {
        key: 'zoom',
        value: function zoom(record, key) {
            var unit = _observable_record.ObservableRecord.zoom(record, key);
            function set(_key, value) {
                if (_key == key) record.set(key, value);
            }
            function splice(prev, next) {
                for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key2 = 2; _key2 < _len; _key2++) {
                    values[_key2 - 2] = arguments[_key2];
                }

                if (values.length) record.set(key, values[0]);else record['delete'](key);
            }
            return _node_modulesSonicDistMutable_list.MutableList.create({
                has: unit.has,
                get: unit.get,
                prev: unit.prev,
                next: unit.next,
                observe: unit.observe,
                set: set,
                splice: splice
            });
        }
    }]);

    return MutableRecord;
})(_observable_record.ObservableRecord);

exports.MutableRecord = MutableRecord;
exports['default'] = MutableRecord;

},{"../node_modules/sonic/dist/mutable_list":24,"./observable_record":12}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _node_modulesSonicDistUnit = require('../node_modules/sonic/dist/unit');

var _node_modulesSonicDistUnit2 = _interopRequireDefault(_node_modulesSonicDistUnit);

var _record = require('./record');

var _node_modulesSonicDistObservable_list = require('../node_modules/sonic/dist/observable_list');

;

var ObservableRecord = (function (_Record) {
    function ObservableRecord(record) {
        _classCallCheck(this, ObservableRecord);

        _get(Object.getPrototypeOf(ObservableRecord.prototype), 'constructor', this).call(this, record);
        if (record != null) this.observe = record.observe;
    }

    _inherits(ObservableRecord, _Record);

    _createClass(ObservableRecord, [{
        key: 'observe',
        value: function observe(observer) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'zoom',
        value: function zoom(key) {
            return _node_modulesSonicDistObservable_list.ObservableList.create(ObservableRecord.zoom(this, key));
        }
    }], [{
        key: 'create',
        value: function create(record) {
            return new ObservableRecord(record);
        }
    }, {
        key: 'zoom',
        value: function zoom(record, key) {
            var unit = new _node_modulesSonicDistUnit2['default']();
            record.get(key).then(function (value) {
                return unit.set(key, value);
            });
            record.observe({
                onInvalidate: function onInvalidate(k) {
                    if (k != key) return;
                    record.get(key).then(function (value) {
                        return unit.set(key, value);
                    })['catch'](function () {
                        return unit.splice(null, null);
                    });
                }
            });
            return _node_modulesSonicDistObservable_list.ObservableList.create(unit);
        }
    }]);

    return ObservableRecord;
})(_record.Record);

exports.ObservableRecord = ObservableRecord;
exports['default'] = ObservableRecord;

},{"../node_modules/sonic/dist/observable_list":29,"../node_modules/sonic/dist/unit":31,"./record":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _node_modulesSonicDistList = require('../node_modules/sonic/dist/list');

var _node_modulesSonicDistFactory = require('../node_modules/sonic/dist/factory');

var Record = (function () {
    function Record(record) {
        _classCallCheck(this, Record);

        if (record != null) {
            this.get = record.get;
            this.has = record.has;
        }
    }

    _createClass(Record, [{
        key: 'has',
        value: function has(key) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'get',
        value: function get(key) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'zoom',
        value: function zoom(key) {
            return _node_modulesSonicDistList.List.create(Record.zoom(this, key));
        }
    }], [{
        key: 'create',
        value: function create(record) {
            return new Record(record);
        }
    }, {
        key: 'zoom',
        value: function zoom(record, key) {
            var unit = (0, _node_modulesSonicDistFactory.fromPromise)(record.get(key));
            return {
                has: unit.has,
                get: unit.get,
                prev: unit.prev,
                next: unit.next
            };
        }
    }]);

    return Record;
})();

exports.Record = Record;
exports['default'] = Record;

},{"../node_modules/sonic/dist/factory":19,"../node_modules/sonic/dist/list":23}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _mutable_record = require('./mutable_record');

var _node_modulesSonicDistObservable = require('../node_modules/sonic/dist/observable');

var SimpleRecord = (function (_MutableRecord) {
    function SimpleRecord(object) {
        _classCallCheck(this, SimpleRecord);

        _get(Object.getPrototypeOf(SimpleRecord.prototype), 'constructor', this).call(this);
        this._object = object;
        this._subject = new _node_modulesSonicDistObservable.Subject();
    }

    _inherits(SimpleRecord, _MutableRecord);

    _createClass(SimpleRecord, [{
        key: 'has',
        value: function has(key) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                resolve(key in _this._object);
            });
        }
    }, {
        key: 'get',
        value: function get(key) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                key in _this2._object ? resolve(_this2._object[key]) : reject();
            });
        }
    }, {
        key: 'observe',
        value: function observe(observer) {
            return this._subject.observe(observer);
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3._object[key] = value;
                _this3._subject.notify(function (observer) {
                    observer.onInvalidate(key);
                });
                resolve(key);
            });
        }
    }, {
        key: 'delete',
        value: function _delete(key) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                if (!(key in _this4._object)) reject();
                var value = _this4._object[key];
                delete _this4._object[key];
                _this4._subject.notify(function (observer) {
                    observer.onInvalidate(key);
                });
                resolve(value);
            });
        }
    }]);

    return SimpleRecord;
})(_mutable_record.MutableRecord);

exports.SimpleRecord = SimpleRecord;
exports['default'] = SimpleRecord;

},{"../node_modules/sonic/dist/observable":25,"./mutable_record":11}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var XHR = {
    create: function create(key, options) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();var url = key.toString();var method = options.method;
            var body = options.body;

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 400) {
                    resolve(xhr);
                } else {
                    reject(xhr);
                }
            };
            xhr.onerror = function () {
                reject(xhr);
            };
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhr.send(JSON.stringify(body));
        });
    },
    head: function head(url) {
        return XHR.create(url, { method: 'HEAD' });
    },
    get: function get(url) {
        return XHR.create(url, { method: 'GET' });
    },
    put: function put(url, body) {
        return XHR.create(url, { method: 'PUT', body: body });
    },
    post: function post(url, body) {
        return XHR.create(url, { method: 'POST', body: body });
    },
    'delete': function _delete(url) {
        return XHR.create(url, { method: 'DELETE' });
    }
};
// export class XHRRecord<V> implements IMutableRecord<V> {
//   protected _subject: Subject<IRecordObserver>;
//
//   constructor() {
//     this._subject = XHRRecord._subject;
//   }
//
//   has(key: Key): boolean {
//      return XHRRecord.has(key);
//    }
//
//   get(key: Key): V {
//      return <V>XHRRecord.get(key);
//    }
//
//   set(key: Key, value: V): void {
//      return XHRRecord.set(key, value);
//    }
//
//   observe(observer: IRecordObserver): ISubscription {
//      return XHRRecord.observe(observer);
//    }
//
//   delete(key: Key): void {
//      return XHRRecord.delete(key);
//    }
//
//   static _subject = new Subject<IRecordObserver>();
//
//   static invalidate = (key: Key): void => {
//     XHRRecord._subject.notify(function(observer: IRecordObserver) {
//       observer.onInvalidate(key);
//     });
//   }
//
//   static has = (key: string): Promise<boolean> => {
//     return XHR.head(key)
//               .then(function() { return true; })
//               .catch(function() { return false; });
//   }
//
//   static get = <V>(key: string): Promise<V> => {
//     return XHR.get(key)
//               .then(function(xhr) { return JSON.parse(xhr.responseText); })
//   }
//
//   // static set = <V>(key: string, value: V): Promise<V> => {
//   //   return XHR.
//   // }
//
//   static observe = (observer: IRecordObserver): ISubscription => {
//     return XHRRecord._subject.observe(observer);
//   }
//
//   static delete = (key: Key): void => {
//     var xhr = XHR["delete"](key);
//     XHRRecord.invalidate(key);
//
//     return null;
//   }
//
// }
//
// export default XHRRecord;
exports.XHR = XHR;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _observable = require('./observable');

var _mutable_list = require('./mutable_list');

var ArrayList = (function (_MutableList) {
    function ArrayList() {
        var _this = this;

        var array = arguments[0] === undefined ? [] : arguments[0];

        _classCallCheck(this, ArrayList);

        _get(Object.getPrototypeOf(ArrayList.prototype), 'constructor', this).call(this);
        this.has = function (key) {
            return key != null && -1 < key && key < _this._array.length;
        };
        this.get = function (key) {
            if (_this.has(key)) return _this._array[key];
            return;
        };
        this.prev = function (key) {
            if (key == null && _this._array.length) return _this._array.length - 1;
            if (_this._array.length > 0 && key != null && _this.has(key) && _this.has(key - 1)) return key - 1;
            return null;
        };
        this.next = function (key) {
            if (key == null && _this._array.length) return 0;
            if (_this._array.length > 0 && key != null && _this.has(key) && _this.has(key + 1)) return key + 1;
            return null;
        };
        this.set = function (key, value) {
            if (!_this.has(key)) return null;
            _this._array[key] = value;
            return key;
        };
        this.splice = function (prev, next) {
            for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                values[_key - 2] = arguments[_key];
            }

            var _array;

            if (prev == null) prev = -1;else if (!_this.has(prev)) return;
            if (next == null) next = _this._array.length;else if (!_this.has(next)) return;
            (_array = _this._array).splice.apply(_array, [prev + 1, next - (prev + 1)].concat(values));
            _this._invalidate(prev, null);
        };
        this.observe = function (observer) {
            return _this._subject.observe(observer);
        };
        this._invalidate = function (prev, next) {
            if (!_this.has(prev)) prev = null;
            if (!_this.has(next)) next = null;
            _this._subject.notify(function (observer) {
                observer.onInvalidate(prev, next);
            });
        };
        this._subject = new _observable.Subject();
        this._array = array;
    }

    _inherits(ArrayList, _MutableList);

    return ArrayList;
})(_mutable_list.MutableList);

exports['default'] = ArrayList;
module.exports = exports['default'];

},{"./mutable_list":24,"./observable":25}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AsyncList = (function () {
    function AsyncList(list, scheduler) {
        var _this = this;

        _classCallCheck(this, AsyncList);

        this.has = function (key) {
            return new Promise(function (resolve, reject) {
                _this._scheduler(function () {
                    Promise.resolve(_this._list.has(key)).then(resolve)["catch"](reject);
                });
            });
        };
        this.get = function (key) {
            return new Promise(function (resolve, reject) {
                _this.has(key).then(function (has) {
                    return has ? resolve(_this._list.get(key)) : reject();
                })["catch"](reject);
            });
        };
        this.prev = function (key) {
            return new Promise(function (resolve, reject) {
                _this._scheduler(function () {
                    Promise.resolve(_this._list.prev(key)).then(function (prev) {
                        return prev != null ? resolve(prev) : reject();
                    })["catch"](reject);
                });
            });
        };
        this.next = function (key) {
            return new Promise(function (resolve, reject) {
                _this._scheduler(function () {
                    Promise.resolve(_this._list.next(key)).then(function (prev) {
                        return prev != null ? resolve(prev) : reject();
                    })["catch"](reject);
                });
            });
        };
        this._list = list;
        this._scheduler = scheduler || window.setTimeout;
    }

    _createClass(AsyncList, null, [{
        key: "create",
        value: function create(list) {
            return new AsyncList(list);
        }
    }, {
        key: "map",
        value: function map(list, mapFn) {
            var has = list.has;
            var prev = list.prev;
            var next = list.next;

            function get(key) {
                return list.get(key).then(mapFn);
            }
            return new AsyncList({ has: has, get: get, prev: prev, next: next });
        }
    }]);

    return AsyncList;
})();

exports.AsyncList = AsyncList;
exports["default"] = AsyncList;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = function Cache(list) {
    var _this = this;

    _classCallCheck(this, Cache);

    this.has = function (key) {
        return key in _this._byKey || _this._list.has(key);
    };
    this.get = function (key) {
        if (key in _this._byKey) return _this._byKey[key];
        if (_this._list.has(key)) return _this._byKey[key] = _this._list.get(key);
        return;
    };
    this.prev = function (key) {
        if (key in _this._prev) return _this._prev[key];
        var prevKey = _this._list.prev(key);
        if (prevKey == null) prevKey = null;
        _this._prev[key] = prevKey;
        _this._next[prevKey] = key;
        return prevKey;
    };
    this.next = function () {
        var key = arguments[0] === undefined ? null : arguments[0];

        if (key in _this._next) return _this._next[key];
        var nextKey = _this._list.next(key);
        if (nextKey == null) nextKey = null;
        _this._next[key] = nextKey;
        _this._prev[nextKey] = key;
        return nextKey;
    };
    this._byKey = Object.create(null), this._next = Object.create(null), this._prev = Object.create(null);
    this._list = list;
};

exports.Cache = Cache;
exports["default"] = Cache;

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = factory;
exports.fromPromise = fromPromise;
exports.fromIterator = fromIterator;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _list = require('./list');

var _observable_list = require('./observable_list');

var _mutable_list = require('./mutable_list');

var _unit = require('./unit');

var _unit2 = _interopRequireDefault(_unit);

var _array_list = require('./array_list');

var _array_list2 = _interopRequireDefault(_array_list);

function factory(obj) {
    if (_mutable_list.MutableList.isMutableList(obj)) return _mutable_list.MutableList.create(obj);
    if (_observable_list.ObservableList.isObservableList(obj)) return _observable_list.ObservableList.create(obj);
    if (_list.List.isList(obj)) return _list.List.create(obj);
    if (Array.isArray(obj)) return new _array_list2['default'](obj);
    return _unit2['default'].create(obj);
}

function fromPromise(promise) {
    var unit = new _unit2['default']();
    promise.then(function (value) {
        unit.push(value);
    });
    return _observable_list.ObservableList.create(unit);
}

function fromIterator(iterator) {
    var list = {
        has: function has(key) {
            return null;
        },
        get: function get(key) {
            return null;
        },
        prev: function prev(key) {
            return null;
        },
        next: function next(key) {
            return null;
        }
    };
    return list;
}

},{"./array_list":16,"./list":23,"./mutable_list":24,"./observable_list":29,"./unit":31}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Index = function Index(list) {
    var _this = this;

    _classCallCheck(this, Index);

    this.has = function (index) {
        if (index >= 0 && index < _this._byIndex.length) return true;
        var next,
            last = _this._byIndex.length - 1;
        while (last != index) {
            next = _this._list.next(_this._byIndex[last]);
            if (next == null) return false;
            _this._byIndex[++last] = next;
        }
        return true;
    };
    this.get = function (index) {
        return _this.has(index) ? _this._list.get(_this._byIndex[index]) : undefined;
    };
    this.prev = function (index) {
        if (_this.has(index - 1)) return index - 1;
        if (index == null && _this._byIndex.length) return _this._byIndex.length - 1;
        return null;
    };
    this.next = function () {
        var index = arguments[0] === undefined ? -1 : arguments[0];

        if (_this.has(index + 1)) return index + 1;
        return null;
    };
    this._byIndex = [];
    this._list = list;
};

exports.Index = Index;
exports["default"] = Index;

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Key;
(function (Key) {
    var uniqueKey = 0;
    function key(key) {
        return key.toString();
    }
    Key.key = key;
    function create() {
        return uniqueKey++;
    }
    Key.create = create;
})(Key || (Key = {}));
exports["default"] = Key;
module.exports = exports["default"];

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyBy = function KeyBy(list, keyFn) {
    var _this = this;

    _classCallCheck(this, KeyBy);

    this.has = function (key) {
        if (key in _this._sourceKeyByKey) return true;
        var last = null;
        while ((last = _this.next(last)) != null) if (last == key) return true;
        return false;
    };
    this.get = function (key) {
        return _this.has(key) ? _this._list.get(_this._sourceKeyByKey[key]) : undefined;
    };
    this.prev = function (key) {
        if (_this.has(key) || key == null) return _this._keyBySourceKey[_this._list.prev(_this._sourceKeyByKey[key])];
    };
    this.next = function () {
        var key = arguments[0] === undefined ? null : arguments[0];

        var sourceKey, sourceNext, res;
        if (key in _this._sourceKeyByKey) sourceKey = _this._sourceKeyByKey[key];else sourceKey = null;
        while (key != null && !(key in _this._sourceKeyByKey)) {
            sourceKey = _this._list.next(sourceKey);
            if (!(sourceKey in _this._keyBySourceKey)) {
                if (sourceKey == null) return null;
                res = _this._keyFn(_this._list.get(sourceKey), sourceKey);
                _this._keyBySourceKey[sourceKey] = res;
                _this._sourceKeyByKey[res] = sourceKey;
                if (res == key) break;
            }
        }
        sourceKey = _this._list.next(sourceKey);
        if (sourceKey == null) return null;
        res = _this._keyFn(_this._list.get(sourceKey), sourceKey);
        _this._keyBySourceKey[sourceKey] = res;
        _this._sourceKeyByKey[res] = sourceKey;
        return res;
    };
    this._list = list;
    this._keyFn = keyFn;
    this._sourceKeyByKey = Object.create(null);
    this._keyBySourceKey = Object.create(null);
};

exports.KeyBy = KeyBy;
exports["default"] = KeyBy;

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _tree = require('./tree');

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _key_by = require('./key_by');

var _key_by2 = _interopRequireDefault(_key_by);

var _async_list = require('./async_list');

var List = (function () {
    function List(list) {
        var _this = this;

        _classCallCheck(this, List);

        this.has = function (key) {
            throw new Error('Not implemented');
        };
        this.get = function (key) {
            throw new Error('Not implemented');
        };
        this.prev = function (key) {
            throw new Error('Not implemented');
        };
        this.next = function (key) {
            throw new Error('Not implemented');
        };
        this.first = function () {
            return List.first(_this);
        };
        this.last = function () {
            return List.last(_this);
        };
        this.forEach = function (fn) {
            return List.forEach(_this, fn);
        };
        this.reduce = function (fn, memo) {
            return List.reduce(_this, fn);
        };
        this.toArray = function () {
            return List.toArray(_this);
        };
        this.findKey = function (fn) {
            return List.findKey(_this, fn);
        };
        this.find = function (fn) {
            return List.find(_this, fn);
        };
        this.keyOf = function (value) {
            return List.keyOf(_this, value);
        };
        this.indexOf = function (value) {
            return List.indexOf(_this, value);
        };
        this.keyAt = function (index) {
            return List.keyAt(_this, index);
        };
        this.at = function (index) {
            return List.at(_this, index);
        };
        this.every = function (predicate) {
            return List.every(_this, predicate);
        };
        this.some = function (predicate) {
            return List.some(_this, predicate);
        };
        this.contains = function (value) {
            return List.contains(_this, value);
        };
        this.reverse = function () {
            return List.create(List.reverse(_this));
        };
        this.map = function (mapFn) {
            return List.create(List.map(_this, mapFn));
        };
        this.filter = function (filterFn) {
            return List.create(List.filter(_this, filterFn));
        };
        this.flatten = function () {
            return List.create(List.flatten(_this));
        };
        this.flatMap = function (flatMapFn) {
            return List.create(List.flatMap(_this, flatMapFn));
        };
        this.cache = function () {
            return List.create(List.cache(_this));
        };
        this.index = function () {
            return List.create(List.index(_this));
        };
        this.keyBy = function (keyFn) {
            return List.create(List.keyBy(_this, keyFn));
        };
        this.zip = function (other, zipFn) {
            return List.create(List.zip(_this, other, zipFn));
        };
        this.skip = function (k) {
            return List.create(List.skip(_this, k));
        };
        this.take = function (n) {
            return List.create(List.take(_this, n));
        };
        this.range = function (k, n) {
            return List.create(List.range(_this, k, n));
        };
        this.scan = function (scanFn, memo) {
            return List.create(List.scan(_this, scanFn, memo));
        };
        if (list != null) {
            this.has = list.has;
            this.get = list.get;
            this.prev = list.prev;
            this.next = list.next;
        }
    }

    _createClass(List, null, [{
        key: 'isList',
        value: function isList(obj) {
            return obj != null && !!obj['has'] && !!obj['get'] && !!obj['prev'] && !!obj['next'];
        }
    }, {
        key: 'create',
        value: function create(list) {
            return new List({
                has: list.has,
                get: list.get,
                prev: list.prev,
                next: list.next
            });
        }
    }, {
        key: 'first',
        value: function first(list) {
            return list.get(list.next());
        }
    }, {
        key: 'last',
        value: function last(list) {
            return list.get(list.prev());
        }
    }, {
        key: 'forEach',
        value: function forEach(list, fn) {
            var key;
            while ((key = list.next(key)) != null) fn(list.get(key), key);
        }
    }, {
        key: 'reduce',
        value: function reduce(list, fn, memo) {
            var key;
            while ((key = list.next(key)) != null) memo = fn(memo, list.get(key), key);
            return memo;
        }
    }, {
        key: 'toArray',
        value: function toArray(list) {
            var key,
                index = 0,
                array = [];
            while ((key = list.next(key)) != null) array[index++] = list.get(key);
            return array;
        }
    }, {
        key: 'findKey',
        value: function findKey(list, fn) {
            var key;
            while ((key = list.next(key)) != null) if (fn(list.get(key), key)) return key;
        }
    }, {
        key: 'find',
        value: function find(list, fn) {
            return list.get(List.findKey(list, fn));
        }
    }, {
        key: 'keyOf',
        value: function keyOf(list, value) {
            return List.findKey(list, function (v) {
                return v === value;
            });
        }
    }, {
        key: 'indexOf',
        value: function indexOf(list, value) {
            var key,
                i = 0;
            while ((key = list.next(key)) != null) {
                if (list.get(key) === value) return i;
                i++;
            }
        }
    }, {
        key: 'keyAt',
        value: function keyAt(list, index) {
            var key,
                i = 0;
            while ((key = list.next(key)) != null) if (i++ == index) return key;
            return null;
        }
    }, {
        key: 'at',
        value: function at(list, index) {
            return list.get(List.keyAt(list, index));
        }
    }, {
        key: 'every',
        value: function every(list, predicate) {
            var key;
            while ((key = list.next(key)) != null) if (!predicate(list.get(key), key)) return false;
            return true;
        }
    }, {
        key: 'some',
        value: function some(list, predicate) {
            var key;
            while ((key = list.next(key)) != null) if (predicate(list.get(key), key)) return true;
            return false;
        }
    }, {
        key: 'contains',
        value: function contains(list, value) {
            return List.some(list, function (v) {
                return v === value;
            });
        }
    }, {
        key: 'reverse',
        value: function reverse(list) {
            var has = list.has;
            var get = list.get;

            function prev(key) {
                return list.next(key);
            }
            function next(key) {
                return list.prev(key);
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'map',
        value: function map(list, mapFn) {
            var has = list.has;
            var prev = list.prev;
            var next = list.next;

            function get(key) {
                return has(key) ? mapFn(list.get(key), key) : undefined;
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'filter',
        value: function filter(list, filterFn) {
            function has(key) {
                return list.has(key) && filterFn(list.get(key), key);
            }
            function get(key) {
                if (has(key)) return list.get(key);
                return;
            }
            function prev(key) {
                var prev = key;
                while ((prev = list.prev(prev)) != null) if (has(prev)) return prev;
                return null;
            }
            function next(key) {
                var next = key;
                while ((next = list.next(next)) != null) if (has(next)) return next;
                return null;
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'flatten',
        value: function flatten(list) {
            function has(key) {
                var path = _tree.Path.create(key);
                return _tree.Tree.has(list, path, 1);
            }
            function get(key) {
                var path = _tree.Path.create(key);
                return _tree.Tree.get(list, path, 1);
            }
            function prev(key) {
                var path = _tree.Path.create(key);
                return _tree.Path.key(_tree.Tree.prev(list, path, 1));
            }
            function next(key) {
                var path = _tree.Path.create(key);
                return _tree.Path.key(_tree.Tree.next(list, path, 1));
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'flatMap',
        value: function flatMap(list, flatMapFn) {
            return List.flatten(List.map(list, flatMapFn));
        }
    }, {
        key: 'cache',
        value: function cache(list) {
            return new _cache2['default'](list);
        }
    }, {
        key: 'index',
        value: function index(list) {
            return new _index2['default'](list);
        }
    }, {
        key: 'keyBy',
        value: function keyBy(list, keyFn) {
            return new _key_by2['default'](list, keyFn);
        }
    }, {
        key: 'zip',
        value: function zip(list, other, zipFn) {
            list = List.index(list);
            other = List.index(other);
            function has(key) {
                return list.has(key) && other.has(key);
            }
            function get(key) {
                return has(key) ? zipFn(list.get(key), other.get(key)) : undefined;
            }
            function prev(key) {
                var prev = list.prev(key);
                return prev != null && prev == other.prev(key) ? prev : null;
            }
            function next(key) {
                var next = list.next(key);
                return next != null && next == other.next(key) ? next : null;
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'skip',
        value: function skip(list, k) {
            return List.filter(List.index(list), function (value, key) {
                return key >= k;
            });
        }
    }, {
        key: 'take',
        value: function take(list, n) {
            return List.filter(List.index(list), function (value, key) {
                return key < n;
            });
        }
    }, {
        key: 'range',
        value: function range(list, k, n) {
            return List.filter(List.index(list), function (value, key) {
                return key >= k && key < n + k;
            });
        }
    }, {
        key: 'scan',
        value: function scan(list, scanFn, memo) {
            var has = list.has;
            var prev = list.prev;
            var next = list.next;var scanList;
            function get(key) {
                var prev = scanList.prev(key);
                return scanFn(prev != null ? scanList.get(prev) : memo, list.get(key));
            }
            scanList = List.cache({ has: has, get: get, prev: prev, next: next });
            return scanList;
        }
    }, {
        key: 'async',
        value: function async(list, scheduler) {
            return new _async_list.AsyncList(list);
        }
    }]);

    return List;
})();

exports.List = List;
exports['default'] = List;

},{"./async_list":17,"./cache":18,"./index":20,"./key_by":22,"./tree":30}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _observable_list = require("./observable_list");

var MutableList = (function (_ObservableList) {
    function MutableList(list) {
        var _this = this;

        _classCallCheck(this, MutableList);

        _get(Object.getPrototypeOf(MutableList.prototype), "constructor", this).call(this, list);
        this.set = function (key, value) {
            throw new Error("Not implemented");
        };
        this.splice = function (prev, next) {
            throw new Error("Not implemented");
        };
        this.addBefore = function (key, value) {
            return MutableList.addBefore(_this, key, value);
        };
        this.addAfter = function (key, value) {
            return MutableList.addAfter(_this, key, value);
        };
        this.push = function (value) {
            return MutableList.push(_this, value);
        };
        this.unshift = function (value) {
            return MutableList.unshift(_this, value);
        };
        this["delete"] = function (key) {
            return MutableList["delete"](_this, key);
        };
        this.deleteBefore = function (key) {
            return MutableList.deleteBefore(_this, key);
        };
        this.deleteAfter = function (key) {
            return MutableList.deleteAfter(_this, key);
        };
        this.pop = function () {
            return MutableList.pop(_this);
        };
        this.shift = function () {
            return MutableList.shift(_this);
        };
        this.remove = function (value) {
            return MutableList.remove(_this, value);
        };
        this.compose = function (lens) {
            return MutableList.create(MutableList.compose(_this, lens));
        };
        if (list != null) {
            this.set = list.set;
            this.splice = list.splice;
        }
    }

    _inherits(MutableList, _ObservableList);

    _createClass(MutableList, null, [{
        key: "isMutableList",
        value: function isMutableList(obj) {
            return _observable_list.ObservableList.isObservableList(obj) && !!obj["set"] && !!obj["splice"];
        }
    }, {
        key: "create",
        value: function create(list) {
            return new MutableList({
                has: list.has,
                get: list.get,
                prev: list.prev,
                next: list.next,
                observe: list.observe,
                set: list.set,
                splice: list.splice
            });
        }
    }, {
        key: "addBefore",
        value: function addBefore(list, key, value) {
            list.splice(list.prev(key), key, value);
            return list.prev(key);
        }
    }, {
        key: "addAfter",
        value: function addAfter(list, key, value) {
            list.splice(key, list.next(key), value);
            return list.next(key);
        }
    }, {
        key: "push",
        value: function push(list, value) {
            return MutableList.addBefore(list, null, value);
        }
    }, {
        key: "unshift",
        value: function unshift(list, value) {
            return MutableList.addAfter(list, null, value);
        }
    }, {
        key: "delete",
        value: function _delete(list, key) {
            if (!list.has(key)) return;
            var value = list.get(key);
            list.splice(list.prev(key), list.next(key));
            return value;
        }
    }, {
        key: "deleteBefore",
        value: function deleteBefore(list, key) {
            return MutableList["delete"](list, list.prev(key));
        }
    }, {
        key: "deleteAfter",
        value: function deleteAfter(list, key) {
            return MutableList["delete"](list, list.next(key));
        }
    }, {
        key: "pop",
        value: function pop(list) {
            return MutableList.deleteBefore(list, null);
        }
    }, {
        key: "shift",
        value: function shift(list) {
            return MutableList.deleteAfter(list, null);
        }
    }, {
        key: "remove",
        value: function remove(list, value) {
            var key = MutableList.keyOf(list, value);
            if (key == null) return false;
            delete (list, key);
            return true;
        }
    }, {
        key: "compose",
        value: function compose(list, lens) {
            function get(key) {
                return lens.get(list.get(key));
            }
            function set(key, value) {
                list.set(key, lens.set(list.get(key), value));
            }
            function splice(prev, next) {
                for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    values[_key - 2] = arguments[_key];
                }

                list.splice.apply(list, [prev, next].concat(_toConsumableArray(values.map(function (val) {
                    return lens.set(null, val);
                }))));
            }
            return {
                has: list.has,
                get: get,
                set: set,
                splice: splice,
                prev: list.prev,
                next: list.next,
                observe: list.observe
            };
        }
    }]);

    return MutableList;
})(_observable_list.ObservableList);

exports.MutableList = MutableList;
exports["default"] = MutableList;

},{"./observable_list":29}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _key = require('./key');

var _key2 = _interopRequireDefault(_key);

var Subject = function Subject() {
    var _this = this;

    _classCallCheck(this, Subject);

    this.observe = function (observer) {
        var observerKey = _key2['default'].create();
        _this._observers[observerKey] = observer;
        return {
            unsubscribe: function unsubscribe() {
                delete _this._observers[observerKey];
            }
        };
    };
    this.notify = function (notifier) {
        for (var observerKey in _this._observers) notifier(_this._observers[observerKey]);
    };
    this._observers = Object.create(null);
};

exports.Subject = Subject;

},{"./key":21}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var ObservableCache = (function (_Cache) {
    function ObservableCache(list) {
        var _this = this;

        _classCallCheck(this, ObservableCache);

        _get(Object.getPrototypeOf(ObservableCache.prototype), 'constructor', this).call(this, list);
        this.observe = function (observer) {
            return _this._list.observe(observer);
        };
        this.onInvalidate = function (prev, next) {
            var key;
            key = prev;
            while ((key = _this._next[key]) !== undefined) {
                delete _this._next[_this._prev[key]];
                delete _this._prev[key];
                if (key == next) break;
                delete _this._byKey[key];
            }
            while ((key = _this._prev[key]) !== undefined) {
                delete _this._prev[_this._next[key]];
                delete _this._next[key];
                if (key == prev) break;
                delete _this._byKey[key];
            }
        };
        list.observe(this);
    }

    _inherits(ObservableCache, _Cache);

    return ObservableCache;
})(_cache2['default']);

exports.ObservableCache = ObservableCache;
exports['default'] = ObservableCache;

},{"./cache":18}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _observable = require('./observable');

var ObservableIndex = (function (_Index) {
    function ObservableIndex(list) {
        var _this = this;

        _classCallCheck(this, ObservableIndex);

        _get(Object.getPrototypeOf(ObservableIndex.prototype), 'constructor', this).call(this, list);
        this.has = function (index) {
            if (index >= 0 && index < _this._byIndex.length) return true;
            var next,
                last = _this._byIndex.length - 1;
            while (last != index) {
                next = _this._list.next(_this._byIndex[last]);
                if (next == null) return false;
                _this._byIndex[++last] = next;
                _this._byKey[next] = last;
            }
            return true;
        };
        this.observe = function (observer) {
            return _this._subject.observe(observer);
        };
        this.onInvalidate = function (prev, next) {
            var prevIndex = _this._byKey[prev],
                length = _this._byIndex.length,
                index = prevIndex;
            while (++index < length) delete _this._byKey[_this._byIndex[index]];
            _this._byIndex.splice(prevIndex + 1);
            _this._subject.notify(function (observer) {
                observer.onInvalidate(prevIndex, null);
            });
        };
        this._byKey = Object.create(null);
        this._subject = new _observable.Subject();
        list.observe(this);
    }

    _inherits(ObservableIndex, _Index);

    return ObservableIndex;
})(_index2['default']);

exports.ObservableIndex = ObservableIndex;
exports['default'] = ObservableIndex;

},{"./index":20,"./observable":25}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _key_by = require('./key_by');

var _key_by2 = _interopRequireDefault(_key_by);

var _observable = require('./observable');

var ObservableKeyBy = (function (_KeyBy) {
    function ObservableKeyBy(list, keyFn) {
        var _this = this;

        _classCallCheck(this, ObservableKeyBy);

        _get(Object.getPrototypeOf(ObservableKeyBy.prototype), 'constructor', this).call(this, list, keyFn);
        this.observe = function (observer) {
            return _this._subject.observe(observer);
        };
        this.onInvalidate = function (prev, next) {
            _this._subject.notify(function (observer) {
                observer.onInvalidate(this._keyBySourceKey[prev], this._keyBySourceKey[next]);
            });
        };
        this._subject = new _observable.Subject();
        list.observe(this);
    }

    _inherits(ObservableKeyBy, _KeyBy);

    return ObservableKeyBy;
})(_key_by2['default']);

exports.ObservableKeyBy = ObservableKeyBy;
exports['default'] = ObservableKeyBy;

},{"./key_by":22,"./observable":25}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _list = require('./list');

var _tree = require('./tree');

var _observable = require('./observable');

var _observable_cache = require('./observable_cache');

var _observable_cache2 = _interopRequireDefault(_observable_cache);

var _observable_index = require('./observable_index');

var _observable_index2 = _interopRequireDefault(_observable_index);

var _observable_key_by = require('./observable_key_by');

var _observable_key_by2 = _interopRequireDefault(_observable_key_by);

;

var ObservableList = (function (_List) {
    function ObservableList(list) {
        var _this = this;

        _classCallCheck(this, ObservableList);

        _get(Object.getPrototypeOf(ObservableList.prototype), 'constructor', this).call(this, list);
        this.observe = function (observer) {
            throw new Error('Not implemented');
        };
        this.reverse = function () {
            return ObservableList.create(ObservableList.reverse(_this));
        };
        this.map = function (mapFn) {
            return ObservableList.create(ObservableList.map(_this, mapFn));
        };
        this.filter = function (filterFn) {
            return ObservableList.create(ObservableList.filter(_this, filterFn));
        };
        this.flatten = function () {
            return ObservableList.create(ObservableList.flatten(_this));
        };
        this.flatMap = function (flatMapFn) {
            return ObservableList.create(ObservableList.flatMap(_this, flatMapFn));
        };
        this.cache = function () {
            return ObservableList.create(ObservableList.cache(_this));
        };
        this.index = function () {
            return ObservableList.create(ObservableList.index(_this));
        };
        this.keyBy = function (keyFn) {
            return ObservableList.create(ObservableList.keyBy(_this, keyFn));
        };
        this.zip = function (other, zipFn) {
            return ObservableList.create(ObservableList.zip(_this, other, zipFn));
        };
        this.skip = function (k) {
            return ObservableList.create(ObservableList.skip(_this, k));
        };
        this.take = function (n) {
            return ObservableList.create(ObservableList.take(_this, n));
        };
        this.range = function (k, n) {
            return ObservableList.create(ObservableList.range(_this, k, n));
        };
        this.scan = function (scanFn, memo) {
            return ObservableList.create(ObservableList.scan(_this, scanFn, memo));
        };
        if (list != null) this.observe = list.observe;
    }

    _inherits(ObservableList, _List);

    _createClass(ObservableList, null, [{
        key: 'isObservableList',
        value: function isObservableList(obj) {
            return _list.List.isList(obj) && !!obj['observe'];
        }
    }, {
        key: 'create',
        value: function create(list) {
            return new ObservableList({
                has: list.has,
                get: list.get,
                prev: list.prev,
                next: list.next,
                observe: list.observe
            });
        }
    }, {
        key: 'reverse',
        value: function reverse(list) {
            var _List$reverse = _list.List.reverse(list);

            var has = _List$reverse.has;
            var get = _List$reverse.get;
            var prev = _List$reverse.prev;
            var next = _List$reverse.next;

            function observe(observer) {
                return list.observe({
                    onInvalidate: function onInvalidate(prev, next) {
                        observer.onInvalidate(next, prev);
                    }
                });
            }
            return { has: has, get: get, prev: prev, next: next, observe: observe };
        }
    }, {
        key: 'map',
        value: function map(list, mapFn) {
            var _List$map = _list.List.map(list, mapFn);

            var has = _List$map.has;
            var get = _List$map.get;
            var prev = _List$map.prev;
            var next = _List$map.next;

            return { has: has, get: get, prev: prev, next: next, observe: list.observe };
        }
    }, {
        key: 'filter',
        value: function filter(list, filterFn) {
            var _List$filter = _list.List.filter(list, filterFn);

            var has = _List$filter.has;
            var get = _List$filter.get;
            var prev = _List$filter.prev;
            var next = _List$filter.next;

            function observe(observer) {
                return list.observe({
                    onInvalidate: function onInvalidate(p, n) {
                        p = has(p) ? p : prev(p);
                        n = has(n) ? n : next(n);
                        observer.onInvalidate(p, n);
                    }
                });
            }
            return { has: has, get: get, prev: prev, next: next, observe: observe };
        }
    }, {
        key: 'flatten',
        value: function flatten(list) {
            var cache;
            var subscriptions = Object.create(null);
            var subject = new _observable.Subject();
            list.observe({
                onInvalidate: function onInvalidate(prev, next) {
                    var key;
                    key = prev;
                    while ((key = cache.next(key)) != null && key != next) {
                        var subscription = subscriptions[key];
                        if (subscription) {
                            subscription.unsubscribe();
                            delete subscriptions[key];
                        }
                    }
                    key = next;
                    while ((key = cache.prev(key)) != null && key != prev) {
                        var subscription = subscriptions[key];
                        if (subscription) {
                            subscription.unsubscribe();
                            delete subscriptions[key];
                        }
                    }
                }
            });
            cache = ObservableList.cache(ObservableList.map(list, function (value, key) {
                subscriptions[key] = value.observe({
                    onInvalidate: function onInvalidate(prev, next) {
                        var prevKey,
                            nextKey,
                            prevPath = _tree.Path.append(key, prev),
                            nextPath = _tree.Path.append(key, next);
                        if (prev == null) prevPath = _tree.Tree.prev(list, _tree.Tree.next(list, prevPath));
                        if (next == null) nextPath = _tree.Tree.next(list, _tree.Tree.prev(list, nextPath));
                        prevKey = _tree.Path.key(prevPath);
                        nextKey = _tree.Path.key(nextPath);
                        subject.notify(function (observer) {
                            observer.onInvalidate(prevKey, nextKey);
                        });
                    }
                });
                return value;
            }));
            cache.observe({
                onInvalidate: function onInvalidate(prev, next) {
                    var prevKey = _tree.Path.key(_tree.Tree.prev(list, [prev])),
                        nextKey = _tree.Path.key(_tree.Tree.next(list, [next]));
                    subject.notify(function (observer) {
                        observer.onInvalidate(prevKey, nextKey);
                    });
                }
            });

            var _List$flatten = _list.List.flatten(cache);

            var has = _List$flatten.has;
            var get = _List$flatten.get;
            var next = _List$flatten.next;
            var prev = _List$flatten.prev;

            return { has: has, get: get, next: next, prev: prev, observe: subject.observe };
        }
    }, {
        key: 'flatMap',
        value: function flatMap(list, flatMapFn) {
            return ObservableList.flatten(ObservableList.map(list, flatMapFn));
        }
    }, {
        key: 'cache',
        value: function cache(list) {
            return new _observable_cache2['default'](list);
        }
    }, {
        key: 'index',
        value: function index(list) {
            return new _observable_index2['default'](list);
        }
    }, {
        key: 'keyBy',
        value: function keyBy(list, keyFn) {
            return new _observable_key_by2['default'](list, keyFn);
        }
    }, {
        key: 'zip',
        value: function zip(list, other, zipFn) {
            list = ObservableList.index(list);
            other = ObservableList.index(other);
            function has(key) {
                return list.has(key) && other.has(key);
            }
            function get(key) {
                return has(key) ? zipFn(list.get(key), other.get(key)) : undefined;
            }
            function prev(key) {
                var prev = list.prev(key);
                return prev != null && prev == other.prev(key) ? prev : null;
            }
            function next(key) {
                var next = list.next(key);
                return next != null && next == other.next(key) ? next : null;
            }
            var subject = new _observable.Subject(),
                observer = {
                onInvalidate: function onInvalidate(prev, next) {
                    subject.notify(function (_observer) {
                        _observer.onInvalidate(prev, next);
                    });
                }
            };
            list.observe(observer);
            other.observe(observer);
            return { has: has, get: get, prev: prev, next: next, observe: subject.observe };
        }
    }, {
        key: 'skip',
        value: function skip(list, k) {
            return ObservableList.filter(ObservableList.index(list), function (value, key) {
                return key >= k;
            });
        }
    }, {
        key: 'take',
        value: function take(list, n) {
            return ObservableList.filter(ObservableList.index(list), function (value, key) {
                return key < n;
            });
        }
    }, {
        key: 'range',
        value: function range(list, k, n) {
            return ObservableList.filter(ObservableList.index(list), function (value, key) {
                return key >= k && key < n + k;
            });
        }
    }, {
        key: 'scan',
        value: function scan(list, scanFn, memo) {
            var has = list.has;
            var prev = list.prev;
            var next = list.next;var scanList;
            function get(key) {
                var prev = scanList.prev(key);
                return scanFn(prev != null ? scanList.get(prev) : memo, list.get(key));
            }
            function observe(observer) {
                return list.observe({
                    onInvalidate: function onInvalidate(prev, next) {
                        observer.onInvalidate(prev, null);
                    }
                });
            }
            scanList = ObservableList.cache({ has: has, get: get, prev: prev, next: next, observe: observe });
            return scanList;
        }
    }]);

    return ObservableList;
})(_list.List);

exports.ObservableList = ObservableList;
exports['default'] = ObservableList;

},{"./list":23,"./observable":25,"./observable_cache":26,"./observable_index":27,"./observable_key_by":28,"./tree":30}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _list = require('./list');

;
var Path;
exports.Path = Path;
(function (Path) {
    function key(path) {
        return JSON.stringify(path);
    }
    Path.key = key;
    function create(key) {
        return key == null ? null : JSON.parse(key.toString());
    }
    Path.create = create;
    function head(path) {
        return path ? path[0] : null;
    }
    Path.head = head;
    function get(path, index) {
        return path[index];
    }
    Path.get = get;
    function tail(path) {
        return path == null ? [] : path.slice(1, path.length);
    }
    Path.tail = tail;
    function append(a, b) {
        return [].concat(a).concat(b);
    }
    Path.append = append;
})(Path || (exports.Path = Path = {}));
var Tree;
exports.Tree = Tree;
(function (Tree) {
    function has(list, path) {
        var depth = arguments[2] === undefined ? Infinity : arguments[2];

        var head = Path.head(path),
            tail = Path.tail(path);
        return list.has(head) && (tail.length == 0 || depth == 0 || Tree.has(list.get(head), tail, depth));
    }
    Tree.has = has;
    function get(list, path) {
        var depth = arguments[2] === undefined ? Infinity : arguments[2];

        var head = Path.head(path),
            tail = Path.tail(path);
        if (!list.has(head)) return;
        var value = list.get(head);
        if (tail.length == 0 || depth == 0) return value;
        return Tree.get(value, tail, depth);
    }
    Tree.get = get;
    function prev(list) {
        var path = arguments[1] === undefined ? [] : arguments[1];
        var depth = arguments[2] === undefined ? Infinity : arguments[2];

        var head = Path.head(path),
            tail = Path.tail(path),
            key = head,
            value;
        if (head != null && !list.has(head)) return;
        do {
            value = list.get(key);
            if (!_list.List.isList(value) || depth == 0) {
                if (key != null && key != head) return [key];
            } else {
                var prevPath = Tree.prev(value, tail, depth - 1);
                if (prevPath != null) return Path.append(key, prevPath);
                tail = [];
            }
        } while ((key = list.prev(key)) != null);
    }
    Tree.prev = prev;
    function next(list) {
        var path = arguments[1] === undefined ? [] : arguments[1];
        var depth = arguments[2] === undefined ? Infinity : arguments[2];

        var head = Path.head(path),
            tail = Path.tail(path),
            key = head,
            value;
        if (head != null && !list.has(head)) return;
        do {
            value = list.get(key);
            if (!_list.List.isList(value) || depth == 0) {
                if (key != null && key != head) return [key];
            } else {
                var nextPath = Tree.next(value, tail, depth - 1);
                if (nextPath != null) return Path.append(key, nextPath);
                tail = [];
            }
        } while ((key = list.next(key)) != null);
    }
    Tree.next = next;
})(Tree || (exports.Tree = Tree = {}));
exports['default'] = Tree;

},{"./list":23}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _key2 = require('./key');

var _key3 = _interopRequireDefault(_key2);

var _observable = require('./observable');

var _mutable_list = require('./mutable_list');

var Unit = (function (_MutableList) {
    function Unit(value) {
        var _this = this;

        _classCallCheck(this, Unit);

        _get(Object.getPrototypeOf(Unit.prototype), 'constructor', this).call(this);
        this.has = function (key) {
            return _this._key == key;
        };
        this.get = function (key) {
            if (_this.has(key)) return _this._value;
        };
        this.prev = function (key) {
            if (key == null) return _this._key;
            return null;
        };
        this.next = function (key) {
            if (key == null) return _this._key;
            return null;
        };
        this.set = function (key, value) {
            _this._key = key;
            _this._value = value;
            _this._invalidate();
        };
        this.splice = function (prev, next) {
            for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                values[_key - 2] = arguments[_key];
            }

            if (values.length) return _this.set(_key3['default'].create(), values[0]);
            delete _this._key;
            delete _this._value;
            _this._invalidate();
        };
        this.observe = function (observer) {
            return _this._subject.observe(observer);
        };
        this._invalidate = function (prev, next) {
            _this._subject.notify(function (observer) {
                observer.onInvalidate(prev, next);
            });
        };
        this._subject = new _observable.Subject();
        if (arguments.length) this.splice(null, null, value);
    }

    _inherits(Unit, _MutableList);

    return Unit;
})(_mutable_list.MutableList);

exports['default'] = Unit;
module.exports = exports['default'];

},{"./key":21,"./mutable_list":24,"./observable":25}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _observable = require('./observable');

var _mutable_list = require('./mutable_list');

var ArrayList = (function (_MutableList) {
    function ArrayList() {
        var _this = this;

        var array = arguments[0] === undefined ? [] : arguments[0];

        _classCallCheck(this, ArrayList);

        _get(Object.getPrototypeOf(ArrayList.prototype), 'constructor', this).call(this);
        this.has = function (key) {
            return key != null && -1 < key && key < _this._array.length;
        };
        this.get = function (key) {
            if (_this.has(key)) return _this._array[key];
            return;
        };
        this.prev = function (key) {
            if (key == null && _this._array.length) return _this._array.length - 1;
            if (_this._array.length > 0 && key != null && _this.has(key) && _this.has(key - 1)) return key - 1;
            return null;
        };
        this.next = function (key) {
            if (key == null && _this._array.length) return 0;
            if (_this._array.length > 0 && key != null && _this.has(key) && _this.has(key + 1)) return key + 1;
            return null;
        };
        this.set = function (key, value) {
            if (!_this.has(key)) return null;
            _this._array[key] = value;
            return key;
        };
        this.splice = function (prev, next) {
            for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                values[_key - 2] = arguments[_key];
            }

            var _array;

            if (prev == null) prev = -1;else if (!_this.has(prev)) return;
            if (next == null) next = _this._array.length;else if (!_this.has(next)) return;
            (_array = _this._array).splice.apply(_array, [prev + 1, next - (prev + 1)].concat(values));
            _this._invalidate(prev, null);
        };
        this.observe = function (observer) {
            return _this._subject.observe(observer);
        };
        this._invalidate = function (prev, next) {
            if (!_this.has(prev)) prev = null;
            if (!_this.has(next)) next = null;
            _this._subject.notify(function (observer) {
                observer.onInvalidate(prev, next);
            });
        };
        this._subject = new _observable.Subject();
        this._array = array;
    }

    _inherits(ArrayList, _MutableList);

    return ArrayList;
})(_mutable_list.MutableList);

exports['default'] = ArrayList;
module.exports = exports['default'];

},{"./mutable_list":39,"./observable":40}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AsyncList = (function () {
    function AsyncList(list, scheduler) {
        var _this = this;

        _classCallCheck(this, AsyncList);

        this.has = function (key) {
            return new Promise(function (resolve, reject) {
                _this._scheduler(function () {
                    Promise.resolve(_this._list.has(key)).then(resolve)["catch"](reject);
                });
            });
        };
        this.get = function (key) {
            return new Promise(function (resolve, reject) {
                _this.has(key).then(function (has) {
                    return has ? resolve(_this._list.get(key)) : reject();
                })["catch"](reject);
            });
        };
        this.prev = function (key) {
            return new Promise(function (resolve, reject) {
                _this._scheduler(function () {
                    Promise.resolve(_this._list.prev(key)).then(function (prev) {
                        return prev != null ? resolve(prev) : reject();
                    })["catch"](reject);
                });
            });
        };
        this.next = function (key) {
            return new Promise(function (resolve, reject) {
                _this._scheduler(function () {
                    Promise.resolve(_this._list.next(key)).then(function (prev) {
                        return prev != null ? resolve(prev) : reject();
                    })["catch"](reject);
                });
            });
        };
        this._list = list;
        this._scheduler = scheduler || window.setTimeout;
    }

    _createClass(AsyncList, null, [{
        key: "create",
        value: function create(list) {
            return new AsyncList(list);
        }
    }, {
        key: "map",
        value: function map(list, mapFn) {
            var has = list.has;
            var prev = list.prev;
            var next = list.next;

            function get(key) {
                return list.get(key).then(mapFn);
            }
            return new AsyncList({ has: has, get: get, prev: prev, next: next });
        }
    }]);

    return AsyncList;
})();

exports.AsyncList = AsyncList;
exports["default"] = AsyncList;

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = function Cache(list) {
    var _this = this;

    _classCallCheck(this, Cache);

    this.has = function (key) {
        return key in _this._byKey || _this._list.has(key);
    };
    this.get = function (key) {
        if (key in _this._byKey) return _this._byKey[key];
        if (_this._list.has(key)) return _this._byKey[key] = _this._list.get(key);
        return;
    };
    this.prev = function (key) {
        if (key in _this._prev) return _this._prev[key];
        var prevKey = _this._list.prev(key);
        if (prevKey == null) prevKey = null;
        _this._prev[key] = prevKey;
        _this._next[prevKey] = key;
        return prevKey;
    };
    this.next = function () {
        var key = arguments[0] === undefined ? null : arguments[0];

        if (key in _this._next) return _this._next[key];
        var nextKey = _this._list.next(key);
        if (nextKey == null) nextKey = null;
        _this._next[key] = nextKey;
        _this._prev[nextKey] = key;
        return nextKey;
    };
    this._byKey = Object.create(null), this._next = Object.create(null), this._prev = Object.create(null);
    this._list = list;
};

exports.Cache = Cache;
exports["default"] = Cache;

},{}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Index = function Index(list) {
    var _this = this;

    _classCallCheck(this, Index);

    this.has = function (index) {
        if (index >= 0 && index < _this._byIndex.length) return true;
        var next,
            last = _this._byIndex.length - 1;
        while (last != index) {
            next = _this._list.next(_this._byIndex[last]);
            if (next == null) return false;
            _this._byIndex[++last] = next;
        }
        return true;
    };
    this.get = function (index) {
        return _this.has(index) ? _this._list.get(_this._byIndex[index]) : undefined;
    };
    this.prev = function (index) {
        if (_this.has(index - 1)) return index - 1;
        if (index == null && _this._byIndex.length) return _this._byIndex.length - 1;
        return null;
    };
    this.next = function () {
        var index = arguments[0] === undefined ? -1 : arguments[0];

        if (_this.has(index + 1)) return index + 1;
        return null;
    };
    this._byIndex = [];
    this._list = list;
};

exports.Index = Index;
exports["default"] = Index;

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Key;
(function (Key) {
    var uniqueKey = 0;
    function key(key) {
        return key.toString();
    }
    Key.key = key;
    function create() {
        return uniqueKey++;
    }
    Key.create = create;
})(Key || (Key = {}));
exports["default"] = Key;
module.exports = exports["default"];

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyBy = function KeyBy(list, keyFn) {
    var _this = this;

    _classCallCheck(this, KeyBy);

    this.has = function (key) {
        if (key in _this._sourceKeyByKey) return true;
        var last = null;
        while ((last = _this.next(last)) != null) if (last == key) return true;
        return false;
    };
    this.get = function (key) {
        return _this.has(key) ? _this._list.get(_this._sourceKeyByKey[key]) : undefined;
    };
    this.prev = function (key) {
        if (_this.has(key) || key == null) return _this._keyBySourceKey[_this._list.prev(_this._sourceKeyByKey[key])];
    };
    this.next = function () {
        var key = arguments[0] === undefined ? null : arguments[0];

        var sourceKey, sourceNext, res;
        if (key in _this._sourceKeyByKey) sourceKey = _this._sourceKeyByKey[key];else sourceKey = null;
        while (key != null && !(key in _this._sourceKeyByKey)) {
            sourceKey = _this._list.next(sourceKey);
            if (!(sourceKey in _this._keyBySourceKey)) {
                if (sourceKey == null) return null;
                res = _this._keyFn(_this._list.get(sourceKey), sourceKey);
                _this._keyBySourceKey[sourceKey] = res;
                _this._sourceKeyByKey[res] = sourceKey;
                if (res == key) break;
            }
        }
        sourceKey = _this._list.next(sourceKey);
        if (sourceKey == null) return null;
        res = _this._keyFn(_this._list.get(sourceKey), sourceKey);
        _this._keyBySourceKey[sourceKey] = res;
        _this._sourceKeyByKey[res] = sourceKey;
        return res;
    };
    this._list = list;
    this._keyFn = keyFn;
    this._sourceKeyByKey = Object.create(null);
    this._keyBySourceKey = Object.create(null);
};

exports.KeyBy = KeyBy;
exports["default"] = KeyBy;

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _tree = require('./tree');

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _key_by = require('./key_by');

var _key_by2 = _interopRequireDefault(_key_by);

var _async_list = require('./async_list');

var List = (function () {
    function List(list) {
        var _this = this;

        _classCallCheck(this, List);

        this.has = function (key) {
            throw new Error('Not implemented');
        };
        this.get = function (key) {
            throw new Error('Not implemented');
        };
        this.prev = function (key) {
            throw new Error('Not implemented');
        };
        this.next = function (key) {
            throw new Error('Not implemented');
        };
        this.first = function () {
            return List.first(_this);
        };
        this.last = function () {
            return List.last(_this);
        };
        this.forEach = function (fn) {
            return List.forEach(_this, fn);
        };
        this.reduce = function (fn, memo) {
            return List.reduce(_this, fn);
        };
        this.toArray = function () {
            return List.toArray(_this);
        };
        this.findKey = function (fn) {
            return List.findKey(_this, fn);
        };
        this.find = function (fn) {
            return List.find(_this, fn);
        };
        this.keyOf = function (value) {
            return List.keyOf(_this, value);
        };
        this.indexOf = function (value) {
            return List.indexOf(_this, value);
        };
        this.keyAt = function (index) {
            return List.keyAt(_this, index);
        };
        this.at = function (index) {
            return List.at(_this, index);
        };
        this.every = function (predicate) {
            return List.every(_this, predicate);
        };
        this.some = function (predicate) {
            return List.some(_this, predicate);
        };
        this.contains = function (value) {
            return List.contains(_this, value);
        };
        this.reverse = function () {
            return List.create(List.reverse(_this));
        };
        this.map = function (mapFn) {
            return List.create(List.map(_this, mapFn));
        };
        this.filter = function (filterFn) {
            return List.create(List.filter(_this, filterFn));
        };
        this.flatten = function () {
            return List.create(List.flatten(_this));
        };
        this.flatMap = function (flatMapFn) {
            return List.create(List.flatMap(_this, flatMapFn));
        };
        this.cache = function () {
            return List.create(List.cache(_this));
        };
        this.index = function () {
            return List.create(List.index(_this));
        };
        this.keyBy = function (keyFn) {
            return List.create(List.keyBy(_this, keyFn));
        };
        this.zip = function (other, zipFn) {
            return List.create(List.zip(_this, other, zipFn));
        };
        this.skip = function (k) {
            return List.create(List.skip(_this, k));
        };
        this.take = function (n) {
            return List.create(List.take(_this, n));
        };
        this.range = function (k, n) {
            return List.create(List.range(_this, k, n));
        };
        this.scan = function (scanFn, memo) {
            return List.create(List.scan(_this, scanFn, memo));
        };
        if (list != null) {
            this.has = list.has;
            this.get = list.get;
            this.prev = list.prev;
            this.next = list.next;
        }
    }

    _createClass(List, null, [{
        key: 'isList',
        value: function isList(obj) {
            return obj != null && !!obj['has'] && !!obj['get'] && !!obj['prev'] && !!obj['next'];
        }
    }, {
        key: 'create',
        value: function create(list) {
            return new List({
                has: list.has,
                get: list.get,
                prev: list.prev,
                next: list.next
            });
        }
    }, {
        key: 'first',
        value: function first(list) {
            return list.get(list.next());
        }
    }, {
        key: 'last',
        value: function last(list) {
            return list.get(list.prev());
        }
    }, {
        key: 'forEach',
        value: function forEach(list, fn) {
            var key;
            while ((key = list.next(key)) != null) fn(list.get(key), key);
        }
    }, {
        key: 'reduce',
        value: function reduce(list, fn, memo) {
            var key;
            while ((key = list.next(key)) != null) memo = fn(memo, list.get(key), key);
            return memo;
        }
    }, {
        key: 'toArray',
        value: function toArray(list) {
            var key,
                index = 0,
                array = [];
            while ((key = list.next(key)) != null) array[index++] = list.get(key);
            return array;
        }
    }, {
        key: 'findKey',
        value: function findKey(list, fn) {
            var key;
            while ((key = list.next(key)) != null) if (fn(list.get(key), key)) return key;
        }
    }, {
        key: 'find',
        value: function find(list, fn) {
            return list.get(List.findKey(list, fn));
        }
    }, {
        key: 'keyOf',
        value: function keyOf(list, value) {
            return List.findKey(list, function (v) {
                return v === value;
            });
        }
    }, {
        key: 'indexOf',
        value: function indexOf(list, value) {
            var key,
                i = 0;
            while ((key = list.next(key)) != null) {
                if (list.get(key) === value) return i;
                i++;
            }
        }
    }, {
        key: 'keyAt',
        value: function keyAt(list, index) {
            var key,
                i = 0;
            while ((key = list.next(key)) != null) if (i++ == index) return key;
            return null;
        }
    }, {
        key: 'at',
        value: function at(list, index) {
            return list.get(List.keyAt(list, index));
        }
    }, {
        key: 'every',
        value: function every(list, predicate) {
            var key;
            while ((key = list.next(key)) != null) if (!predicate(list.get(key), key)) return false;
            return true;
        }
    }, {
        key: 'some',
        value: function some(list, predicate) {
            var key;
            while ((key = list.next(key)) != null) if (predicate(list.get(key), key)) return true;
            return false;
        }
    }, {
        key: 'contains',
        value: function contains(list, value) {
            return List.some(list, function (v) {
                return v === value;
            });
        }
    }, {
        key: 'reverse',
        value: function reverse(list) {
            var has = list.has;
            var get = list.get;

            function prev(key) {
                return list.next(key);
            }
            function next(key) {
                return list.prev(key);
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'map',
        value: function map(list, mapFn) {
            var has = list.has;
            var prev = list.prev;
            var next = list.next;

            function get(key) {
                return has(key) ? mapFn(list.get(key), key) : undefined;
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'filter',
        value: function filter(list, filterFn) {
            function has(key) {
                return list.has(key) && filterFn(list.get(key), key);
            }
            function get(key) {
                if (has(key)) return list.get(key);
                return;
            }
            function prev(key) {
                var prev = key;
                while ((prev = list.prev(prev)) != null) if (has(prev)) return prev;
                return null;
            }
            function next(key) {
                var next = key;
                while ((next = list.next(next)) != null) if (has(next)) return next;
                return null;
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'flatten',
        value: function flatten(list) {
            function has(key) {
                var path = _tree.Path.create(key);
                return _tree.Tree.has(list, path, 1);
            }
            function get(key) {
                var path = _tree.Path.create(key);
                return _tree.Tree.get(list, path, 1);
            }
            function prev(key) {
                var path = _tree.Path.create(key);
                return _tree.Path.key(_tree.Tree.prev(list, path, 1));
            }
            function next(key) {
                var path = _tree.Path.create(key);
                return _tree.Path.key(_tree.Tree.next(list, path, 1));
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'flatMap',
        value: function flatMap(list, flatMapFn) {
            return List.flatten(List.map(list, flatMapFn));
        }
    }, {
        key: 'cache',
        value: function cache(list) {
            return new _cache2['default'](list);
        }
    }, {
        key: 'index',
        value: function index(list) {
            return new _index2['default'](list);
        }
    }, {
        key: 'keyBy',
        value: function keyBy(list, keyFn) {
            return new _key_by2['default'](list, keyFn);
        }
    }, {
        key: 'zip',
        value: function zip(list, other, zipFn) {
            list = List.index(list);
            other = List.index(other);
            function has(key) {
                return list.has(key) && other.has(key);
            }
            function get(key) {
                return has(key) ? zipFn(list.get(key), other.get(key)) : undefined;
            }
            function prev(key) {
                var prev = list.prev(key);
                return prev != null && prev == other.prev(key) ? prev : null;
            }
            function next(key) {
                var next = list.next(key);
                return next != null && next == other.next(key) ? next : null;
            }
            return { has: has, get: get, prev: prev, next: next };
        }
    }, {
        key: 'skip',
        value: function skip(list, k) {
            return List.filter(List.index(list), function (value, key) {
                return key >= k;
            });
        }
    }, {
        key: 'take',
        value: function take(list, n) {
            return List.filter(List.index(list), function (value, key) {
                return key < n;
            });
        }
    }, {
        key: 'range',
        value: function range(list, k, n) {
            return List.filter(List.index(list), function (value, key) {
                return key >= k && key < n + k;
            });
        }
    }, {
        key: 'scan',
        value: function scan(list, scanFn, memo) {
            var has = list.has;
            var prev = list.prev;
            var next = list.next;var scanList;
            function get(key) {
                var prev = scanList.prev(key);
                return scanFn(prev != null ? scanList.get(prev) : memo, list.get(key));
            }
            scanList = List.cache({ has: has, get: get, prev: prev, next: next });
            return scanList;
        }
    }, {
        key: 'async',
        value: function async(list, scheduler) {
            return new _async_list.AsyncList(list);
        }
    }]);

    return List;
})();

exports.List = List;
exports['default'] = List;

},{"./async_list":33,"./cache":34,"./index":35,"./key_by":37,"./tree":45}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _observable_list = require("./observable_list");

var MutableList = (function (_ObservableList) {
    function MutableList(list) {
        var _this = this;

        _classCallCheck(this, MutableList);

        _get(Object.getPrototypeOf(MutableList.prototype), "constructor", this).call(this, list);
        this.set = function (key, value) {
            throw new Error("Not implemented");
        };
        this.splice = function (prev, next) {
            throw new Error("Not implemented");
        };
        this.addBefore = function (key, value) {
            return MutableList.addBefore(_this, key, value);
        };
        this.addAfter = function (key, value) {
            return MutableList.addAfter(_this, key, value);
        };
        this.push = function (value) {
            return MutableList.push(_this, value);
        };
        this.unshift = function (value) {
            return MutableList.unshift(_this, value);
        };
        this["delete"] = function (key) {
            return MutableList["delete"](_this, key);
        };
        this.deleteBefore = function (key) {
            return MutableList.deleteBefore(_this, key);
        };
        this.deleteAfter = function (key) {
            return MutableList.deleteAfter(_this, key);
        };
        this.pop = function () {
            return MutableList.pop(_this);
        };
        this.shift = function () {
            return MutableList.shift(_this);
        };
        this.remove = function (value) {
            return MutableList.remove(_this, value);
        };
        this.compose = function (lens) {
            return MutableList.create(MutableList.compose(_this, lens));
        };
        if (list != null) {
            this.set = list.set;
            this.splice = list.splice;
        }
    }

    _inherits(MutableList, _ObservableList);

    _createClass(MutableList, null, [{
        key: "isMutableList",
        value: function isMutableList(obj) {
            return _observable_list.ObservableList.isObservableList(obj) && !!obj["set"] && !!obj["splice"];
        }
    }, {
        key: "create",
        value: function create(list) {
            return new MutableList({
                has: list.has,
                get: list.get,
                prev: list.prev,
                next: list.next,
                observe: list.observe,
                set: list.set,
                splice: list.splice
            });
        }
    }, {
        key: "addBefore",
        value: function addBefore(list, key, value) {
            list.splice(list.prev(key), key, value);
            return list.prev(key);
        }
    }, {
        key: "addAfter",
        value: function addAfter(list, key, value) {
            list.splice(key, list.next(key), value);
            return list.next(key);
        }
    }, {
        key: "push",
        value: function push(list, value) {
            return MutableList.addBefore(list, null, value);
        }
    }, {
        key: "unshift",
        value: function unshift(list, value) {
            return MutableList.addAfter(list, null, value);
        }
    }, {
        key: "delete",
        value: function _delete(list, key) {
            if (!list.has(key)) return;
            var value = list.get(key);
            list.splice(list.prev(key), list.next(key));
            return value;
        }
    }, {
        key: "deleteBefore",
        value: function deleteBefore(list, key) {
            return MutableList["delete"](list, list.prev(key));
        }
    }, {
        key: "deleteAfter",
        value: function deleteAfter(list, key) {
            return MutableList["delete"](list, list.next(key));
        }
    }, {
        key: "pop",
        value: function pop(list) {
            return MutableList.deleteBefore(list, null);
        }
    }, {
        key: "shift",
        value: function shift(list) {
            return MutableList.deleteAfter(list, null);
        }
    }, {
        key: "remove",
        value: function remove(list, value) {
            var key = MutableList.keyOf(list, value);
            if (key == null) return false;
            delete (list, key);
            return true;
        }
    }, {
        key: "compose",
        value: function compose(list, lens) {
            function get(key) {
                return lens.get(list.get(key));
            }
            function set(key, value) {
                list.set(key, lens.set(list.get(key), value));
            }
            function splice(prev, next) {
                for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    values[_key - 2] = arguments[_key];
                }

                list.splice.apply(list, [prev, next].concat(_toConsumableArray(values.map(function (val) {
                    return lens.set(null, val);
                }))));
            }
            return {
                has: list.has,
                get: get,
                set: set,
                splice: splice,
                prev: list.prev,
                next: list.next,
                observe: list.observe
            };
        }
    }]);

    return MutableList;
})(_observable_list.ObservableList);

exports.MutableList = MutableList;
exports["default"] = MutableList;

},{"./observable_list":44}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _key = require('./key');

var _key2 = _interopRequireDefault(_key);

var Subject = function Subject() {
    var _this = this;

    _classCallCheck(this, Subject);

    this.observe = function (observer) {
        var observerKey = _key2['default'].create();
        _this._observers[observerKey] = observer;
        return {
            unsubscribe: function unsubscribe() {
                delete _this._observers[observerKey];
            }
        };
    };
    this.notify = function (notifier) {
        for (var observerKey in _this._observers) notifier(_this._observers[observerKey]);
    };
    this._observers = Object.create(null);
};

exports.Subject = Subject;

},{"./key":36}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var ObservableCache = (function (_Cache) {
    function ObservableCache(list) {
        var _this = this;

        _classCallCheck(this, ObservableCache);

        _get(Object.getPrototypeOf(ObservableCache.prototype), 'constructor', this).call(this, list);
        this.observe = function (observer) {
            return _this._list.observe(observer);
        };
        this.onInvalidate = function (prev, next) {
            var key;
            key = prev;
            while ((key = _this._next[key]) !== undefined) {
                delete _this._next[_this._prev[key]];
                delete _this._prev[key];
                if (key == next) break;
                delete _this._byKey[key];
            }
            while ((key = _this._prev[key]) !== undefined) {
                delete _this._prev[_this._next[key]];
                delete _this._next[key];
                if (key == prev) break;
                delete _this._byKey[key];
            }
        };
        list.observe(this);
    }

    _inherits(ObservableCache, _Cache);

    return ObservableCache;
})(_cache2['default']);

exports.ObservableCache = ObservableCache;
exports['default'] = ObservableCache;

},{"./cache":34}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _observable = require('./observable');

var ObservableIndex = (function (_Index) {
    function ObservableIndex(list) {
        var _this = this;

        _classCallCheck(this, ObservableIndex);

        _get(Object.getPrototypeOf(ObservableIndex.prototype), 'constructor', this).call(this, list);
        this.has = function (index) {
            if (index >= 0 && index < _this._byIndex.length) return true;
            var next,
                last = _this._byIndex.length - 1;
            while (last != index) {
                next = _this._list.next(_this._byIndex[last]);
                if (next == null) return false;
                _this._byIndex[++last] = next;
                _this._byKey[next] = last;
            }
            return true;
        };
        this.observe = function (observer) {
            return _this._subject.observe(observer);
        };
        this.onInvalidate = function (prev, next) {
            var prevIndex = _this._byKey[prev],
                length = _this._byIndex.length,
                index = prevIndex;
            while (++index < length) delete _this._byKey[_this._byIndex[index]];
            _this._byIndex.splice(prevIndex + 1);
            _this._subject.notify(function (observer) {
                observer.onInvalidate(prevIndex, null);
            });
        };
        this._byKey = Object.create(null);
        this._subject = new _observable.Subject();
        list.observe(this);
    }

    _inherits(ObservableIndex, _Index);

    return ObservableIndex;
})(_index2['default']);

exports.ObservableIndex = ObservableIndex;
exports['default'] = ObservableIndex;

},{"./index":35,"./observable":40}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _key_by = require('./key_by');

var _key_by2 = _interopRequireDefault(_key_by);

var _observable = require('./observable');

var ObservableKeyBy = (function (_KeyBy) {
    function ObservableKeyBy(list, keyFn) {
        var _this = this;

        _classCallCheck(this, ObservableKeyBy);

        _get(Object.getPrototypeOf(ObservableKeyBy.prototype), 'constructor', this).call(this, list, keyFn);
        this.observe = function (observer) {
            return _this._subject.observe(observer);
        };
        this.onInvalidate = function (prev, next) {
            _this._subject.notify(function (observer) {
                observer.onInvalidate(this._keyBySourceKey[prev], this._keyBySourceKey[next]);
            });
        };
        this._subject = new _observable.Subject();
        list.observe(this);
    }

    _inherits(ObservableKeyBy, _KeyBy);

    return ObservableKeyBy;
})(_key_by2['default']);

exports.ObservableKeyBy = ObservableKeyBy;
exports['default'] = ObservableKeyBy;

},{"./key_by":37,"./observable":40}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _list = require('./list');

var _tree = require('./tree');

var _observable = require('./observable');

var _observable_cache = require('./observable_cache');

var _observable_cache2 = _interopRequireDefault(_observable_cache);

var _observable_index = require('./observable_index');

var _observable_index2 = _interopRequireDefault(_observable_index);

var _observable_key_by = require('./observable_key_by');

var _observable_key_by2 = _interopRequireDefault(_observable_key_by);

;

var ObservableList = (function (_List) {
    function ObservableList(list) {
        var _this = this;

        _classCallCheck(this, ObservableList);

        _get(Object.getPrototypeOf(ObservableList.prototype), 'constructor', this).call(this, list);
        this.observe = function (observer) {
            throw new Error('Not implemented');
        };
        this.reverse = function () {
            return ObservableList.create(ObservableList.reverse(_this));
        };
        this.map = function (mapFn) {
            return ObservableList.create(ObservableList.map(_this, mapFn));
        };
        this.filter = function (filterFn) {
            return ObservableList.create(ObservableList.filter(_this, filterFn));
        };
        this.flatten = function () {
            return ObservableList.create(ObservableList.flatten(_this));
        };
        this.flatMap = function (flatMapFn) {
            return ObservableList.create(ObservableList.flatMap(_this, flatMapFn));
        };
        this.cache = function () {
            return ObservableList.create(ObservableList.cache(_this));
        };
        this.index = function () {
            return ObservableList.create(ObservableList.index(_this));
        };
        this.keyBy = function (keyFn) {
            return ObservableList.create(ObservableList.keyBy(_this, keyFn));
        };
        this.zip = function (other, zipFn) {
            return ObservableList.create(ObservableList.zip(_this, other, zipFn));
        };
        this.skip = function (k) {
            return ObservableList.create(ObservableList.skip(_this, k));
        };
        this.take = function (n) {
            return ObservableList.create(ObservableList.take(_this, n));
        };
        this.range = function (k, n) {
            return ObservableList.create(ObservableList.range(_this, k, n));
        };
        this.scan = function (scanFn, memo) {
            return ObservableList.create(ObservableList.scan(_this, scanFn, memo));
        };
        if (list != null) this.observe = list.observe;
    }

    _inherits(ObservableList, _List);

    _createClass(ObservableList, null, [{
        key: 'isObservableList',
        value: function isObservableList(obj) {
            return _list.List.isList(obj) && !!obj['observe'];
        }
    }, {
        key: 'create',
        value: function create(list) {
            return new ObservableList({
                has: list.has,
                get: list.get,
                prev: list.prev,
                next: list.next,
                observe: list.observe
            });
        }
    }, {
        key: 'reverse',
        value: function reverse(list) {
            var _List$reverse = _list.List.reverse(list);

            var has = _List$reverse.has;
            var get = _List$reverse.get;
            var prev = _List$reverse.prev;
            var next = _List$reverse.next;

            function observe(observer) {
                return list.observe({
                    onInvalidate: function onInvalidate(prev, next) {
                        observer.onInvalidate(next, prev);
                    }
                });
            }
            return { has: has, get: get, prev: prev, next: next, observe: observe };
        }
    }, {
        key: 'map',
        value: function map(list, mapFn) {
            var _List$map = _list.List.map(list, mapFn);

            var has = _List$map.has;
            var get = _List$map.get;
            var prev = _List$map.prev;
            var next = _List$map.next;

            return { has: has, get: get, prev: prev, next: next, observe: list.observe };
        }
    }, {
        key: 'filter',
        value: function filter(list, filterFn) {
            var _List$filter = _list.List.filter(list, filterFn);

            var has = _List$filter.has;
            var get = _List$filter.get;
            var prev = _List$filter.prev;
            var next = _List$filter.next;

            function observe(observer) {
                return list.observe({
                    onInvalidate: function onInvalidate(p, n) {
                        p = has(p) ? p : prev(p);
                        n = has(n) ? n : next(n);
                        observer.onInvalidate(p, n);
                    }
                });
            }
            return { has: has, get: get, prev: prev, next: next, observe: observe };
        }
    }, {
        key: 'flatten',
        value: function flatten(list) {
            var cache;
            var subscriptions = Object.create(null);
            var subject = new _observable.Subject();
            list.observe({
                onInvalidate: function onInvalidate(prev, next) {
                    var key;
                    key = prev;
                    while ((key = cache.next(key)) != null && key != next) {
                        var subscription = subscriptions[key];
                        if (subscription) {
                            subscription.unsubscribe();
                            delete subscriptions[key];
                        }
                    }
                    key = next;
                    while ((key = cache.prev(key)) != null && key != prev) {
                        var subscription = subscriptions[key];
                        if (subscription) {
                            subscription.unsubscribe();
                            delete subscriptions[key];
                        }
                    }
                }
            });
            cache = ObservableList.cache(ObservableList.map(list, function (value, key) {
                subscriptions[key] = value.observe({
                    onInvalidate: function onInvalidate(prev, next) {
                        var prevKey,
                            nextKey,
                            prevPath = _tree.Path.append(key, prev),
                            nextPath = _tree.Path.append(key, next);
                        if (prev == null) prevPath = _tree.Tree.prev(list, _tree.Tree.next(list, prevPath));
                        if (next == null) nextPath = _tree.Tree.next(list, _tree.Tree.prev(list, nextPath));
                        prevKey = _tree.Path.key(prevPath);
                        nextKey = _tree.Path.key(nextPath);
                        subject.notify(function (observer) {
                            observer.onInvalidate(prevKey, nextKey);
                        });
                    }
                });
                return value;
            }));
            cache.observe({
                onInvalidate: function onInvalidate(prev, next) {
                    var prevKey = _tree.Path.key(_tree.Tree.prev(list, [prev])),
                        nextKey = _tree.Path.key(_tree.Tree.next(list, [next]));
                    subject.notify(function (observer) {
                        observer.onInvalidate(prevKey, nextKey);
                    });
                }
            });

            var _List$flatten = _list.List.flatten(cache);

            var has = _List$flatten.has;
            var get = _List$flatten.get;
            var next = _List$flatten.next;
            var prev = _List$flatten.prev;

            return { has: has, get: get, next: next, prev: prev, observe: subject.observe };
        }
    }, {
        key: 'flatMap',
        value: function flatMap(list, flatMapFn) {
            return ObservableList.flatten(ObservableList.map(list, flatMapFn));
        }
    }, {
        key: 'cache',
        value: function cache(list) {
            return new _observable_cache2['default'](list);
        }
    }, {
        key: 'index',
        value: function index(list) {
            return new _observable_index2['default'](list);
        }
    }, {
        key: 'keyBy',
        value: function keyBy(list, keyFn) {
            return new _observable_key_by2['default'](list, keyFn);
        }
    }, {
        key: 'zip',
        value: function zip(list, other, zipFn) {
            list = ObservableList.index(list);
            other = ObservableList.index(other);
            function has(key) {
                return list.has(key) && other.has(key);
            }
            function get(key) {
                return has(key) ? zipFn(list.get(key), other.get(key)) : undefined;
            }
            function prev(key) {
                var prev = list.prev(key);
                return prev != null && prev == other.prev(key) ? prev : null;
            }
            function next(key) {
                var next = list.next(key);
                return next != null && next == other.next(key) ? next : null;
            }
            var subject = new _observable.Subject(),
                observer = {
                onInvalidate: function onInvalidate(prev, next) {
                    subject.notify(function (_observer) {
                        _observer.onInvalidate(prev, next);
                    });
                }
            };
            list.observe(observer);
            other.observe(observer);
            return { has: has, get: get, prev: prev, next: next, observe: subject.observe };
        }
    }, {
        key: 'skip',
        value: function skip(list, k) {
            return ObservableList.filter(ObservableList.index(list), function (value, key) {
                return key >= k;
            });
        }
    }, {
        key: 'take',
        value: function take(list, n) {
            return ObservableList.filter(ObservableList.index(list), function (value, key) {
                return key < n;
            });
        }
    }, {
        key: 'range',
        value: function range(list, k, n) {
            return ObservableList.filter(ObservableList.index(list), function (value, key) {
                return key >= k && key < n + k;
            });
        }
    }, {
        key: 'scan',
        value: function scan(list, scanFn, memo) {
            var has = list.has;
            var prev = list.prev;
            var next = list.next;var scanList;
            function get(key) {
                var prev = scanList.prev(key);
                return scanFn(prev != null ? scanList.get(prev) : memo, list.get(key));
            }
            function observe(observer) {
                return list.observe({
                    onInvalidate: function onInvalidate(prev, next) {
                        observer.onInvalidate(prev, null);
                    }
                });
            }
            scanList = ObservableList.cache({ has: has, get: get, prev: prev, next: next, observe: observe });
            return scanList;
        }
    }]);

    return ObservableList;
})(_list.List);

exports.ObservableList = ObservableList;
exports['default'] = ObservableList;

},{"./list":38,"./observable":40,"./observable_cache":41,"./observable_index":42,"./observable_key_by":43,"./tree":45}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _list = require('./list');

;
var Path;
exports.Path = Path;
(function (Path) {
    function key(path) {
        return JSON.stringify(path);
    }
    Path.key = key;
    function create(key) {
        return key == null ? null : JSON.parse(key.toString());
    }
    Path.create = create;
    function head(path) {
        return path ? path[0] : null;
    }
    Path.head = head;
    function get(path, index) {
        return path[index];
    }
    Path.get = get;
    function tail(path) {
        return path == null ? [] : path.slice(1, path.length);
    }
    Path.tail = tail;
    function append(a, b) {
        return [].concat(a).concat(b);
    }
    Path.append = append;
})(Path || (exports.Path = Path = {}));
var Tree;
exports.Tree = Tree;
(function (Tree) {
    function has(list, path) {
        var depth = arguments[2] === undefined ? Infinity : arguments[2];

        var head = Path.head(path),
            tail = Path.tail(path);
        return list.has(head) && (tail.length == 0 || depth == 0 || Tree.has(list.get(head), tail, depth));
    }
    Tree.has = has;
    function get(list, path) {
        var depth = arguments[2] === undefined ? Infinity : arguments[2];

        var head = Path.head(path),
            tail = Path.tail(path);
        if (!list.has(head)) return;
        var value = list.get(head);
        if (tail.length == 0 || depth == 0) return value;
        return Tree.get(value, tail, depth);
    }
    Tree.get = get;
    function prev(list) {
        var path = arguments[1] === undefined ? [] : arguments[1];
        var depth = arguments[2] === undefined ? Infinity : arguments[2];

        var head = Path.head(path),
            tail = Path.tail(path),
            key = head,
            value;
        if (head != null && !list.has(head)) return;
        do {
            value = list.get(key);
            if (!_list.List.isList(value) || depth == 0) {
                if (key != null && key != head) return [key];
            } else {
                var prevPath = Tree.prev(value, tail, depth - 1);
                if (prevPath != null) return Path.append(key, prevPath);
                tail = [];
            }
        } while ((key = list.prev(key)) != null);
    }
    Tree.prev = prev;
    function next(list) {
        var path = arguments[1] === undefined ? [] : arguments[1];
        var depth = arguments[2] === undefined ? Infinity : arguments[2];

        var head = Path.head(path),
            tail = Path.tail(path),
            key = head,
            value;
        if (head != null && !list.has(head)) return;
        do {
            value = list.get(key);
            if (!_list.List.isList(value) || depth == 0) {
                if (key != null && key != head) return [key];
            } else {
                var nextPath = Tree.next(value, tail, depth - 1);
                if (nextPath != null) return Path.append(key, nextPath);
                tail = [];
            }
        } while ((key = list.next(key)) != null);
    }
    Tree.next = next;
})(Tree || (exports.Tree = Tree = {}));
exports['default'] = Tree;

},{"./list":38}]},{},[8])(8)
});