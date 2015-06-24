import { Collectable, isCollectable } from './collectable';
import Utils from './utils';
export function Associable(target) {
    if (!isCollectable(target))
        Collectable(target);
    target.extend(Associable);
    // Object.keys(Associable).forEach( (key) => {
    //   target[key] = (...args: any[]) => Associable[key](target, ...args);
    // })
}
export var Associable;
(function (Associable) {
    var ClassMethods;
    (function (ClassMethods) {
        function belongsTo(target, options) {
            var name = target['name'];
            var foreignKey = Utils.underscore(name) + "_id";
            var model = options.klass;
            console.log(name, foreignKey, model);
            // return model.zoom(foreignKey).flatMap( (id: number) => {
            //   return Model.where(target.all(), "id", id);
            // });
        }
        ClassMethods.belongsTo = belongsTo;
    })(ClassMethods = Associable.ClassMethods || (Associable.ClassMethods = {}));
})(Associable || (Associable = {}));
export default Associable;
//
//
// var a: ClassDecorator = belongsTo;
//
// export function hasMany<T extends typeof Model>(target: T, options: any): void {
//   var model: typeof Model = options.klass;
//   var name: string = <string>model.constructor['name'];
//   var foreignKey = Utils.underscore(name) + "_id";
//
//   //
//   // return model.zoom('id').flatMap((id: number) => {
//   //   return Model.where((<T>target).all(), foreignKey, id);
//   // });
// }
//
// export function hasOne<T extends typeof Model>(target: T, options: any): void {
//   var model: typeof Model = options.klass;
//
//   // return hasMany(model, target);
// }
