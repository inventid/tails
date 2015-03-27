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
