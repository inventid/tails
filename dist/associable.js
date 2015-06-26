import { Collectable, isCollectable } from './collectable';
import { Interceptable, isInterceptable } from './interceptable';
export function Associable(target) {
    if (!isCollectable(target))
        Collectable(target);
    if (!isInterceptable(target))
        Interceptable(target);
    target.concern(Associable);
}
export var Associable;
(function (Associable) {
    var ClassMethods;
    (function (ClassMethods) {
        function belongsTo(klass, options) {
            throw new Error('Not implemented.');
            // var name: string = <string>this['name'];
            // var foreignKey = Utils.underscore(name) + "_id";
            //
            // console.log(name, foreignKey, klass);
            // return model.zoom(foreignKey).flatMap( (id: number) => {
            //   return Model.where(this.all(), "id", id);
            // });
        }
        ClassMethods.belongsTo = belongsTo;
        function hasOne(klass, options) {
            throw new Error('Not implemented.');
            // return hasMany(klass, options);
        }
        ClassMethods.hasOne = hasOne;
        function hasMany(klass, options) {
            throw new Error('Not implemented.');
            // var name: string = <string>klass['name'];
            // var foreignKey = Utils.underscore(name) + "_id";
            //
            // console.log(name, foreignKey, klass);
            //
            // return model.zoom('id').flatMap((id: number) => {
            //   return Model.where((<T>target).all(), foreignKey, id);
            // });
        }
        ClassMethods.hasMany = hasMany;
    })(ClassMethods = Associable.ClassMethods || (Associable.ClassMethods = {}));
})(Associable || (Associable = {}));
export default Associable;
//
