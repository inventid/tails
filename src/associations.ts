import Model from './model';
import { Collectable, isCollectable } from './collectable';
import { IObservableList, ObservableList } from '../node_modules/sonic/dist/observable_list';
import Key from '../node_modules/sonic/dist/key';
import Utils from './utils';

export interface Associations extends Collectable {
}

export function Associations(target: typeof Model): void {
  if (!isCollectable(target)) Collectable(target);
  (<any>target).extend(Associations);
    // Object.keys(Associations).forEach( (key) => {
    //   target[key] = (...args: any[]) => Associations[key](target, ...args);
    // })
}

export module Associations {
  export module ClassMethods {
    export function belongsTo(target: Associations, options: any): void {
        var name: string = <string>target['name'];
        var foreignKey = Utils.underscore(name) + "_id";
        var model: typeof Model = options.klass;

        console.log(name, foreignKey, model)

        // return model.zoom(foreignKey).flatMap( (id: number) => {
        //   return Model.where(target.all(), "id", id);
        // });
    }
  }
}
export default Associations;

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
