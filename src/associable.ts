import Model from './model';
import { Collectable, isCollectable } from './collectable';
import { Interceptable, isInterceptable } from './interceptable';
import { IObservableList, ObservableList } from '../node_modules/sonic/dist/observable_list';
import Key from '../node_modules/sonic/dist/key';
import Utils from './utils';

export interface Associable extends Collectable, Interceptable {
}

export function Associable<T extends typeof Model, Collectable, Interceptable>(target: T): void {
  if (!isCollectable(target)) Collectable(target);
  if (!isInterceptable(target)) Interceptable(target);
  (<any>target).concern(Associable);
}

export module Associable {
  export module ClassMethods {
    export function belongsTo<T extends typeof Model>(klass: T, options: any): void {
      throw new Error('Not implemented.')
        // var name: string = <string>this['name'];
        // var foreignKey = Utils.underscore(name) + "_id";
        //
        // console.log(name, foreignKey, klass);

        // return model.zoom(foreignKey).flatMap( (id: number) => {
        //   return Model.where(this.all(), "id", id);
        // });
    }

    export function hasOne<T extends typeof Model>(klass: T, options: any): void {
      throw new Error('Not implemented.')

      // return hasMany(klass, options);
    }

    export function hasMany<T extends typeof Model>(klass: T, options: any): void {
      throw new Error('Not implemented.')

      // var name: string = <string>klass['name'];
      // var foreignKey = Utils.underscore(name) + "_id";
      //
      // console.log(name, foreignKey, klass);

      //
      // return model.zoom('id').flatMap((id: number) => {
      //   return Model.where((<T>target).all(), foreignKey, id);
      // });
    }
  }
}
export default Associable;

//
