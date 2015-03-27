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
