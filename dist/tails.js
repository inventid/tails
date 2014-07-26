(function() {
  var Tails,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
    MixableKeywords: ['included', 'extended', 'constructor'],
    include: function() {
      var key, mixin, mixins, value, _i, _len, _ref, _ref1;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (((_ref = this._includedMixins) != null ? _ref.klass : void 0) !== this) {
        this._includedMixins = _(this._includedMixins).clone() || [];
        this._includedMixins.klass = this;
      }
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        if (mixin.InstanceMethods != null) {
          mixin = mixin.InstanceMethods;
        }
        if (__indexOf.call(this._includedMixins, mixin) >= 0 || (mixin.ClassMethods != null)) {
          continue;
        }
        for (key in mixin) {
          value = mixin[key];
          if (__indexOf.call(Tails.Mixable.MixableKeywords, key) < 0) {
            this.prototype[key] = value;
          }
        }
        this._includedMixins.push(mixin);
        if ((_ref1 = mixin.included) != null) {
          _ref1.apply(this);
        }
      }
      return this;
    },
    extend: function() {
      var key, mixin, mixins, value, _i, _len, _ref, _ref1;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (((_ref = this._extendedMixins) != null ? _ref.klass : void 0) !== this) {
        this._extendedMixins = _(this._extendedMixins).clone() || [];
        this._extendedMixins.klass = this;
      }
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        if (mixin.ClassMethods != null) {
          mixin = mixin.ClassMethods;
        }
        if (__indexOf.call(this._extendedMixins, mixin) >= 0 || (mixin.ClassMethods != null)) {
          continue;
        }
        for (key in mixin) {
          value = mixin[key];
          if (__indexOf.call(Tails.Mixable.MixableKeywords, key) < 0) {
            this[key] = value;
          }
        }
        this._extendedMixins.push(mixin);
        if ((_ref1 = mixin.extended) != null) {
          _ref1.apply(this);
        }
      }
      return this;
    },
    "with": function(mixin, funcs) {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (((_ref = this._instanceInteractions) != null ? _ref.klass : void 0) !== this) {
        this._instanceInteractions = _(this._instanceInteractions).clone() || [];
        this._instanceInteractions.klass = this;
      }
      if (((_ref1 = this._classInteractions) != null ? _ref1.klass : void 0) !== this) {
        this._classInteractions = _(this._classInteractions).clone() || [];
        this._classInteractions.klass = this;
      }
      if ((_ref2 = mixin.InstanceMethods, __indexOf.call(this._includedMixins, _ref2) >= 0) && (_ref3 = mixin.InstanceMethods, __indexOf.call(this._instanceInteractions, _ref3) < 0)) {
        this._instanceInteractions.push(mixin.InstanceMethods);
        if (mixin.Interactions != null) {
          this.include((_ref4 = mixin.Interactions) != null ? _ref4.apply(this) : void 0);
        }
        return funcs;
      }
      if ((_ref5 = mixin.ClassMethods, __indexOf.call(this._extendedMixins, _ref5) >= 0) && (_ref6 = mixin.ClassMethods, __indexOf.call(this._classInteractions, _ref6) < 0)) {
        this._classInteractions.push(mixin.ClassMethods);
        if (mixin.Interactions != null) {
          this.extend((_ref7 = mixin.Interactions) != null ? _ref7.apply(this) : void 0);
        }
        return funcs;
      }
      return {};
    },
    concern: function() {
      var mixin, mixins, _i, _len;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        if (mixin.InstanceMethods != null) {
          this.include(mixin.InstanceMethods);
        }
        if (mixin.ClassMethods != null) {
          this.extend(mixin.ClassMethods);
        }
        if (mixin.Interactions != null) {
          this.concern(mixin.Interactions.apply(this));
        }
      }
      return this;
    }
  };

  Tails.Mixins.DynamicProperties = {
    InstanceMethods: {
      getter: function(getters) {
        return this.defineProperty({
          getter: getters
        });
      },
      setter: function(setters) {
        return this.defineProperty({
          setter: setters
        });
      },
      defineProperty: function(params) {
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
                    map = Object.getOwnPropertyDescriptor(_this, key) || {
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
                    return Object.defineProperty(_this, key, map);
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
      getter: function(getters) {
        return this.before({
          initialize: function() {
            return this.getter((typeof getters === "function" ? getters() : void 0) || getters);
          }
        });
      },
      setter: function(setters) {
        return this.before({
          initialize: function() {
            return this.setter((typeof setters === "function" ? setters() : void 0) || setters);
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
            instance: this
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
      extended: function() {
        var key, methods, _i, _len, _results;
        methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl', 'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'contains', 'invoke', 'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest', 'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'chain', 'sample', 'add', 'remove', 'set', 'at', 'push', 'pop', 'unshift', 'shift', 'slice', 'sort', 'pluck', 'where', 'findWhere', 'clone', 'create', 'fetch', 'reset', 'urlRoot', 'urlRootRoot', 'on', 'off', 'once', 'trigger', 'listenTo', 'stopListening', 'listenOnce'];
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
              Object.defineProperty(_this.attributes, foreignName, {
                get: function() {
                  return klass.get(_this.get(foreignKey)) || new klass({
                    id: _this.get(foreignKey)
                  });
                },
                set: function(model) {
                  if (model == null) {
                    return _this.unset(foreignKey);
                  }
                  if (klass.get(model.id) == null) {
                    klass.create(model);
                  }
                  return _this.set(foreignKey, model.id);
                }
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
              return Object.defineProperty(_this.attributes, foreignName, {
                get: function() {
                  return klass.findWhere(attrs) || new klass(attrs);
                },
                set: function(model) {
                  _this.attributes(foreignName)[foreignKey] = void 0;
                  return model[foreignKey] = _this.id;
                }
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
              var collection;
              foreignKey || (foreignKey = inflection.foreign_key(_this.constructor.name));
              collection = new Tails.Collection(null, {
                model: klass,
                parent: _this
              });
              _this.set(foreignName, collection);
              collection.add(klass.find(function(model) {
                return model.get(foreignKey) === _this.id;
              }));
              klass.on("change:" + foreignKey, function(model, id) {
                if (id !== _this.id && collection.contains(model)) {
                  return collection.remove(model);
                } else if (id === _this.id && !collection.contains(model)) {
                  return collection.add(model);
                }
              });
              klass.on("add", function(model) {
                if (model.get(foreignKey) === _this.id && !collection.contains(model)) {
                  return collection.add(model);
                }
              });
              klass.on("remove", function(model) {
                if (model.get(foreignKey) === _this.id && collection.contains(model)) {
                  return collection.remove(model);
                }
              });
              collection.on("add", function(model) {
                if (model.get(foreignKey) !== _this.id) {
                  return model.set(foreignKey, _this.id);
                }
              });
              return collection.on("remove", function(model) {
                if (model.get(foreignKey) === _this.id) {
                  return model.set(foreignKey, void 0);
                }
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
          key += "/" + Tails.Utils.Hash(JSON.stringify(data));
          json = JSON.stringify({
            "instance": instance,
            "data": data
          });
        } else {
          json = JSON.stringify(instance);
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
          json = localStorage.getItem(key);
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
                json = JSON.stringify(this.constructor.pluck("id"));
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
    ClassMethods: {
      extended: function() {
        this.concern(Tails.Mixins.Interceptable);
        return this.after({
          initialize: function() {
            return this.log("New " + this.constructor.name, JSON.stringify(this));
          }
        });
      }
    },
    InstanceMethods: {
      log: function() {
        var strings;
        strings = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return console.log(new Date(), strings);
      },
      included: function() {
        this.concern(Tails.Mixins.Interceptable);
        return this.after({
          initialize: function() {
            return this.on("change", (function(_this) {
              return function() {
                return _this.log("Change of attribute in " + _this.constructor.name, JSON.stringify(_this));
              };
            })(this));
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
          $el = _this.get('$el').clone();
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
      var _ref;
      if (options == null) {
        options = {};
      }
      if ((_ref = this.template) != null) {
        _ref.bind(this).then((function(_this) {
          return function($el) {
            _this.setElement($el);
            return _this.render();
          };
        })(this));
      }
      return View.__super__.initialize.apply(this, arguments);
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
