export function Mixable(target) {
    if (!isMixable(target))
        Mixable.ClassMethods.extend.call(target, Mixable);
}
export var Mixable;
(function (Mixable) {
    var ClassMethods;
    (function (ClassMethods) {
        ClassMethods._includedMixins = undefined;
        ClassMethods._extendedMixins = undefined;
        function extend(...mixins) {
            mixins.forEach((mixin) => {
                // This becomes a non-enumerable property in the next part so it doesn't mess up with CoffeeScript extends
                this._extendedMixins = this._extendedMixins ? this._extendedMixins : [];
                if (mixin.ClassMethods == null || this._extendedMixins.indexOf(mixin) != -1)
                    return;
                Object.keys(mixin.ClassMethods).forEach((key) => {
                    console.log(key);
                    var _value = mixin.ClassMethods[key];
                    _value = _value != null ? _value : this[key];
                    var desc = {
                        get: () => _value,
                        set: (value) => _value = value,
                        // This hides non-functions from derived classes
                        enumerable: _value instanceof Function
                    };
                    Object.defineProperty(this, key, desc);
                });
                this._extendedMixins.push(mixin);
            });
        }
        ClassMethods.extend = extend;
        function include(...mixins) {
            mixins.forEach((mixin) => {
                this._includedMixins = this._includedMixins ? this._includedMixins : [];
                if (mixin.InstanceMethods == null || this._includedMixins.indexOf(mixin) != -1)
                    return;
                Object.keys(mixin.InstanceMethods).forEach((key) => {
                    this.prototype[key] = mixin.InstanceMethods[key];
                });
                this._includedMixins.push(mixin);
            });
        }
        ClassMethods.include = include;
        function concern(...mixins) {
            extend(...mixins);
            concern(...mixins);
        }
        ClassMethods.concern = concern;
    })(ClassMethods = Mixable.ClassMethods || (Mixable.ClassMethods = {}));
})(Mixable || (Mixable = {}));
export function isMixable(obj) {
    return Object.keys(Mixable).reduce((memo, key) => memo && !(obj[key] == null), true);
}
export default Mixable;
