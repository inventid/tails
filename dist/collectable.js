import { Mixable, isMixable } from './mixable';
import { Interceptable, isInterceptable } from './interceptable';
export function Collectable(target) {
    if (!isMixable(target))
        Mixable(target);
    if (!isInterceptable(target))
        Interceptable(target);
    target.concern(Collectable);
}
export var Collectable;
(function (Collectable) {
    var ClassMethods;
    (function (ClassMethods) {
        // export var _collection: Collection<Model> = undefined;
        // export function _keyFn(model: Model): Key {
        //   return model.id || null;
        // };
        // export function all(): Collection<Model> {
        //   return this._collection = this._collection ? this._collection : new Collection<Model>([], {keyFn: _keyFn});
        // }
        function extended() {
            // var _collection = new Collection<Model>([]);
            // Object.defineProperty(this, "all", {
            //   get: () => _collection,
            //   set: (collection) => _collection = collection,
            //   enumerable: false
            // })
            //
            // var _fn = () => {
            //   console.log("Adding new instance ")
            //   _collection.push(this);
            // }
            //
            // this.after({initialize: _fn})
        }
        ClassMethods.extended = extended;
    })(ClassMethods = Collectable.ClassMethods || (Collectable.ClassMethods = {}));
})(Collectable || (Collectable = {}));
export function isCollectable(obj) {
    return Object.keys(Collectable.ClassMethods).reduce((memo, key) => memo && !(obj[key] == null), true);
}
export default Collectable;
