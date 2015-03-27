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
