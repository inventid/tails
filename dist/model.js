(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

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

}).call(this);

//# sourceMappingURL=model.js.map
