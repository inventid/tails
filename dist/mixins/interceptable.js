(function() {
  var __slice = [].slice;

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

}).call(this);

//# sourceMappingURL=interceptable.js.map
