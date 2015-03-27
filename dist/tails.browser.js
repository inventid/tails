(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tails = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Association, BelongsToRelation, Collectable, Collection, Debug, DynamicAttributes, HasManyRelation, HasOneRelation, Mixable, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixable = require('../mixable');

  Debug = require('../mixins/debug');

  DynamicAttributes = require('../mixins/dynamic_attributes');

  Collectable = require('../mixins/collectable');

  Collection = require('../collection');

  Relation = require('./relation');

  BelongsToRelation = require('./belongs_to_relation');

  HasOneRelation = require('./has_one_relation');

  HasManyRelation = require('./has_many_relation');

  Association = (function(_super) {
    __extends(Association, _super);

    function Association() {
      return Association.__super__.constructor.apply(this, arguments);
    }

    _.extend(Association, Mixable);

    Association.concern(Debug);

    Association.concern(DynamicAttributes);

    Association.concern(Collectable);

    Association.prototype.relations = function() {
      if (this._relations == null) {
        this._relations = new Collection([], {
          model: Relation
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
          relation = new BelongsToRelation(_.extend(attrs, {
            foreignKey: this.get('foreignKey') || inflection.foreign_key(attrs.to.name || attrs.to.toString().match(/^function\s*([^\s(]+)/)[1])
          }));
          if (model != null) {
            relation.set("target", model);
          }
          break;
        case 'hasOne':
          model = owner.get(attrs.name);
          relation = new HasOneRelation(_.extend(attrs, {
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
          relation = new HasManyRelation(_.extend(attrs, {
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

}).call(this);

//# sourceMappingURL=association.js.map

},{"../collection":6,"../mixable":8,"../mixins/collectable":10,"../mixins/debug":11,"../mixins/dynamic_attributes":12,"./belongs_to_relation":2,"./has_many_relation":3,"./has_one_relation":4,"./relation":5}],2:[function(require,module,exports){
(function() {
  var BelongsToRelation, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Relation = require('./relation');

  BelongsToRelation = (function(_super) {
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
            this.set(foreignKey, null);
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

  })(Relation);

  module.exports = BelongsToRelation;

}).call(this);

//# sourceMappingURL=belongs_to_relation.js.map

},{"./relation":5}],3:[function(require,module,exports){
(function() {
  var Collection, HasManyRelation, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Relation = require('./relation');

  Collection = require('../collection');

  HasManyRelation = (function(_super) {
    __extends(HasManyRelation, _super);

    function HasManyRelation() {
      return HasManyRelation.__super__.constructor.apply(this, arguments);
    }

    HasManyRelation.prototype.initialize = function() {
      var association, collection, foreignKey, name, owner, source, sourceAssociation, through, throughAssociation, to;
      association = this.get('association');
      to = association.get('to');
      owner = this.get('owner');
      name = this.get('name');
      foreignKey = this.get('foreignKey');
      through = this.get('through');
      source = this.get('source');
      if (through == null) {
        collection = to.all().where(foreignKey).is(owner.id);
        collection.parent = owner;
        this.getter({
          target: (function(_this) {
            return function() {
              return collection;
            };
          })(this)
        });
        return this.setter({
          target: (function(_this) {
            return function(models) {
              collection.each(function(model) {
                return model.unset(foreignKey);
              });
              return collection.add(models);
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
                union = new Collection.Union();
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

  })(Relation);

  module.exports = HasManyRelation;

}).call(this);

//# sourceMappingURL=has_many_relation.js.map

},{"../collection":6,"./relation":5}],4:[function(require,module,exports){
(function() {
  var HasOneRelation, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Relation = require('./relation');

  HasOneRelation = (function(_super) {
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

  })(Relation);

  module.exports = HasOneRelation;

}).call(this);

//# sourceMappingURL=has_one_relation.js.map

},{"./relation":5}],5:[function(require,module,exports){
(function() {
  var Collectable, DynamicAttributes, Mixable, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixable = require('../mixable');

  DynamicAttributes = require('../mixins/dynamic_attributes');

  Collectable = require('../mixins/collectable');

  Relation = (function(_super) {
    __extends(Relation, _super);

    function Relation() {
      return Relation.__super__.constructor.apply(this, arguments);
    }

    _.extend(Relation, Mixable);

    Relation.concern(DynamicAttributes);

    Relation.concern(Collectable);

    Relation.prototype.initialize = function() {};

    return Relation;

  })(Backbone.Model);

  module.exports = Relation;

}).call(this);

//# sourceMappingURL=relation.js.map

},{"../mixable":8,"../mixins/collectable":10,"../mixins/dynamic_attributes":12}],6:[function(require,module,exports){
(function() {
  var Collection, Mixable, Model, config,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Mixable = require('./mixable');

  Model = require('./model');

  config = require('./config');

  Collection = (function(_super) {
    __extends(Collection, _super);

    _.extend(Collection, Mixable);

    Collection.prototype.syncedAt = 0;

    function Collection(models, options) {
      if (models == null) {
        models = [];
      }
      if (options == null) {
        options = {};
      }
      this.model = options.model || this.model || Model;
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
      base = ((_ref = this.parent) != null ? typeof _ref.url === "function" ? _ref.url() : void 0 : void 0) || ((_ref1 = this.parent) != null ? _ref1.url : void 0) || config.url;
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
      return new Collection.Filtered(this, {
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
        return new Collection.Filtered(this, {
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
      return new Collection.Plucked(this, {
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

  Collection.Plucked = (function(_super) {
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

  })(Collection);

  Collection.Filtered = (function(_super) {
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

  })(Collection);

  Collection.Multi = (function(_super) {
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

  })(Collection);

  Collection.Union = (function(_super) {
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

  })(Collection.Multi);

  module.exports = Collection;

}).call(this);

//# sourceMappingURL=collection.js.map

},{"./config":7,"./mixable":8,"./model":16}],7:[function(require,module,exports){
(function() {
  module.exports = {
    url: 'http://localhost'
  };

}).call(this);

//# sourceMappingURL=config.js.map

},{}],8:[function(require,module,exports){
(function() {
  var Mixable,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  Mixable = {
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
        if (__indexOf.call(this.MixableKeywords, key) < 0) {
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
        if (__indexOf.call(this.MixableKeywords, key) < 0) {
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
      if ((this._includedMixins != null) && __indexOf.call(this._includedMixins, mixin) >= 0) {
        return funcs;
      } else if ((this._extendedMixins != null) && __indexOf.call(this._extendedMixins, mixin) >= 0) {
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

  module.exports = Mixable;

}).call(this);

//# sourceMappingURL=mixable.js.map

},{}],9:[function(require,module,exports){
(function() {
  var Associable, Association, Collection, Relation;

  Collection = require('../collection');

  Relation = require('../associations/relation');

  Association = require('../associations/association');

  Associable = {
    InstanceMethods: {
      relations: function() {
        if (this._relations == null) {
          this._relations = new Collection([], {
            model: Relation
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
        association = new Association(attrs);
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
          this._associations = Association.all().where({
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

  module.exports = Association;

}).call(this);

//# sourceMappingURL=associable.js.map

},{"../associations/association":1,"../associations/relation":5,"../collection":6}],10:[function(require,module,exports){
(function() {
  var Collectable, Collection, Interceptable, Storage;

  Interceptable = require('./interceptable');

  Collection = require('../collection');

  Storage = require('./storage');

  Collectable = {
    InstanceMethods: {
      included: function() {
        this.concern(Interceptable);
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
          this._all = new Collection(null, {
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
        ClassMethods: this["with"](Storage, {
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

  module.exports = Collectable;

}).call(this);

//# sourceMappingURL=collectable.js.map

},{"../collection":6,"./interceptable":14,"./storage":15}],11:[function(require,module,exports){
(function() {
  var Debug, Interceptable,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Interceptable = require('./interceptable');

  Debug = {
    InstanceMethods: {
      LOG_LEVELS: {
        "ERROR": true,
        "WARNING": true,
        "INFO": false
      },
      _excludedMethods: _.union(Object.keys(Interceptable.InstanceMethods), ["constructor", "log", "message", "warn", "error", "info"]),
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
        this.concern(Interceptable);
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

  module.exports = Debug;

}).call(this);

//# sourceMappingURL=debug.js.map

},{"./interceptable":14}],12:[function(require,module,exports){
(function() {
  var DynamicAttributes, Interceptable;

  Interceptable = require('./interceptable');

  DynamicAttributes = {
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
        return this.concern(Interceptable);
      }
    }
  };

  module.exports = DynamicAttributes;

}).call(this);

//# sourceMappingURL=dynamic_attributes.js.map

},{"./interceptable":14}],13:[function(require,module,exports){
(function() {
  var History, Storage;

  Storage = require('./storage');

  History = {
    Interactions: function() {
      return {
        InstanceMethods: this["with"](Storage, {
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

  module.exports = History;

}).call(this);

//# sourceMappingURL=history.js.map

},{"./storage":15}],14:[function(require,module,exports){
(function() {
  var Interceptable,
    __slice = [].slice;

  Interceptable = {
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

  module.exports = Interceptable;

}).call(this);

//# sourceMappingURL=interceptable.js.map

},{}],15:[function(require,module,exports){
(function() {
  var Hash, Interceptable, Storage;

  Interceptable = require('./interceptable');

  Hash = require('../utils/hash');

  Storage = {
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
        this.concern(Interceptable);
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
          key += "/" + Hash(this.toJSON(data));
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
          json = this.storage().getItem(Hash(indexRoot));
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

  module.exports = Storage;

}).call(this);

//# sourceMappingURL=storage.js.map

},{"../utils/hash":19,"./interceptable":14}],16:[function(require,module,exports){
(function() {
  var Associable, Mixable, Model, config,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Mixable = require('./mixable');

  Associable = require('./mixins/associable');

  config = require('./config');

  Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    _.extend(Model, Mixable);

    Model.concern(Associable);

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
      base = ((_ref = this.parent) != null ? typeof _ref.url === "function" ? _ref.url() : void 0 : void 0) || ((_ref1 = this.parent) != null ? _ref1.url : void 0) || config.url;
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

  module.exports = Model;

}).call(this);

//# sourceMappingURL=model.js.map

},{"./config":7,"./mixable":8,"./mixins/associable":9}],17:[function(require,module,exports){
(function() {
  var Associable, Association, BelongsToRelation, Collectable, Collection, Debug, DynamicAttributes, HasManyRelation, HasOneRelation, Hash, History, Interceptable, Mixable, Model, Relation, Storage, Tails, Template, View, config;

  Hash = require('./utils/hash');

  Mixable = require('./mixable');

  Interceptable = require('./mixins/interceptable');

  Debug = require('./mixins/debug');

  DynamicAttributes = require('./mixins/dynamic_attributes');

  Collectable = require('./mixins/collectable');

  Associable = require('./mixins/associable');

  Collection = require('./collection');

  Association = require('./associations/association');

  Relation = require('./associations/relation');

  BelongsToRelation = require('./associations/belongs_to_relation');

  HasOneRelation = require('./associations/has_one_relation');

  HasManyRelation = require('./associations/has_many_relation');

  Storage = require('./mixins/storage');

  History = require('./mixins/history');

  Model = require('./model');

  Template = require('./template');

  View = require('./view');

  config = require('./config');

  Tails = {
    Mixins: {},
    Utils: {},
    Associations: {},
    Models: {},
    Views: {}
  };

  Tails.Mixable = Mixable;

  Tails.Collection = Collection;

  Tails.Utils = {
    Hash: Hash
  };

  Tails.Mixins = {
    Interceptable: Interceptable,
    Collectable: Collectable,
    Associable: Associable,
    Debug: Debug,
    DynamicAttributes: DynamicAttributes,
    Storage: Storage,
    History: History
  };

  Tails.Relation = Relation;

  Tails.Association = Association;

  Tails.BelongsToRelation = BelongsToRelation;

  Tails.HasOneRelation = HasOneRelation;

  Tails.HasManyRelation = HasManyRelation;

  Tails.Model = Model;

  Tails.View = View;

  Tails.Template = Template;

  Tails.config = config;

  module.exports = Tails;

}).call(this);

//# sourceMappingURL=tails.js.map

},{"./associations/association":1,"./associations/belongs_to_relation":2,"./associations/has_many_relation":3,"./associations/has_one_relation":4,"./associations/relation":5,"./collection":6,"./config":7,"./mixable":8,"./mixins/associable":9,"./mixins/collectable":10,"./mixins/debug":11,"./mixins/dynamic_attributes":12,"./mixins/history":13,"./mixins/interceptable":14,"./mixins/storage":15,"./model":16,"./template":18,"./utils/hash":19,"./view":20}],18:[function(require,module,exports){
(function() {
  var Collectable, Model, Template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collectable = require('./mixins/collectable');

  Model = require('./model');

  Template = (function(_super) {
    __extends(Template, _super);

    function Template() {
      return Template.__super__.constructor.apply(this, arguments);
    }

    Template.concern(Collectable);

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

  })(Model);

  module.exports = Collectable;

}).call(this);

//# sourceMappingURL=template.js.map

},{"./mixins/collectable":10,"./model":16}],19:[function(require,module,exports){
(function() {
  var Hash;

  Hash = function(string) {
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

  module.exports = Hash;

}).call(this);

//# sourceMappingURL=hash.js.map

},{}],20:[function(require,module,exports){
(function() {
  var Mixable, Template, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixable = require('./mixable');

  Template = require('./template');

  View = (function(_super) {
    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    _.extend(View, Mixable);

    View.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      if (this.template.constructor === String) {
        this.template = Template.get(this.template);
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

  module.exports = View;

}).call(this);

//# sourceMappingURL=view.js.map

},{"./mixable":8,"./template":18}]},{},[17])(17)
});