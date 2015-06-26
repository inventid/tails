export function isClassMixin(obj) {
    return obj.ClassMethods != null || obj.InstanceMethods != null;
}
export function Mixable(target) {
    if (!isMixable(target))
        Mixable.ClassMethods.extend.call(target, Mixable);
}
export var Mixable;
(function (Mixable) {
    (function (MixableKeywords) {
        MixableKeywords[MixableKeywords['included'] = 0] = 'included';
        MixableKeywords[MixableKeywords['extended'] = 1] = 'extended';
        MixableKeywords[MixableKeywords['constructor'] = 2] = 'constructor';
        MixableKeywords[MixableKeywords['InstanceMethods'] = 3] = 'InstanceMethods';
        MixableKeywords[MixableKeywords['ClassMethods'] = 4] = 'ClassMethods';
    })(Mixable.MixableKeywords || (Mixable.MixableKeywords = {}));
    var MixableKeywords = Mixable.MixableKeywords;
    ;
    var ClassMethods;
    (function (ClassMethods) {
        ClassMethods._includedMixins = undefined;
        ClassMethods._extendedMixins = undefined;
        function extend(...mixins) {
            // This becomes a non-enumerable property in the next part so it doesn't mess up with CoffeeScript extends
            this._extendedMixins = this._extendedMixins ? this._extendedMixins : [];
            mixins.forEach((mixin) => {
                if (this._extendedMixins.indexOf(mixin) != -1)
                    return;
                this._extendedMixins.push(mixin);
                var props = isClassMixin(mixin) ? mixin.ClassMethods : mixin;
                Object.keys(props).forEach((key) => {
                    if (MixableKeywords[key] != null)
                        return;
                    var _value = props[key];
                    _value = _value != null ? _value : this[key];
                    var desc = {
                        get: () => _value,
                        set: (value) => _value = value,
                        // This hides non-functions from derived classes
                        enumerable: _value instanceof Function
                    };
                    Object.defineProperty(this, key, desc);
                });
                if (props.extended instanceof Function)
                    props.extended.apply(this);
            });
        }
        ClassMethods.extend = extend;
        function include(...mixins) {
            this._includedMixins = this._includedMixins ? this._includedMixins : [];
            mixins.forEach((mixin) => {
                if (this._includedMixins.indexOf(mixin) != -1)
                    return;
                this._includedMixins.push(mixin);
                var props = isClassMixin(mixin) ? mixin.ClassMethods : mixin;
                Object.keys(props).forEach((key) => {
                    if (MixableKeywords[key] != null)
                        return;
                    this.prototype[key] = props[key];
                });
                if (props.included instanceof Function)
                    props.included.apply(this);
            });
        }
        ClassMethods.include = include;
        function concern(...mixins) {
            extend.apply(this, mixins);
            include.apply(this, mixins);
        }
        ClassMethods.concern = concern;
    })(ClassMethods = Mixable.ClassMethods || (Mixable.ClassMethods = {}));
})(Mixable || (Mixable = {}));
export function isMixable(obj) {
    return Object.keys(Mixable).reduce((memo, key) => memo && !(obj[key] == null), true);
}
export default Mixable;
