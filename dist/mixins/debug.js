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
