// Tails
// version: 0.0.1
// contributors: Joost Verdoorn
// license: MIT
(function() {
  var Tails,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tails = Tails.Mixins.Collectable = {
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
      create: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return all().create.apply(this, args);
      }
    },
    extended: function() {
      this.extend(Tails.Mixins.Interceptable);
      return this.after({
        initialize: function() {
          if (this.constructor.all().get(this.id) != null) {
            throw new Error("Duplicate " + this.constructor.name + " for id " + this.id + ".");
          }
          return this.constructor.all().add(this);
        }
      });
    }
  };

  Tails.Mixins.DynamicProperties = {
    ObjectMethods: {
      getter: function(getters, fn) {
        if (fn == null) {
          fn = null;
        }
        return this.defineProperty('getter', getters, fn);
      },
      setter: function(setters, fn) {
        if (fn == null) {
          fn = null;
        }
        return this.defineProperty('setter', setters, fn);
      },
      defineProperty: function(type, attributes, fn) {
        var key, _results;
        if (fn == null) {
          fn = null;
        }
        if (typeof attributes === 'string') {
          if (typeof fn !== 'function') {
            throw new Error('Function expected but none was given.');
          }
          key = attributes;
          attributes = {};
          attributes[key] = fn;
        }
        _results = [];
        for (key in attributes) {
          fn = attributes[key];
          _results.push((function(_this) {
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
        return _results;
      }
    }
  };

  Tails.Mixins.Interceptable = {
    ClassMethods: {
      before: function(befores, fn) {
        if (fn == null) {
          fn = null;
        }
        return this.intercept('before', befores, fn);
      },
      after: function(afters, fn) {
        if (fn == null) {
          fn = null;
        }
        return this.intercept('after', afters, fn);
      },
      intercept: function(placement, interceptors, fn) {
        var key, keys, _i, _len, _ref, _ref1, _results;
        if (fn == null) {
          fn = null;
        }
        if (_(interceptors).isString()) {
          if ((_ref = typeof fn) !== 'function' && _ref !== 'string') {
            throw new Error('Function expected but none was given.');
          }
          key = interceptors;
          interceptors = {};
          interceptors[key] = fn;
        } else if (_(interceptors).isArray()) {
          if ((_ref1 = typeof fn) !== 'function' && _ref1 !== 'string') {
            throw new Error('Function expected but none was given.');
          }
          keys = interceptors;
          interceptors = {};
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            interceptors[key] = fn;
          }
        }
        _results = [];
        for (key in interceptors) {
          fn = interceptors[key];
          _results.push((function(_this) {
            return function(key, fn) {
              var after, before, interceptable, klass, prev, _ref2, _ref3, _ref4, _ref5;
              if (!_this.prototype.hasOwnProperty(key) || (_this.prototype[key].before != null) || (_this.prototype[key].after != null)) {
                before = (((_ref2 = _this.prototype[key]) != null ? _ref2.klass : void 0) === _this ? (_ref3 = _this.prototype[key]) != null ? _ref3.before : void 0 : void 0) || (function() {});
                after = (((_ref4 = _this.prototype[key]) != null ? _ref4.klass : void 0) === _this ? (_ref5 = _this.prototype[key]) != null ? _ref5.after : void 0 : void 0) || (function() {});
                if (placement === 'before') {
                  prev = before;
                  before = function() {
                    var args;
                    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    (this[fn] || fn).apply(this, args);
                    return prev.apply(this, args);
                  };
                } else if (placement === 'after') {
                  prev = after;
                  after = function() {
                    var args;
                    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    prev.apply(this, args);
                    return (this[fn] || fn).apply(this, args);
                  };
                }
                _this.prototype.setter(key, function(interceptable) {
                  delete this[key];
                  return this[key] = function() {
                    var args, ret;
                    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    before.apply(this, args);
                    ret = interceptable.apply(this, args);
                    after.apply(this, args);
                    return ret;
                  };
                });
                klass = _this;
                return _this.prototype.getter(key, function() {
                  var interceptor;
                  interceptor = function() {
                    var args, ret, superFn, _ref6;
                    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    before.apply(this, args);
                    superFn = (_ref6 = this.constructor.__super__) != null ? _ref6[key] : void 0;
                    if (superFn.klass !== klass) {
                      ret = superFn.apply(this, args);
                    }
                    after.apply(this, args);
                    return ret;
                  };
                  interceptor.before = before;
                  interceptor.after = after;
                  interceptor.klass = klass;
                  return interceptor;
                });
              } else {
                interceptable = _this.prototype[key];
                return _this.prototype[key] = function() {
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
              }
            };
          })(this)(key, fn));
        }
        return _results;
      }
    },
    extended: function() {
      return this.include(Tails.Mixins.DynamicProperties);
    }
  };

  Tails.Mixins.Relations = {
    ClassMethods: {
      belongsTo: function(klassFn) {
        return this.addRelation('belongsTo', klassFn);
      },
      hasOne: function(klassFn) {
        return this.addRelation('hasOne', klassFn);
      },
      hasMany: function(klassFn) {
        return this.addRelation('hasMany', klassFn);
      },
      addRelation: function(relation, klassFn) {
        var _base, _ref;
        if (((_ref = this._relations) != null ? _ref.klass : void 0) !== this) {
          this._relations = {
            klass: this
          };
        }
        (_base = this._relations)[relation] || (_base[relation] = []);
        return this._relations[relation].push(klassFn);
      }
    },
    extended: function() {
      this.extend(Tails.Mixins.Collectable);
      return this.after({
        initialize: function() {
          var klassFn, _fn, _fn1, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _results;
          this._blacklistedAttributes || (this._blacklistedAttributes = []);
          if (this instanceof Backbone.Model && ((_ref = this.constructor._relations) != null ? _ref.klass : void 0) === this.constructor) {
            if (this.constructor._relations.belongsTo != null) {
              _ref1 = this.constructor._relations.belongsTo;
              _fn = (function(_this) {
                return function(klassFn) {
                  var foreignId, foreignKey, klass, propertyKey, relation;
                  klass = klassFn();
                  foreignKey = klass.name.foreign_key();
                  propertyKey = klass.name.underscore();
                  _this._blacklistedAttributes.push(propertyKey);
                  foreignId = _this.get(foreignKey);
                  relation = _this.get(propertyKey);
                  _this.unset(foreignKey, {
                    silent: true
                  });
                  _this.unset(propertyKey, {
                    silent: true
                  });
                  Object.defineProperty(_this.attributes, foreignKey, {
                    enumerable: true,
                    get: function() {
                      var _ref2;
                      return (_ref2 = _this.get(propertyKey)) != null ? _ref2.id : void 0;
                    },
                    set: function(id) {
                      return _this.set(propertyKey, klass.get(id));
                    }
                  });
                  _this.on("change:" + propertyKey, function(we, model) {
                    var attrs;
                    _this.stopListening(_this.previous(propertyKey));
                    if ((model != null) && !(model instanceof klass)) {
                      attrs = model;
                      model = klass.get(attrs.id);
                      model.set(attrs);
                      model.synced = true;
                      _this.set(propertyKey, model);
                      return;
                    }
                    _this.trigger("change:" + foreignKey, _this, model.id);
                    return _this.listenTo(model, "change:id", function(model, id) {
                      return _this.trigger("change:" + foreignKey, _this, id);
                    });
                  });
                  if (relation != null) {
                    return _this.set(propertyKey, relation);
                  } else if (foreignId != null) {
                    return _this.set(foreignKey, foreignId);
                  }
                };
              })(this);
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                klassFn = _ref1[_i];
                _fn(klassFn);
              }
            }
            if (this.constructor._relations.hasOne != null) {
              _ref2 = this.constructor._relations.hasOne;
              _fn1 = (function(_this) {
                return function(klassFn) {
                  var foreignKey, klass, propertyKey, where;
                  klass = klassFn();
                  foreignKey = _this.constructor.name.foreign_key();
                  propertyKey = klass.name.underscore().camelize(true);
                  where = {};
                  where[foreignKey] = _this.id;
                  _this.getter(propertyKey, function() {
                    return klass.all().findWhere(where);
                  });
                  return _this.setter(propertyKey, function(model) {
                    return model.set(foreignKey, this.id);
                  });
                };
              })(this);
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                klassFn = _ref2[_j];
                _fn1(klassFn);
              }
            }
            if (this.constructor._relations.hasMany != null) {
              _ref3 = this.constructor._relations.hasMany;
              _results = [];
              for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                klassFn = _ref3[_k];
                _results.push((function(_this) {
                  return function(klassFn) {
                    var collection, foreignKey, klass, propertyKey;
                    klass = klassFn();
                    foreignKey = _this.constructor.name.foreign_key();
                    propertyKey = klass.name.pluralize().underscore();
                    _this._blacklistedAttributes.push(propertyKey);
                    collection = new Tails.Collection(null, {
                      model: klass,
                      parent: _this
                    });
                    _this.set(propertyKey, collection);
                    collection.add(klass.all().find(function(model) {
                      return model[propertyKey] === _this.id;
                    }));
                    klass.all().on("change:" + foreignKey, function(model, id) {
                      if (id !== _this.id && collection.contains(model)) {
                        return collection.remove(model);
                      } else if (id === _this.id && !collection.contains(model)) {
                        return collection.add(model);
                      }
                    });
                    klass.all().on("add", function(model) {
                      if (model.get(foreignKey) === _this.id && !collection.contains(model)) {
                        return collection.add(model);
                      }
                    });
                    klass.all().on("remove", function(model) {
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
                        return model.set(foreignKey, null);
                      }
                    });
                  };
                })(this)(klassFn));
              }
              return _results;
            }
          }
        }
      });
    }
  };

  Tails.Mixable = {
    include: function() {
      var key, mixin, mixins, value, _i, _len, _ref, _ref1, _ref2;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (((_ref = this._includedMixins) != null ? _ref.klass : void 0) !== this) {
        this._includedMixins = _(this._includedMixins).clone() || [];
        this._includedMixins.klass = this;
      }
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        if (!(__indexOf.call(this._includedMixins, mixin) < 0)) {
          continue;
        }
        _ref1 = _.extend({}, mixin.InstanceMethods, mixin.ObjectMethods);
        for (key in _ref1) {
          value = _ref1[key];
          this.prototype[key] = value;
        }
        this._includedMixins.push(mixin);
        if ((_ref2 = mixin.included) != null) {
          _ref2.apply(this);
        }
      }
      return this;
    },
    extend: function() {
      var key, mixin, mixins, value, _i, _len, _ref, _ref1, _ref2;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (((_ref = this._extendedMixins) != null ? _ref.klass : void 0) !== this) {
        this._extendedMixins = _(this._extendedMixins).clone() || [];
        this._extendedMixins.klass = this;
      }
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        if (!(__indexOf.call(this._extendedMixins, mixin) < 0)) {
          continue;
        }
        _ref1 = _.extend({}, mixin.ClassMethods, mixin.ObjectMethods);
        for (key in _ref1) {
          value = _ref1[key];
          this[key] = value;
        }
        this._extendedMixins.push(mixin);
        if ((_ref2 = mixin.extended) != null) {
          _ref2.apply(this);
        }
      }
      return this;
    },
    concern: function() {
      var mixins;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.extend.apply(this, mixins);
      this.include.apply(this, mixins);
      return this;
    }
  };

  Tails.Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    _.extend(Model, Tails.Mixable);

    Model.concern(Tails.Mixins.DynamicProperties);

    Model.prototype.syncing = false;

    Model.prototype.dataType = 'json';

    Model.prototype.initialize = function(attrs, options) {
      if (attrs == null) {
        attrs = {};
      }
      if (options == null) {
        options = {};
      }
      this.parent = options.parent || this.parent;
      this.synced = options.synced || false;
      this.on('change', (function(_this) {
        return function(model) {
          var key, prop, _ref, _results;
          _this.synced = false;
          _ref = model.changed;
          _results = [];
          for (key in _ref) {
            prop = _ref[key];
            if (!_this.hasOwnProperty(key.camelize(true))) {
              _results.push((function(key) {
                _this.getter(key.camelize(true), function() {
                  return _this.get(key);
                });
                return _this.setter(key.camelize(true), function(value) {
                  return _this.set(key, value);
                });
              })(key));
            }
          }
          return _results;
        };
      })(this));
      this.on('sync', function() {
        return this.synced = true;
      });
      return Model.__super__.initialize.apply(this, arguments);
    };

    Model.prototype.urlRoot = function() {
      return '/' + this.constructor.name.pluralize().underscore();
    };

    Model.prototype.url = function() {
      var base, format, id, root, url, _ref, _ref1;
      base = ((_ref = this.parent) != null ? typeof _ref.url === "function" ? _ref.url() : void 0 : void 0) || ((_ref1 = this.parent) != null ? _ref1.url : void 0) || Tails.url;
      root = (typeof this.urlRoot === "function" ? this.urlRoot() : void 0) || this.urlRoot;
      id = this.id ? "/" + this.id : '';
      format = this.format != null ? '.' + ((typeof this.format === "function" ? this.format() : void 0) || this.format) : '';
      url = "" + base + root + id + format;
      return url;
    };

    Model.prototype.fetch = function(options) {
      var deferred, fetchPromise, resolve;
      if (options == null) {
        options = {};
      }
      if (this.synced && !options.force) {
        return this._fetchPromise;
      }
      _.defaults(options, {
        dataType: this.format
      });
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
      fetchPromise.then((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (_this.synced) {
            return resolve.apply(_this, args);
          } else {
            return _this.once('sync', function() {
              return resolve.apply(this, args);
            });
          }
        };
      })(this));
      fetchPromise.fail((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return deferred.reject.apply(deferred, args);
        };
      })(this));
      return this._fetchPromise = deferred.promise;
    };

    Model.prototype.save = function(options) {
      var deferred, fetchPromise, resolve;
      if (options == null) {
        options = {};
      }
      if (this.synced && !options.force) {
        return this._fetchPromise;
      }
      _.defaults(options, {
        dataType: this.format
      });
      fetchPromise = Model.__super__.save.call(this, options);
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
      fetchPromise.then((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (_this.synced) {
            return resolve.apply(_this, args);
          } else {
            return _this.once('sync', function() {
              return resolve.apply(this, args);
            });
          }
        };
      })(this));
      fetchPromise.fail((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return deferred.reject.apply(deferred, args);
        };
      })(this));
      return this._fetchPromise = deferred.promise;
    };

    Model.prototype.toJSON = function() {
      return _.omit(this.attributes, this._blacklistedAttributes);
    };

    return Model;

  })(Backbone.Deferred.Model);

  Tails.Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    _.extend(Collection, Tails.Mixable);

    Collection.prototype.model = null;

    Collection.prototype.syncing = false;

    Collection.prototype.dataType = 'json';

    Collection.prototype.initialize = function(models, options) {
      if (models == null) {
        models = null;
      }
      if (options == null) {
        options = {};
      }
      this.model = options.model || this.model || Tails.Models[this.constructor.name.singularize()] || Tails.Model;
      this.parent = options.parent || this.parent;
      this.synced = options.synced || false;
      this.on('sync', function() {
        return this.synced = true;
      });
      return Collection.__super__.initialize.apply(this, arguments);
    };

    Collection.prototype.urlRoot = function() {
      return '/' + this.model.name.pluralize().underscore();
    };

    Collection.prototype.url = function() {
      var base, format, root, url, _ref, _ref1;
      base = ((_ref = this.parent) != null ? typeof _ref.url === "function" ? _ref.url() : void 0 : void 0) || ((_ref1 = this.parent) != null ? _ref1.url : void 0) || Tails.url;
      root = (typeof this.urlRoot === "function" ? this.urlRoot() : void 0) || this.urlRoot;
      format = this.format != null ? '.' + ((typeof this.format === "function" ? this.format() : void 0) || this.format) : '';
      url = "" + base + root + format;
      return url;
    };

    Collection.prototype.fetch = function(options) {
      var deferred, fetchPromise, resolve;
      if (options == null) {
        options = {};
      }
      if (this.synced && !options.force) {
        return this._fetchPromise;
      }
      this.syncing = true;
      this.synced = false;
      _.defaults(options, {
        dataType: this.format
      });
      fetchPromise = Collection.__super__.fetch.call(this, options);
      deferred = Q.defer();
      resolve = (function(_this) {
        return function() {
          _this.syncing = false;
          return deferred.resolve(_this);
        };
      })(this);
      fetchPromise.then((function(_this) {
        return function() {
          if (_this.synced) {
            return resolve();
          } else {
            return _this.once('sync', function() {
              return resolve();
            });
          }
        };
      })(this));
      return this._fetchPromise = deferred.promise;
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
        model.synced = true;
        models.push(model);
      }
      return models;
    };

    return Collection;

  })(Backbone.Deferred.Collection);

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

  Tails.Template = (function(_super) {
    __extends(Template, _super);

    function Template() {
      return Template.__super__.constructor.apply(this, arguments);
    }

    Template.concern(Tails.Mixins.Collectable);

    Template.prototype.urlRoot = '/assets';

    Template.prototype.format = 'html';

    Template.prototype.initialize = function(attrs, options) {
      if (attrs == null) {
        attrs = {};
      }
      if (options == null) {
        options = {};
      }
      return Template.__super__.initialize.apply(this, arguments);
    };

    Template.prototype.bind = function(view) {
      return this.fetch().then((function(_this) {
        return function() {
          var $el;
          $el = _this.$el.clone();
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

}).call(this);
