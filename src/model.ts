import Key from '../node_modules/sonic/dist/key';
import { IObservableList, ObservableList } from '../node_modules/sonic/dist/observable_list';
import Utils from './utils';
import Mixable from './mixable';
import Collectable from './collectable';
import Associations from './associations';

import SimpleRecord from '../node_modules/knuckles/dist/simple_record';

export interface ModelConstructor {
  prototype: Model;
  new(object: {[key: string]: any}): Model;
}

@Mixable
@Collectable
@Associations
export class Model extends SimpleRecord<any> {
  public id: Key;

  constructor(object: {[key: string]: any}) {
    super(object);
    (<any>this.constructor).all().push(this);
  }

  // static where<T extends Model>(models: ObservableList<T>, key: Key, value: any): ObservableList<T> {
  //   return Model.pluck(models, key).filter((tuple: [T, any]): boolean => {
  //     var [model, _value] = tuple;
  //     return _value === value;
  //   }).map((tuple: [T, any]) => tuple[0]);
  // }
  //
  // static pluck<T extends Model>(models: ObservableList<T>, key: Key): ObservableList<[T, any]> {
  //   return models.flatMap<[T, any]>((model: T) => {
  //     return model.zoom(key).map((value: any) => {
  //       return <[T, any]> [model, value];
  //     })
  //   })
  // }


}

export default Model;
