(function() {
  var Tails,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tails = {
    Mixins: {},
    Utils: {},
    Associations: {},
    Models: {},
    Views: {},
    config: {
      url: 'http://localhost'
    }
  };

  Tails.Utils.Hash = function(string) {
    var char, hash, i, _i, _ref;
    hash = 0;
    if (string.length === 0) {
      return hash;
    }
    for (i = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  };

  Tails.Mixins.Interceptable = {
    InstanceMethods: {
      before: function(interceptors) {
        return this.intercept({
          before: interceptors
        });
      },
      after: function(interceptors) {
        return this.intercept({
          after: interceptors
        });
      },
      intercept: function(params) {
        var fn, fns, interceptors, k, key, klass, placement, v, _i, _len, _ref, _results;
        klass = this.constructor;
        _results = [];
        for (placement in params) {
          interceptors = params[placement];
          if (!(placement === 'before' || placement === 'after')) {
            continue;
          }
          if (interceptors.these != null) {
            _ref = interceptors.these;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              key = _ref[_i];
              if (typeof key === 'function') {
                for (k in this) {
                  v = this[k];
                  if (key === v) {
                    key = k;
                    break;
                  }
                }
              }
              interceptors[key] = interceptors["do"];
            }
          }
          interceptors = _(interceptors).omit('these', 'do');
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (key in interceptors) {
              fns = interceptors[key];
              if (!_(fns).isArray()) {
                fns = [fns];
              }
              _results1.push((function() {
                var _j, _len1, _results2;
                _results2 = [];
                for (_j = 0, _len1 = fns.length; _j < _len1; _j++) {
                  fn = fns[_j];
                  _results2.push((function(_this) {
                    return function(key, fn) {
                      var after, before, interceptable, prev, _ref1, _ref2, _ref3, _ref4;
                      if ((_this.hasOwnProperty(key) || klass.prototype.hasOwnProperty(key)) && !((_this[key].before != null) || (_this[key].after != null))) {
                        interceptable = _this[key];
                        return _this[key] = function() {
                          var args, ret;
                          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                          if (placement === 'before') {
                            (this[fn] || fn).apply(this, args);
                          }
                          ret = interceptable.apply(this, args);
                          if (placement === 'after') {
                            (this[fn] || fn).apply(this, args);
                          }
                          return ret;
                        };
                      } else {
                        before = ((_ref1 = _this[key]) != null ? _ref1.klass : void 0) === klass ? (_ref2 = _this[key]) != null ? _ref2.before : void 0 : void 0;
                        after = ((_ref3 = _this[key]) != null ? _ref3.klass : void 0) === klass ? (_ref4 = _this[key]) != null ? _ref4.after : void 0 : void 0;
                        if (placement === 'before') {
                          prev = before;
                          before = function() {
                            var args;
                            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                            if (prev != null) {
                              prev.apply(this, args);
                            }
                            return (this[fn] || fn).apply(this, args);
                          };
                        } else if (placement === 'after') {
                          prev = after;
                          after = function() {
                            var args;
                            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                            (this[fn] || fn).apply(this, args);
                            return prev != null ? prev.apply(this, args) : void 0;
                          };
                        }
                        return Object.defineProperty(_this, key, {
                          configurable: true,
                          set: function(interceptable) {
                            return Object.defineProperty(this, key, {
                              writable: true,
                              value: function() {
                                var args, ret;
                                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                                if (before != null) {
                                  before.apply(this, args);
                                }
                                ret = interceptable.apply(this, args);
                                if (after != null) {
                                  after.apply(this, args);
                                }
                                return ret;
                              }
                            });
                          },
                          get: function() {
                            var interceptor;
                            interceptor = function() {
                              var args, ret, superFn, _ref5;
                              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                              if (before != null) {
                                before.apply(this, args);
                              }
                              superFn = (_ref5 = this.constructor.__super__) != null ? _ref5[key] : void 0;
                              if ((superFn != null ? superFn.klass : void 0) !== klass) {
                                ret = superFn != null ? superFn.apply(this, args) : void 0;
                              }
                              if (after != null) {
                                after.apply(this, args);
                              }
                              return ret;
                            };
                            interceptor.before = before;
                            interceptor.after = after;
                            interceptor.klass = klass;
                            return interceptor;
                          }
                        });
                      }
                    };
                  })(this)(key, fn));
                }
                return _results2;
              }).call(this));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      }
    },
    ClassMethods: {
      before: function(interceptors) {
        if ((typeof interceptors === "function" ? interceptors() : void 0) != null) {
          return this.before({
            initialize: function() {
              return this.before(interceptors.call(this));
            }
          });
        } else {
          return this.prototype.before(interceptors);
        }
      },
      after: function(interceptors) {
        if ((typeof interceptors === "function" ? interceptors() : void 0) != null) {
          return this.before({
            initialize: function() {
              return this.after(interceptors.call(this));
            }
          });
        } else {
          return this.prototype.after(interceptors);
        }
      }
    }
  };

  Tails.Mixins.Debug = {
    InstanceMethods: {
      LOG_LEVELS: {
        "ERROR": true,
        "WARNING": true,
        "INFO": false
      },
      _excludedMethods: _.union(Object.keys(Tails.Mixins.Interceptable.InstanceMethods), ["constructor", "log", "message", "warn", "error", "info"]),
      debug: function() {
        return this.LOG_LEVELS.INFO = true;
      },
      message: function() {
        var line, thing, things, _i, _len;
        things = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        line = "" + (new Date()) + " - ";
        for (_i = 0, _len = things.length; _i < _len; _i++) {
          thing = things[_i];
          if (thing.constructor.name === "String") {
            line += thing + " ";
          } else {
            line += JSON.stringify(thing) + " ";
          }
        }
        line += "in " + this.constructor.name + "(" + this.id + ")";
        return line;
      },
      error: function() {
        var line, things;
        things = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (!this.LOG_LEVELS.ERROR) {
          return;
        }
        line = this.message.apply(this, things);
        return console.error(line);
      },
      warn: function() {
        var line, things;
        things = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (!this.LOG_LEVELS.WARNING) {
          return;
        }
        line = this.message.apply(this, things);
        return console.warn(line);
      },
      log: function() {
        var line, things;
        things = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        line = this.message.apply(this, things);
        return console.log(line);
      },
      info: function() {
        var line, things;
        things = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (!this.LOG_LEVELS.INFO) {
          return;
        }
        line = this.message.apply(this, things);
        return console.log(line);
      },
      included: function() {
        this.concern(Tails.Mixins.Interceptable);
        return this.after({
          initialize: function() {
            var args, funcs, key, value, _i, _len, _results;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            this.info("Called function 'initialize' of " + this.constructor.name + " with arguments:", args);
            this.on("change", (function(_this) {
              return function(event) {
                return _this.info("Change of attributes:", event.changedAttributes());
              };
            })(this));
            funcs = (function() {
              var _results;
              _results = [];
              for (key in this) {
                value = this[key];
                if (value instanceof Function && __indexOf.call(this._excludedMethods, key) < 0) {
                  _results.push(key);
                } else {
                  continue;
                }
              }
              return _results;
            }).call(this);
            _results = [];
            for (_i = 0, _len = funcs.length; _i < _len; _i++) {
              key = funcs[_i];
              _results.push((function(_this) {
                return function(key) {
                  return _this.after({
                    "these": [key],
                    "do": function() {
                      var args;
                      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                      return this.info("Called function '" + key + "' of " + this.constructor.name + " with arguments:", args);
                    }
                  });
                };
              })(this)(key));
            }
            return _results;
          }
        });
      }
    }
  };

  Tails.Mixable = {
    MixableKeywords: ['included', 'extended', 'constructor', 'Interactions', 'InstanceMethods', 'ClassMethods'],
    _include: function(mixin) {
      var funcs, key, value, _ref;
      if (mixin.InstanceMethods != null) {
        funcs = mixin.InstanceMethods;
      } else if (mixin.ClassMethods != null) {
        return;
      } else {
        funcs = mixin;
      }
      for (key in funcs) {
        value = funcs[key];
        if (__indexOf.call(Tails.Mixable.MixableKeywords, key) < 0) {
          if (value != null) {
            this.prototype[key] = value;
          }
        }
      }
      return (_ref = funcs.included) != null ? _ref.apply(this) : void 0;
    },
    _extend: function(mixin) {
      var funcs, key, value, _ref;
      if (mixin.ClassMethods != null) {
        funcs = mixin.ClassMethods;
      } else if (mixin.InstanceMethods != null) {
        return;
      } else {
        funcs = mixin;
      }
      for (key in funcs) {
        value = funcs[key];
        if (__indexOf.call(Tails.Mixable.MixableKeywords, key) < 0) {
          if (value != null) {
            this[key] = value;
          }
        }
      }
      return (_ref = funcs.extended) != null ? _ref.apply(this) : void 0;
    },
    include: function() {
      var interactions, mixin, mixins, _i, _j, _len, _len1, _ref, _ref1;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (((_ref = this._includedMixins) != null ? _ref.klass : void 0) !== this) {
        this._includedMixins = _(this._includedMixins).clone() || [];
        this._includedMixins.klass = this;
      }
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        if (__indexOf.call(this._includedMixins, mixin) >= 0) {
          continue;
        }
        if (mixin != null) {
          this._includedMixins.push(mixin);
        }
        this._include(mixin);
        if (mixin.Interactions != null) {
          interactions = mixin.Interactions.apply(this);
          if (interactions != null) {
            this._include(interactions);
          }
        }
      }
      _ref1 = this._includedMixins;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        mixin = _ref1[_j];
        if (mixin.Interactions != null) {
          interactions = mixin.Interactions.apply(this);
          if (interactions != null) {
            this._include(interactions);
          }
        }
      }
      return this;
    },
    extend: function() {
      var interactions, mixin, mixins, _i, _j, _len, _len1, _ref, _ref1;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (((_ref = this._extendedMixins) != null ? _ref.klass : void 0) !== this) {
        this._extendedMixins = _(this._extendedMixins).clone() || [];
        this._extendedMixins.klass = this;
      }
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        if (__indexOf.call(this._extendedMixins, mixin) >= 0) {
          continue;
        }
        if (mixin != null) {
          this._extendedMixins.push(mixin);
        }
        this._extend(mixin);
        if (mixin.Interactions != null) {
          interactions = mixin.Interactions.apply(this);
          if (interactions != null) {
            this._extend(interactions);
          }
        }
      }
      _ref1 = this._extendedMixins;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        mixin = _ref1[_j];
        if (mixin.Interactions != null) {
          interactions = mixin.Interactions.apply(this);
          if (interactions != null) {
            this._extend(interactions);
          }
        }
      }
      return this;
    },
    "with": function(mixin, funcs) {
      if (funcs == null) {
        funcs = {};
      }
      if (__indexOf.call(this._includedMixins, mixin) >= 0 || __indexOf.call(this._extendedMixins, mixin) >= 0) {
        return funcs;
      } else {
        return null;
      }
    },
    concern: function() {
      var mixin, mixins, _i, _len;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        this.include(mixin);
        this.extend(mixin);
      }
      return this;
    }
  };

  Tails.Mixins.DynamicAttributes = {
    InstanceMethods: {
      getter: function(getters, fn) {
        var name;
        if (fn == null) {
          fn = null;
        }
        if (typeof getters === 'string' && (fn != null)) {
          name = getters;
          (getters = {})[name] = fn;
        }
        return this.defineAttribute({
          getter: getters
        });
      },
      setter: function(setters, fn) {
        var name;
        if (fn == null) {
          fn = null;
        }
        if (typeof setters === 'string' && (fn != null)) {
          name = setters;
          (setters = {})[name] = fn;
        }
        return this.defineAttribute({
          setter: setters
        });
      },
      lazy: function(attributes, fn) {
        var key, name, _results;
        if (fn == null) {
          fn = null;
        }
        if (typeof attributes === 'string' && (fn != null)) {
          name = attributes;
          (attributes = {})[name] = fn;
        }
        _results = [];
        for (key in attributes) {
          fn = attributes[key];
          _results.push((function(_this) {
            return function(key, fn) {
              _this.getter(key, function() {
                return _this.attributes[key] = (_this[fn] || fn).call(_this);
              });
              return _this.setter(key, function(value) {
                delete _this.attributes[key];
                return _this.attributes[key] = value;
              });
            };
          })(this)(key, fn));
        }
        return _results;
      },
      defineAttribute: function(params) {
        var attributes, fn, key, type, _results;
        _results = [];
        for (type in params) {
          attributes = params[type];
          if (type === 'getter' || type === 'setter') {
            _results.push((function() {
              var _results1;
              _results1 = [];
              for (key in attributes) {
                fn = attributes[key];
                _results1.push((function(_this) {
                  return function(key, fn) {
                    var map;
                    map = Object.getOwnPropertyDescriptor(_this.attributes, key) || {
                      configurable: true
                    };
                    delete _this.attributes[key];
                    delete map.value;
                    delete map.writable;
                    if (type === 'getter') {
                      map.get = function() {
                        return (_this[fn] || fn).call(_this);
                      };
                    } else if (type === 'setter') {
                      map.set = function(value) {
                        var result;
                        return result = (_this[fn] || fn).call(_this, value);
                      };
                    }
                    return Object.defineProperty(_this.attributes, key, map);
                  };
                })(this)(key, fn));
              }
              return _results1;
            }).call(this));
          }
        }
        return _results;
      }
    },
    ClassMethods: {
      getter: function(getters, fn) {
        var name;
        if (fn == null) {
          fn = null;
        }
        if (typeof getters === 'string' && (fn != null)) {
          name = getters;
          (getters = {})[name] = fn;
        }
        return this.before({
          initialize: function() {
            return this.getter(getters);
          }
        });
      },
      setter: function(setters, fn) {
        var name;
        if (fn == null) {
          fn = null;
        }
        if (typeof setters === 'string' && (fn != null)) {
          name = setters;
          (setters = {})[name] = fn;
        }
        return this.before({
          initialize: function() {
            return this.setter(setters);
          }
        });
      },
      lazy: function(attributes, fn) {
        var name;
        if (fn == null) {
          fn = null;
        }
        if (typeof attributes === 'string' && (fn != null)) {
          name = attributes;
          (attributes = {})[name] = fn;
        }
        return this.before({
          initialize: function() {
            return this.lazy(attributes);
          }
        });
      },
      extended: function() {
        return this.concern(Tails.Mixins.Interceptable);
      }
    }
  };

  Tails.Collection = (function(_super) {
    __extends(Collection, _super);

    _.extend(Collection, Tails.Mixable);

    Collection.prototype.syncedAt = 0;

    function Collection(models, options) {
      if (models == null) {
        models = [];
      }
      if (options == null) {
        options = {};
      }
      this.model = options.model || this.model || Tails.Model;
      this.parent = options.parent || this.parent;
      this.synced = options.synced || false;
      this.on('change', (function(_this) {
        return function(model) {
          return _this.synced = false;
        };
      })(this));
      this.on('sync', (function(_this) {
        return function() {
          _this.synced = true;
          return _this.syncedAt = Date.now();
        };
      })(this));
      Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.urlRoot = function() {
      return inflection.transform(this.model.name || this.model.toString().match(/^function\s*([^\s(]+)/)[1], ['underscore', 'pluralize']);
    };

    Collection.prototype.url = function() {
      var base, format, root, url, _ref, _ref1;
      base = ((_ref = this.parent) != null ? typeof _ref.url === "function" ? _ref.url() : void 0 : void 0) || ((_ref1 = this.parent) != null ? _ref1.url : void 0) || Tails.config.url;
      root = (typeof this.urlRoot === "function" ? this.urlRoot() : void 0) || this.urlRoot;
      format = this.format != null ? '.' + ((typeof this.format === "function" ? this.format() : void 0) || this.format) : '';
      url = "" + base + "/" + root + format;
      return url;
    };

    Collection.prototype.fetch = function(options) {
      var deferred, fetchPromise, reject, resolve;
      if (options == null) {
        options = {};
      }
      if (!options.force) {
        if (this.syncing) {
          return this._fetchPromise;
        } else if (this.synced) {
          deferred = Q.defer();
          deferred.resolve();
          return deferred.promise;
        }
      }
      options.dataType || (options.dataType = this.format);
      fetchPromise = Collection.__super__.fetch.call(this, options);
      this.synced = false;
      this.syncing = true;
      deferred = Q.defer();
      resolve = (function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _this.syncing = false;
          return deferred.resolve.apply(deferred, args);
        };
      })(this);
      reject = (function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _this.syncing = false;
          return deferred.reject.apply(deferred, args);
        };
      })(this);
      fetchPromise.then((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (_this.synced) {
            return resolve.apply(null, args);
          } else {
            return _this.once('sync', function() {
              return resolve.apply(null, args);
            });
          }
        };
      })(this));
      fetchPromise.fail((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return reject.apply(null, args);
        };
      })(this));
      return this._fetchPromise = deferred.promise;
    };

    Collection.prototype.filter = function(filter) {
      return new Tails.Collection.Filtered(this, {
        filter: filter
      });
    };

    Collection.prototype.where = function(attrs, first) {
      var assimilate, distantiate, filter, key, query;
      if (first != null) {
        return Collection.__super__.where.call(this, attrs, first);
      }
      if (typeof attrs === 'object') {
        filter = function(model) {
          var key, value;
          for (key in attrs) {
            value = attrs[key];
            if (model.get(key) !== value) {
              return false;
            }
          }
          return true;
        };
        assimilate = function(model) {
          var key, value, _results;
          _results = [];
          for (key in attrs) {
            value = attrs[key];
            _results.push(model.set(key, value));
          }
          return _results;
        };
        distantiate = function(model) {
          var key, value, _results;
          _results = [];
          for (key in attrs) {
            value = attrs[key];
            _results.push(model.unset(key));
          }
          return _results;
        };
        return new Tails.Collection.Filtered(this, {
          filter: filter,
          assimilate: assimilate,
          distantiate: distantiate
        });
      } else if (typeof attrs === 'string') {
        key = attrs;
        query = {
          is: (function(_this) {
            return function(value) {
              var selector, _base, _base1, _base2;
              (selector = {})[key] = value;
              return (_base = ((_base1 = ((_base2 = (_this._where || (_this._where = {})))[key] || (_base2[key] = {}))).is || (_base1.is = {})))[value] || (_base[value] = _this.where(selector));
            };
          })(this),
          "in": (function(_this) {
            return function(values) {
              return _this.filter(function(model) {
                var _ref;
                return _ref = model.get(key), __indexOf.call(values, _ref) >= 0;
              });
            };
          })(this),
          atLeast: (function(_this) {
            return function(value) {
              return _this.filter(function(model) {
                return model.get(key) >= value;
              });
            };
          })(this),
          atMost: (function(_this) {
            return function(value) {
              return _this.filter(function(model) {
                return model.get(key) <= value;
              });
            };
          })(this),
          greaterThan: (function(_this) {
            return function(value) {
              return _this.filter(function(model) {
                return model.get(key) > value;
              });
            };
          })(this),
          lessThan: (function(_this) {
            return function(value) {
              return _this.filter(function(model) {
                return model.get(key) < value;
              });
            };
          })(this)
        };
        return query;
      }
    };

    Collection.prototype.pluck = function(attribute) {
      return new Tails.Collection.Plucked(this, {
        attribute: attribute
      });
    };

    Collection.prototype.parse = function(response, options) {
      var attrs, model, models, _i, _len;
      if (!(response instanceof Array)) {
        response = [response];
      }
      models = [];
      for (_i = 0, _len = response.length; _i < _len; _i++) {
        attrs = response[_i];
        if (attrs instanceof Backbone.Model) {
          models.push(attrs);
          break;
        }
        model = this.model.get(attrs.id);
        model.set(attrs);
        models.push(model);
      }
      return models;
    };

    return Collection;

  })(Backbone.Deferred.Collection);

  Tails.Collection.Plucked = (function(_super) {
    __extends(Plucked, _super);

    function Plucked(collection, options) {
      if (options == null) {
        options = {};
      }
      this.collection = collection;
      this.attribute = options.attribute;
      this.length = 0;
      Plucked.__super__.constructor.call(this, [], options);
      this.collection.each((function(_this) {
        return function(model) {
          return _this.trigger('add', model.get(_this.attribute));
        };
      })(this));
      this.listenTo(collection, "change:" + this.attribute, (function(_this) {
        return function(model) {
          var previousValue, value;
          value = model.get(_this.attribute);
          previousValue = model.previous(_this.attribute);
          if (previousValue != null) {
            _this.trigger('remove', previousValue);
          }
          if (value != null) {
            return _this.trigger('add', value);
          }
        };
      })(this));
      this.listenTo(collection, 'add', (function(_this) {
        return function(model) {
          var value;
          value = model.get(_this.attribute);
          if (value != null) {
            _this.trigger('add', value);
          }
          return _this.length++;
        };
      })(this));
      this.listenTo(collection, 'remove', (function(_this) {
        return function(model) {
          var value;
          value = model.get(_this.attribute);
          if (value != null) {
            _this.trigger('remove', value);
          }
          return _this.length--;
        };
      })(this));
    }

    Plucked.prototype.contains = function(value) {
      return __indexOf.call(this.toArray(), value) >= 0;
    };

    Plucked.prototype.include = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.contains.apply(this, args);
    };

    Plucked.prototype.each = function(fn) {
      return this.collection.each((function(_this) {
        return function(model) {
          return fn(model.get(_this.attribute));
        };
      })(this));
    };

    Plucked.prototype.forEach = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.each.apply(this, args);
    };

    Plucked.prototype.toArray = function() {
      var model;
      return (function() {
        var _i, _len, _ref, _results;
        _ref = this.collection.toArray();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push(model.get(this.attribute));
        }
        return _results;
      }).call(this);
    };

    return Plucked;

  })(Tails.Collection);

  Tails.Collection.Filtered = (function(_super) {
    __extends(Filtered, _super);

    function Filtered(collection, options) {
      if (options == null) {
        options = {};
      }
      this.collection = collection;
      this.model = this.collection.model;
      this.filterFn = options.filter;
      this.assimilateFn = options.assimilate;
      this.distantiateFn = options.distantiate;
      Filtered.__super__.constructor.call(this, [], options);
      this.collection.each((function(_this) {
        return function(model) {
          if (_this.filterFn(model)) {
            return _this.add(model);
          }
        };
      })(this));
      this.listenTo(this.collection, 'add', (function(_this) {
        return function(model) {
          if (_this.filterFn(model)) {
            return _this.add(model);
          }
        };
      })(this));
      this.listenTo(this.collection, 'remove', (function(_this) {
        return function(model) {
          return _this.remove(model);
        };
      })(this));
      this.listenTo(this.collection, 'change', (function(_this) {
        return function(model) {
          if (_this.filterFn(model)) {
            return _this.add(model);
          } else {
            return _this.remove(model);
          }
        };
      })(this));
      this.on('add', (function(_this) {
        return function(model) {
          if (_this.filterFn(model)) {
            return;
          }
          if (_this.assimilateFn == null) {
            _this.remove(model);
            throw Error("Cannot assimilate model.");
          }
          _this.assimilateFn(model);
          return _this.collection.add(model);
        };
      })(this));
      this.on('remove', (function(_this) {
        return function(model) {
          if (!_this.collection.contains(model)) {
            return;
          }
          if (!_this.filterFn(model)) {
            return;
          }
          if (_this.distantiateFn == null) {
            _this.add(model);
            throw Error("Cannot distantiate model.");
          }
          return _this.distantiateFn(model);
        };
      })(this));
    }

    return Filtered;

  })(Tails.Collection);

  Tails.Collection.Multi = (function(_super) {
    __extends(Multi, _super);

    function Multi(collections, options) {
      var collection, _i, _len;
      if (collections == null) {
        collections = [];
      }
      if (options == null) {
        options = {};
      }
      this.collections = [];
      this.modelCounts = {};
      Multi.__super__.constructor.call(this, [], options);
      for (_i = 0, _len = collections.length; _i < _len; _i++) {
        collection = collections[_i];
        this.addCollection(collection);
      }
    }

    Multi.prototype.increment = function(model) {
      var _base, _name;
      (_base = this.modelCounts)[_name = model.cid] || (_base[_name] = 0);
      return ++this.modelCounts[model.cid];
    };

    Multi.prototype.decrement = function(model) {
      var _base, _name;
      (_base = this.modelCounts)[_name = model.cid] || (_base[_name] = 0);
      return --this.modelCounts[model.cid];
    };

    Multi.prototype.addCollection = function(collection) {
      if (!(collection instanceof Backbone.Collection)) {
        return;
      }
      this.model || (this.model = collection.model);
      this.collections.push(collection);
      collection.each((function(_this) {
        return function(model) {
          return _this.increment(model);
        };
      })(this));
      this.listenTo(collection, 'add', this.increment);
      this.listenTo(collection, 'remove', this.decrement);
      return this.trigger('addCollection', collection);
    };

    Multi.prototype.removeCollection = function(collection) {
      var index;
      if (!(collection instanceof Backbone.Collection)) {
        return;
      }
      index = this.collections.indexOf(collection);
      if (!(index >= 0)) {
        return;
      }
      this.collections = this.collections.slice(0, index).concat(this.collections.slice(index + 1, this.collections.length));
      collection.each((function(_this) {
        return function(model) {
          return _this.decrement(model);
        };
      })(this));
      this.stopListening(collection);
      return this.trigger('removeCollection', collection);
    };

    return Multi;

  })(Tails.Collection);

  Tails.Collection.Union = (function(_super) {
    __extends(Union, _super);

    function Union() {
      return Union.__super__.constructor.apply(this, arguments);
    }

    Union.prototype.increment = function(model) {
      if (Union.__super__.increment.apply(this, arguments) === 1) {
        return this.add(model);
      }
    };

    Union.prototype.decrement = function(model) {
      if (Union.__super__.decrement.apply(this, arguments) === 0) {
        return this.remove(model);
      }
    };

    return Union;

  })(Tails.Collection.Multi);

  Tails.Mixins.Collectable = {
    InstanceMethods: {
      included: function() {
        this.concern(Tails.Mixins.Interceptable);
        return this.after({
          initialize: function() {
            if ((this.id != null) && (this.constructor.all().get(this.id) != null)) {
              throw new Error("Duplicate " + this.constructor.name + " for id " + this.id + ".");
            }
            return this.constructor.all().add(this);
          }
        });
      }
    },
    ClassMethods: {
      all: function() {
        var _ref;
        if (((_ref = this._all) != null ? _ref.klass : void 0) !== this) {
          this._all = new Tails.Collection(null, {
            model: this
          });
          this._all.klass = this;
        }
        return this._all;
      },
      get: function(id) {
        return this.all().get(id) || new this({
          id: id
        });
      },
      scope: function(name, options) {
        return this[name] = this.all().where(options.where);
      }
    },
    Interactions: function() {
      return {
        ClassMethods: this["with"](Tails.Mixins.Storage, {
          extended: function() {
            return this.all().on('add remove', (function(_this) {
              return function(instance) {
                if (instance.id != null) {
                  return _this.store();
                }
              };
            })(this));
          }
        })
      };
    }
  };

  Tails.Associations.Relation = (function(_super) {
    __extends(Relation, _super);

    function Relation() {
      return Relation.__super__.constructor.apply(this, arguments);
    }

    _.extend(Relation, Tails.Mixable);

    Relation.concern(Tails.Mixins.DynamicAttributes);

    Relation.concern(Tails.Mixins.Collectable);

    Relation.prototype.initialize = function() {};

    return Relation;

  })(Backbone.Model);

  Tails.Associations.BelongsToRelation = (function(_super) {
    __extends(BelongsToRelation, _super);

    function BelongsToRelation() {
      return BelongsToRelation.__super__.constructor.apply(this, arguments);
    }

    BelongsToRelation.prototype.initialize = function() {
      var association, foreignKey, owner, to;
      association = this.get('association');
      to = association.get('to');
      foreignKey = this.get('foreignKey');
      owner = this.get('owner');
      this.getter({
        target: function() {
          return to.get(owner.get(foreignKey));
        }
      });
      this.setter({
        target: function(model) {
          if (model == null) {
            owner.set(foreignKey, null);
            return;
          }
          if (to.all().get(model.id) == null) {
            to.all().add(model, {
              parse: true
            });
          }
          return owner.set(foreignKey, model.id);
        }
      });
      return BelongsToRelation.__super__.initialize.apply(this, arguments);
    };

    return BelongsToRelation;

  })(Tails.Associations.Relation);

  Tails.Associations.HasOneRelation = (function(_super) {
    __extends(HasOneRelation, _super);

    function HasOneRelation() {
      return HasOneRelation.__super__.constructor.apply(this, arguments);
    }

    HasOneRelation.prototype.initialize = function() {
      var association, foreignKey, owner, source, through, to;
      owner = this.get('owner');
      association = this.get('association');
      to = association.get('to');
      foreignKey = this.get('foreignKey');
      through = this.get('through');
      source = this.get('source');
      if (through == null) {
        this.getter({
          target: (function(_this) {
            return function() {
              return to.all().where(foreignKey).is(owner.id).first();
            };
          })(this)
        });
        this.setter({
          target: (function(_this) {
            return function(model) {
              var _ref;
              if ((_ref = to.all().where(foreignKey).is(owner.id).first()) != null) {
                _ref.unset(foreignKey);
              }
              return model.set(foreignKey, owner.id);
            };
          })(this)
        });
      } else {
        this.getter({
          target: (function(_this) {
            return function() {
              return owner.get(through).get(source);
            };
          })(this)
        });
        this.setter({
          target: (function(_this) {
            return function(model) {
              return owner.get(through).set(source, model);
            };
          })(this)
        });
      }
      return HasOneRelation.__super__.initialize.apply(this, arguments);
    };

    return HasOneRelation;

  })(Tails.Associations.Relation);

  Tails.Associations.HasManyRelation = (function(_super) {
    __extends(HasManyRelation, _super);

    function HasManyRelation() {
      return HasManyRelation.__super__.constructor.apply(this, arguments);
    }

    HasManyRelation.prototype.initialize = function() {
      var association, createCollection, foreignKey, name, owner, source, sourceAssociation, store, through, throughAssociation, to;
      association = this.get('association');
      to = association.get('to');
      owner = this.get('owner');
      name = this.get('name');
      foreignKey = this.get('foreignKey');
      through = this.get('through');
      source = this.get('source');
      if (through == null) {
        store = {};
        createCollection = function() {
          store.collection = to.all().where(foreignKey).is(owner.id);
          return store.collection.parent = owner;
        };
        createCollection();
        owner.on('change:id', createCollection);
        this.getter({
          target: (function(_this) {
            return function() {
              return store.collection;
            };
          })(this)
        });
        return this.setter({
          target: (function(_this) {
            return function(models) {
              store.collection.each(function(model) {
                return model.unset(foreignKey);
              });
              return store.collection.add(models);
            };
          })(this)
        });
      } else {
        throughAssociation = owner.constructor.associations().findWhere({
          name: through
        });
        if (throughAssociation.get('type') !== 'hasMany') {
          return this.getter({
            target: (function(_this) {
              return function() {
                return owner.get(through).get(source || name);
              };
            })(this)
          });
        } else {
          sourceAssociation = (source && throughAssociation.get('to').associations().findWhere({
            name: source
          })) || throughAssociation.get('to').associations().findWhere({
            name: name,
            type: 'hasMany'
          }) || throughAssociation.get('to').associations().findWhere({
            name: inflection.singularize(name)
          });
          if (sourceAssociation.get('type') === 'hasMany') {
            source = sourceAssociation.get('name');
            return this.lazy({
              target: function() {
                var union;
                union = new Tails.Collection.Union();
                union.parent = owner;
                owner.get(through).each((function(_this) {
                  return function(model) {
                    return union.addCollection(model.get(source));
                  };
                })(this));
                owner.get(through).on('add', (function(_this) {
                  return function(model) {
                    return union.addCollection(model.get(source));
                  };
                })(this));
                owner.get(through).on('remove', (function(_this) {
                  return function(model) {
                    return union.removeCollection(model.get(source));
                  };
                })(this));
                return union;
              }
            });
          } else {
            source = sourceAssociation.get('name');
            return this.lazy({
              target: function() {
                return owner.get(through).pluck(source);
              }
            });
          }
        }
      }
    };

    return HasManyRelation;

  })(Tails.Associations.Relation);

  Tails.Associations.Association = (function(_super) {
    __extends(Association, _super);

    function Association() {
      return Association.__super__.constructor.apply(this, arguments);
    }

    _.extend(Association, Tails.Mixable);

    Association.concern(Tails.Mixins.Debug);

    Association.concern(Tails.Mixins.DynamicAttributes);

    Association.concern(Tails.Mixins.Collectable);

    Association.prototype.relations = function() {
      if (this._relations == null) {
        this._relations = new Tails.Collection([], {
          model: Tails.Associations.Relation
        });
      }
      return this._relations;
    };

    Association.prototype.apply = function(owner) {
      var attrs, model, models, relation;
      attrs = {
        association: this,
        from: this.get('from'),
        to: this.get('to'),
        name: this.get('name'),
        owner: owner
      };
      switch (this.get('type')) {
        case 'belongsTo':
          model = owner.get(attrs.name);
          relation = new Tails.Associations.BelongsToRelation(_.extend(attrs, {
            foreignKey: this.get('foreignKey') || inflection.foreign_key(attrs.to.name || attrs.to.toString().match(/^function\s*([^\s(]+)/)[1])
          }));
          if (model != null) {
            relation.set("target", model);
          }
          break;
        case 'hasOne':
          model = owner.get(attrs.name);
          relation = new Tails.Associations.HasOneRelation(_.extend(attrs, {
            foreignKey: this.get('foreignKey') || inflection.foreign_key(attrs.from.name || attrs.from.toString().match(/^function\s*([^\s(]+)/)[1]),
            through: this.get('through'),
            source: this.get('source') || this.get('name')
          }));
          if (model != null) {
            relation.set("target", model);
          }
          break;
        case 'hasMany':
          models = owner.get(attrs.name);
          relation = new Tails.Associations.HasManyRelation(_.extend(attrs, {
            foreignKey: this.get('foreignKey') || inflection.foreign_key(attrs.from.name || attrs.from.toString().match(/^function\s*([^\s(]+)/)[1]),
            through: this.get('through'),
            source: this.get('source') || this.get('name')
          }));
          if (models != null) {
            relation.set("target", models);
          }
      }
      this.relations().add(relation);
      owner.relations().add(relation);
      owner.getter(attrs.name, function() {
        return relation.get('target');
      });
      return owner.setter(attrs.name, function(value) {
        return relation.set('target', value);
      });
    };

    return Association;

  })(Backbone.Model);

  Tails.Mixins.Associable = {
    InstanceMethods: {
      relations: function() {
        if (this._relations == null) {
          this._relations = new Tails.Collection([], {
            model: Tails.Associations.Relation
          });
        }
        return this._relations;
      }
    },
    ClassMethods: {
      belongsTo: function(options) {
        return this.associate('belongsTo', options);
      },
      hasOne: function(options) {
        return this.associate('hasOne', options);
      },
      hasMany: function(options) {
        return this.associate('hasMany', options);
      },
      associate: function(type, options) {
        var association, attrs, name, to;
        name = _(options).keys()[0];
        to = options[name];
        attrs = {
          type: type,
          from: this,
          name: name,
          foreignKey: options.foreignKey,
          through: options.through,
          source: options.source
        };
        association = new Tails.Associations.Association(attrs);
        if (to.prototype instanceof Backbone.Model) {
          return association.set({
            to: to
          });
        } else {
          return association.getter({
            to: to
          });
        }
      },
      associations: function() {
        var _ref;
        if (!((_ref = this._associations) != null ? _ref.klass = this : void 0)) {
          this._associations = Tails.Associations.Association.all().where({
            from: this
          });
          this._associations.klass = this;
        }
        return this._associations;
      },
      extended: function() {
        this.concern(Tails.Mixins.DynamicAttributes);
        this.concern(Tails.Mixins.Collectable);
        this.concern(Tails.Mixins.Interceptable);
        return this.before({
          initialize: function() {
            return this.constructor.associations().each((function(_this) {
              return function(association) {
                return association.apply(_this);
              };
            })(this));
          }
        });
      }
    }
  };

  Tails.Mixins.Storage = {
    InstanceMethods: {
      storage: function() {
        return this.constructor.storage();
      },
      indexRoot: function() {
        return this.constructor.indexRoot();
      },
      store: function(data) {
        return this.constructor.store(this, data);
      },
      retrieve: function(hash) {
        return _.defaults(this.attributes, this.constructor.retrieve(this.id, hash));
      },
      included: function() {
        this.concern(Tails.Mixins.Interceptable);
        return this.after({
          initialize: function() {
            this.on("sync", this.store);
            this.retrieve();
            return this.store();
          }
        });
      }
    },
    ClassMethods: {
      storage: function() {
        return localStorage;
      },
      toJSON: function(obj) {
        return JSON.stringify(obj);
      },
      indexRoot: function() {
        return inflection.transform(this.name, ['underscore', 'pluralize']);
      },
      store: function(instance, data) {
        var indexRoot, json, key, _ref;
        if (!((instance != null) && (instance.id != null))) {
          return;
        }
        indexRoot = (_ref = typeof this.indexRoot === "function" ? this.indexRoot() : void 0) != null ? _ref : this.indexRoot;
        key = "" + indexRoot + "/" + instance.id;
        if (data != null) {
          key += "/" + Tails.Utils.Hash(this.toJSON(data));
          json = this.toJSON({
            "instance": instance,
            "data": data
          });
        } else {
          json = this.toJSON(instance);
        }
        this.storage().setItem(key, json);
        return key;
      },
      retrieve: function(id, hash) {
        var ids, indexRoot, json, key, _i, _len, _ref;
        indexRoot = (_ref = typeof this.indexRoot === "function" ? this.indexRoot() : void 0) != null ? _ref : this.indexRoot;
        if (id != null) {
          key = "" + indexRoot + "/" + id;
          if (hash != null) {
            key += "/" + hash;
          }
          json = this.storage().getItem(key);
          if (json != null) {
            return JSON.parse(json);
          }
        } else {
          json = this.storage().getItem(Tails.Utils.Hash(indexRoot));
          ids = JSON.parse(json);
          if (json != null) {
            for (_i = 0, _len = ids.length; _i < _len; _i++) {
              id = ids[_i];
              this.retrieve(id);
            }
          }
          return ids;
        }
      }
    },
    Interactions: function() {
      return {
        InstanceMethods: this["with"](Tails.Mixins.Debug, {
          included: (function(_this) {
            return function() {
              return _this.after({
                initialize: function() {
                  console.log(this.toJSON(this.name));
                  return this.after({
                    store: function() {
                      return this.log("Stored instances", this.constructor.all().pluck("id"));
                    }
                  });
                }
              });
            };
          })(this)
        }),
        ClassMethods: this["with"](Tails.Mixins.Collectable, {
          indexRoot: function() {
            var _ref;
            return (_ref = typeof this.urlRoot === "function" ? this.urlRoot() : void 0) != null ? _ref : this.urlRoot;
          },
          extended: function() {
            return this.after({
              store: function() {
                var json, key, _ref;
                key = (_ref = typeof this.indexRoot === "function" ? this.indexRoot() : void 0) != null ? _ref : this.indexRoot;
                json = this.toJSON(this.constructor.all().pluck("id"));
                return this.constructor.storage().setItem(key, json);
              }
            });
          }
        })
      };
    }
  };

  Tails.Mixins.History = {
    Interactions: function() {
      return {
        InstanceMethods: this["with"](Tails.Mixins.Storage, {
          diff: function() {
            var diff, key, prevAttrs, value, _ref;
            diff = {};
            diff.apply = (function(_this) {
              return function(context) {
                var change, key, type, values;
                if (context == null) {
                  context = _this;
                }
                for (key in diff) {
                  change = diff[key];
                  for (type in change) {
                    values = change[type];
                    switch (type) {
                      case "create":
                        context.set(key, values["value"]);
                        break;
                      case "update":
                        context.set(key, values["new"]);
                        break;
                      case "delete":
                        context.unset(key);
                    }
                  }
                }
                return context;
              };
            })(this);
            prevAttrs = this.constructor.retrieve(this.id) || {};
            _ref = this.attributes;
            for (key in _ref) {
              value = _ref[key];
              if (prevAttrs[key] !== this.get(key)) {
                if (prevAttrs[key] != null) {
                  diff[key] = {
                    "update": {
                      "old": prevAttrs[key],
                      "new": this.get(key)
                    }
                  };
                } else {
                  diff[key] = {
                    "create": {
                      "value": this.get(key)
                    }
                  };
                }
              }
            }
            for (key in prevAttrs) {
              value = prevAttrs[key];
              if (!this.has(key)) {
                diff[key] = {
                  "delete": {
                    "value": value
                  }
                };
              }
            }
            return diff;
          },
          commit: function() {
            var key;
            key = this.store(this.diff());
            return key;
          },
          included: function() {
            return this.after({
              initialize: function() {
                return this.on("change", this.commit);
              }
            });
          }
        })
      };
    }
  };

  Tails.Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    _.extend(Model, Tails.Mixable);

    Model.concern(Tails.Mixins.Associable);

    Model.prototype.syncedAt = 0;

    Model.prototype.initialize = function(attrs, options) {
      var _ref;
      if (attrs == null) {
        attrs = {};
      }
      if (options == null) {
        options = {};
      }
      this.parent = options.parent || this.parent || ((_ref = this.collection) != null ? _ref.parent : void 0);
      this.synced = options.synced || false;
      this.on('change', (function(_this) {
        return function(model) {
          return _this.synced = false;
        };
      })(this));
      this.on('sync', (function(_this) {
        return function() {
          _this.synced = true;
          return _this.syncedAt = Date.now();
        };
      })(this));
      return Model.__super__.initialize.apply(this, arguments);
    };

    Model.prototype.urlRoot = function() {
      return inflection.transform(this.constructor.name || this.constructor.toString().match(/^function\s*([^\s(]+)/)[1], ['underscore', 'pluralize']);
    };

    Model.prototype.url = function() {
      var base, format, id, root, url, _ref, _ref1;
      base = ((_ref = this.parent) != null ? typeof _ref.url === "function" ? _ref.url() : void 0 : void 0) || ((_ref1 = this.parent) != null ? _ref1.url : void 0) || Tails.config.url;
      root = (typeof this.urlRoot === "function" ? this.urlRoot() : void 0) || this.urlRoot;
      id = this.id ? "/" + this.id : '';
      format = this.format != null ? '.' + ((typeof this.format === "function" ? this.format() : void 0) || this.format) : '';
      url = "" + base + "/" + root + id + format;
      return url;
    };

    Model.prototype.fetch = function(options) {
      var deferred, fetchPromise, reject, resolve;
      if (options == null) {
        options = {};
      }
      if (!options.force) {
        if (this.syncing) {
          return this._fetchPromise;
        } else if (this.synced) {
          deferred = Q.defer();
          deferred.resolve();
          return deferred.promise;
        }
      }
      options.dataType || (options.dataType = this.format);
      fetchPromise = Model.__super__.fetch.call(this, options);
      this.synced = false;
      this.syncing = true;
      deferred = Q.defer();
      resolve = (function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _this.syncing = false;
          return deferred.resolve.apply(deferred, args);
        };
      })(this);
      reject = (function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _this.syncing = false;
          return deferred.reject.apply(deferred, args);
        };
      })(this);
      fetchPromise.then((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (_this.synced) {
            return resolve.apply(null, args);
          } else {
            return _this.once('sync', function() {
              return resolve.apply(null, args);
            });
          }
        };
      })(this));
      fetchPromise.fail((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return reject.apply(null, args);
        };
      })(this));
      return this._fetchPromise = deferred.promise;
    };

    Model.prototype.save = function(options) {
      if (options == null) {
        options = {};
      }
      return Model.__super__.save.call(this, _.defaults(options, {
        dataType: this.format
      }));
    };

    return Model;

  })(Backbone.Deferred.Model);

  Tails.Template = (function(_super) {
    __extends(Template, _super);

    function Template() {
      return Template.__super__.constructor.apply(this, arguments);
    }

    Template.concern(Tails.Mixins.Collectable);

    Template.prototype.urlRoot = 'assets';

    Template.prototype.format = 'html';

    Template.prototype.bind = function(view) {
      return this.fetch({
        parse: true
      }).then((function(_this) {
        return function() {
          var $el;
          $el = $(_this.get('html')).clone();
          rivets.bind($el, view);
          return $el;
        };
      })(this));
    };

    Template.prototype.parse = function(response, options) {
      return {
        html: response
      };
    };

    return Template;

  })(Tails.Model);

  Tails.View = (function(_super) {
    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    _.extend(View, Tails.Mixable);

    View.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      if (this.template.constructor === String) {
        this.template = Tails.Template.get(this.template);
      }
      this.template.bind(this).then((function(_this) {
        return function($el) {
          _this.setElement($el);
          return _this.render();
        };
      })(this));
      return View.__super__.initialize.call(this, options);
    };

    View.prototype.render = function() {
      return this.delegateEvents();
    };

    View.prototype.setView = function(view) {
      this.view = view;
      return this.view.render();
    };

    return View;

  })(Backbone.View);

  Tails.factory = function(exports) {
    exports._ = Tails;
    exports.Mixable = Tails.Mixable;
    exports.Model = Tails.Model;
    exports.Collection = Tails.Collection;
    exports.View = Tails.View;
    exports.Template = Tails.Template;
    exports.Mixins = Tails.Mixins;
    exports.Utils = Tails.Utils;
    exports.Association = Tails.Association;
    exports.Associations = Tails.Associations;
    exports.Models = Tails.Models;
    exports.Views = Tails.Views;
    exports.config = Tails.config;
    return exports.configure = function(options) {
      var property, value;
      if (options == null) {
        options = {};
      }
      for (property in options) {
        value = options[property];
        Tails.config[property] = value;
      }
    };
  };

  if (typeof exports === 'object') {
    Tails.factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      Tails.factory(this.Tails = exports);
      return exports;
    });
  } else {
    Tails.factory(this.Tails = {});
  }

}).call(this);
