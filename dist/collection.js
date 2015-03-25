(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
      this.filter = options.filter;
      this.assimilate = options.assimilate;
      this.distantiate = options.distantiate;
      Filtered.__super__.constructor.call(this, [], options);
      this.collection.each((function(_this) {
        return function(model) {
          if (_this.filter(model)) {
            return _this.add(model);
          }
        };
      })(this));
      this.listenTo(this.collection, 'add', (function(_this) {
        return function(model) {
          if (_this.filter(model)) {
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
          if (_this.filter(model)) {
            return _this.add(model);
          } else {
            return _this.remove(model);
          }
        };
      })(this));
      this.on('add', (function(_this) {
        return function(model) {
          if (_this.filter(model)) {
            return;
          }
          if (_this.assimilate == null) {
            _this.remove(model);
            throw Error("Cannot assimilate model.");
          }
          _this.assimilate(model);
          return _this.collection.add(model);
        };
      })(this));
      this.on('remove', (function(_this) {
        return function(model) {
          if (!_this.collection.contains(model)) {
            return;
          }
          if (!_this.filter(model)) {
            return;
          }
          if (_this.distantiate == null) {
            _this.add(model);
            throw Error("Cannot distantiate model.");
          }
          return _this.distantiate(model);
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

}).call(this);

//# sourceMappingURL=collection.js.map
