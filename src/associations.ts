import Model from './model';
import { IObservableList, ObservableList } from '../node_modules/sonic/dist/observable_list';
import Utils from './utils';


export function belongsTo(options: any) {
  return <ClassDecorator>function(target: typeof Model): void {
    var name: string = <string>target['name'];
    var foreignKey = Utils.underscore(name) + "_id";
    var model: typeof Model = options.klass;

    // return model.zoom(foreignKey).flatMap( (id: number) => {
    //   return Model.where(target.all(), "id", id);
    // });
  }

}

var a: ClassDecorator = belongsTo;

export function hasMany<T extends typeof Model>(target: T, options: any): void {
  var model: typeof Model = options.klass;
  var name: string = <string>model.constructor['name'];
  var foreignKey = Utils.underscore(name) + "_id";

  //
  // return model.zoom('id').flatMap((id: number) => {
  //   return Model.where((<T>target).all(), foreignKey, id);
  // });
}

export function hasOne<T extends typeof Model>(target: T, options: any): void {
  var model: typeof Model = options.klass;

  // return hasMany(model, target);
}
