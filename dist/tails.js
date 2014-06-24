(function() {
  var Tails,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tails = {
    Mixins: {},
    Models: {},
    Views: {},
    config: {
      url: 'http://localhost'
    }
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
      }
    },
    extended: function() {
      return this.concern(Tails.Mixins.Interceptable);
    }
  };

  Tails.Mixins.Collectable = {
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
      }
    },
    extended: function() {
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
                  return klass.get(_this.get(foreignKey));
                },
                set: function(model) {
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
                  return klass.all().findWhere(attrs) || new klass(attrs);
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
              collection.add(klass.all().find(function(model) {
                return model.get(foreignKey) === _this.id;
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
      }
    },
    extended: function() {
      this.concern(Tails.Mixins.Collectable);
      return this.concern(Tails.Mixins.Interceptable);
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
        _ref1 = mixin.InstanceMethods;
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
        _ref1 = mixin.ClassMethods;
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
      this.include.apply(this, mixins);
      this.extend.apply(this, mixins);
      return this;
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
