(function() {
  var Tails,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __defProp = {}.__proto__.constructor.defineProperty,
    __getProp = {}.__proto__.constructor.getOwnPropertyDescriptor,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) __defProp(child, key, __getProp(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tails = {
    Mixins: {},
    Utils: {},
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
        klass = this.constructor || this;
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
                            delete this[key];
                            return this[key] = function() {
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
                            };
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
              var getter, setter;
              (getter = {})[key] = function() {
                return this.attributes[key] = fn();
              };
              (setter = {})[key] = function(value) {
                delete this.attributes[key];
                return this.attributes[key] = value;
              };
              _this.getter(getter);
              return _this.setter(setter);
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
                    if (type === 'getter') {
                      map.get = function() {
                        return fn.call(_this);
                      };
                    } else if (type === 'setter') {
                      map.set = function(value) {
                        return fn.call(_this, value);
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
            return this.getter((typeof getters === "function" ? getters() : void 0) || getters);
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
            return this.setter((typeof setters === "function" ? setters() : void 0) || setters);
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
            return this.lazy((typeof attributes === "function" ? attributes() : void 0) || attributes);
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

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    _.extend(Collection, Tails.Mixable);

    Collection.prototype.format = 'json';

    Collection.prototype.initialize = function(models, options) {
      if (models == null) {
        models = null;
      }
      if (options == null) {
        options = {};
      }
      this.model = options.model || this.model || Tails.Model;
      this.parent = options.parent || this.parent;
      return Collection.__super__.initialize.apply(this, arguments);
    };

    Collection.prototype.urlRoot = function() {
      return inflection.transform(this.model.name, ['underscore', 'pluralize']);
    };

    Collection.prototype.url = function() {
      var base, format, root, url, _ref, _ref1;
      base = ((_ref = this.parent) != null ? typeof _ref.url === "function" ? _ref.url() : void 0 : void 0) || ((_ref1 = this.parent) != null ? _ref1.url : void 0) || Tails.url;
      root = (typeof this.urlRoot === "function" ? this.urlRoot() : void 0) || this.urlRoot;
      format = this.format != null ? '.' + ((typeof this.format === "function" ? this.format() : void 0) || this.format) : '';
      url = "" + base + "/" + root + format;
      return url;
    };

    Collection.prototype.fetch = function(options) {
      if (options == null) {
        options = {};
      }
      return Collection.__super__.fetch.call(this, _.defaults(options, {
        dataType: this.format
      }));
    };

    Collection.prototype.parse = function(response, options) {
      var attrs, model, models, _i, _len;
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

  Tails.Mixins.Collectable = {
    InstanceMethods: {
      included: function() {
        this.concern(Tails.Mixins.Interceptable);
        return this.after({
          initialize: function() {
            if ((this.id != null) && (this.constructor.collection().get(this.id) != null)) {
              throw new Error("Duplicate " + this.constructor.name + " for id " + this.id + ".");
            }
            return this.constructor.add(this);
          }
        });
      }
    },
    ClassMethods: {
      collection: function() {
        var _ref;
        if (((_ref = this._collection) != null ? _ref.klass : void 0) !== this) {
          this._collection = new Tails.Collection(null, {
            model: this
          });
          this._collection.klass = this;
        }
        return this._collection;
      },
      get: function(id) {
        return this.collection().get(id) || new this({
          id: id
        });
      },
      scope: function(name, options) {
        var attr, collection, value, _ref;
        if (typeof name !== 'string') {
          options = name;
        }
        collection = new Tails.Collection(this.collection().where(options.where), {
          model: this,
          parent: this
        });
        _ref = options.where;
        for (attr in _ref) {
          value = _ref[attr];
          this.collection().on("change:" + attr, (function(_this) {
            return function(model, v) {
              if (v !== value && collection.contains(model)) {
                return collection.remove(model);
              } else if (v === value && !collection.contains(model)) {
                return collection.add(model);
              }
            };
          })(this));
          this.collection().on("add", (function(_this) {
            return function(model) {
              if (model.get(attr) === value && !collection.contains(model)) {
                return collection.add(model);
              }
            };
          })(this));
          this.collection().on("remove", (function(_this) {
            return function(model) {
              if (model.get(attr) === value && collection.contains(model)) {
                return collection.remove(model);
              }
            };
          })(this));
          collection.on("add", (function(_this) {
            return function(model) {
              if (model.get(attr) !== value) {
                return model.set(attr, value);
              }
            };
          })(this));
          collection.on("remove", (function(_this) {
            return function(model) {
              if (model.get(attr) === value) {
                return model.set(attr, void 0);
              }
            };
          })(this));
        }
        if (name != null) {
          this[name] = collection;
        }
        return collection;
      },
      extended: function() {
        var key, methods, _i, _len, _results;
        methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl', 'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'contains', 'invoke', 'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest', 'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'chain', 'sample', 'add', 'remove', 'set', 'at', 'push', 'pop', 'unshift', 'shift', 'slice', 'sort', 'pluck', 'where', 'findWhere', 'clone', 'create', 'fetch', 'reset', 'urlRoot', 'on', 'off', 'once', 'trigger', 'listenTo', 'stopListening', 'listenOnce'];
        _results = [];
        for (_i = 0, _len = methods.length; _i < _len; _i++) {
          key = methods[_i];
          _results.push((function(_this) {
            return function(key) {
              return _this[key] = function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return this.collection()[key].apply(this.collection(), args);
              };
            };
          })(this)(key));
        }
        return _results;
      }
    },
    Interactions: function() {
      return {
        ClassMethods: this["with"](Tails.Mixins.Storage, {
          extended: function() {
            return this.collection().on('add remove', (function(_this) {
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

  Tails.Mixins.Relations = {
    InstanceMethods: {
      belongsTo: function(relations) {
        var foreignKey, foreignName, klass, _ref, _results;
        foreignKey = relations.foreignKey;
        _ref = _(relations).omit('foreignKey');
        _results = [];
        for (foreignName in _ref) {
          klass = _ref[foreignName];
          _results.push((function(_this) {
            return function(foreignKey, foreignName, klass) {
              var foreignId, foreignModel;
              foreignKey || (foreignKey = inflection.foreign_key(klass.name));
              foreignId = _this.get(foreignKey);
              foreignModel = _this.get(foreignName);
              _this.unset(foreignKey, {
                silent: true
              });
              _this.unset(foreignName, {
                silent: true
              });
              _this.getter(foreignName, function() {
                return klass.get(_this.get(foreignKey)) || new klass({
                  id: _this.get(foreignKey)
                });
              });
              _this.setter(foreignName, function(model) {
                if (model == null) {
                  return _this.unset(foreignKey);
                }
                if (klass.get(model.id) == null) {
                  klass.create(model);
                }
                return _this.set(foreignKey, model.id);
              });
              _this.on("change:" + foreignKey, function(we, id) {
                var model, previousModel;
                model = _this.get(foreignName);
                previousModel = klass.get(_this.previous(foreignKey));
                if ((model != null) && model !== previousModel) {
                  if (previousModel) {
                    _this.stopListening(previousModel);
                  }
                  _this.trigger("change:" + foreignName, _this, model);
                  return _this.listenTo(model, "change:id", function(model, id) {
                    return _this.set(foreignKey, id);
                  });
                }
              });
              if (foreignModel != null) {
                return _this.set(foreignName, foreignModel);
              } else if (foreignId != null) {
                return _this.set(foreignKey, foreignId);
              }
            };
          })(this)(foreignKey, foreignName, klass));
        }
        return _results;
      },
      hasOne: function(relations) {
        var foreignKey, foreignName, klass, _ref, _results;
        foreignKey = relations.foreignKey;
        _ref = _(relations).omit('foreignKey');
        _results = [];
        for (foreignName in _ref) {
          klass = _ref[foreignName];
          _results.push((function(_this) {
            return function(foreignKey, foreignName, klass) {
              var attrs;
              foreignKey || (foreignKey = inflection.foreign_key(_this.constructor.name));
              attrs = {};
              attrs[foreignKey] = _this.id;
              _this.getter(foreignName, function() {
                return klass.findWhere(attrs) || new klass(attrs);
              });
              return _this.setter(foreignName, function(model) {
                _this.attributes(foreignName)[foreignKey] = void 0;
                return model[foreignKey] = _this.id;
              });
            };
          })(this)(foreignKey, foreignName, klass));
        }
        return _results;
      },
      hasMany: function(relations) {
        var foreignKey, foreignName, klass, _ref, _results;
        foreignKey = relations.foreignKey;
        _ref = _(relations).omit('foreignKey');
        _results = [];
        for (foreignName in _ref) {
          klass = _ref[foreignName];
          _results.push((function(_this) {
            return function(foreignKey, foreignName, klass) {
              var selector;
              foreignKey || (foreignKey = inflection.foreign_key(_this.constructor.name));
              (selector = {})[foreignKey] = _this.id;
              return _this.lazy(foreignName, function() {
                return klass.scope({
                  where: selector
                });
              });
            };
          })(this)(foreignKey, foreignName, klass));
        }
        return _results;
      }
    },
    ClassMethods: {
      belongsTo: function(relations) {
        return this.before({
          initialize: function() {
            return this.belongsTo((typeof relations === "function" ? relations() : void 0) || relations);
          }
        });
      },
      hasOne: function(relations) {
        return this.before({
          initialize: function() {
            return this.hasOne((typeof relations === "function" ? relations() : void 0) || relations);
          }
        });
      },
      hasMany: function(relations) {
        return this.before({
          initialize: function() {
            return this.hasMany((typeof relations === "function" ? relations() : void 0) || relations);
          }
        });
      },
      extended: function() {
        this.concern(Tails.Mixins.DynamicAttributes);
        this.concern(Tails.Mixins.Collectable);
        return this.concern(Tails.Mixins.Interceptable);
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
        if (typeof obj.has === "function" ? obj.has("$el") : void 0) {
          obj.get("$el").toJSON = function() {
            return this.clone().wrap('<div/>').parent().html();
          };
        }
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
                      return this.log("Stored instances", this.constructor.pluck("id"));
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
                json = this.toJSON(this.constructor.pluck("id"));
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

  Tails.Mixins.Debug = {
    InstanceMethods: {
      LOG_LEVELS: {
        "ERROR": true,
        "WARNING": true,
        "INFO": false
      },
      _excludedMethods: _.union(Object.keys(Tails.Mixins.Interceptable.InstanceMethods), ["constructor", "log", "message", "warn", "error", "info"]),
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

  Tails.Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    _.extend(Model, Tails.Mixable);

    Model.concern(Tails.Mixins.Relations);

    Model.prototype.format = 'json';

    Model.prototype.initialize = function(attrs, options) {
      var _ref;
      if (attrs == null) {
        attrs = {};
      }
      if (options == null) {
        options = {};
      }
      this.parent = options.parent || this.parent || ((_ref = this.collection) != null ? _ref.parent : void 0);
      return Model.__super__.initialize.apply(this, arguments);
    };

    Model.prototype.urlRoot = function() {
      return inflection.transform(this.constructor.name, ['underscore', 'pluralize']);
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
      if (options == null) {
        options = {};
      }
      return Model.__super__.fetch.call(this, _.defaults(options, {
        dataType: this.format
      }));
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
          $el = $(_this.get('$el')).clone();
          rivets.bind($el, view);
          return $el;
        };
      })(this));
    };

    Template.prototype.parse = function(response, options) {
      return {
        $el: $(response)
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
