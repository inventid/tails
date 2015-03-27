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
