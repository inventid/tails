import { Mixable, isMixable } from './mixable';
import Collection from './collection';
export function Collectable(target) {
    if (!isMixable(target))
        Mixable(target);
    target.extend(Collectable);
}
export var Collectable;
(function (Collectable) {
    var ClassMethods;
    (function (ClassMethods) {
        ClassMethods._collection = undefined;
        function _keyFn(model) {
            return model.id || null;
        }
        ClassMethods._keyFn = _keyFn;
        ;
        function all() {
            return this._collection = this._collection ? this._collection : new Collection([], { keyFn: _keyFn });
        }
        ClassMethods.all = all;
    })(ClassMethods = Collectable.ClassMethods || (Collectable.ClassMethods = {}));
})(Collectable || (Collectable = {}));
export function isCollectable(obj) {
    return Object.keys(Collectable.ClassMethods).reduce((memo, key) => memo && !(obj[key] == null), true);
}
export default Collectable;
