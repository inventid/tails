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
