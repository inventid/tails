import Key from '../node_modules/sonic/dist/key';
import LinkedList from '../node_modules/sonic/dist/linked_list';
import { IObservableList, ObservableList } from '../node_modules/sonic/dist/observable_list';
import Utils from './utils';
// import {belongsTo} from './associations';

import SimpleRecord from '../node_modules/knuckles/dist/simple_record';

class Model extends SimpleRecord<any> {
  public id: Key;
  private static _collection: LinkedList<Model>;
  private static _keyFn(model: Model) {
    return model.id || null;
  };

  static all(): LinkedList<Model> {
    if (this._collection == null) this._collection = new LinkedList<Model>([], this._keyFn);
    return this._collection;
  }

  constructor(object: {[key: string]: any}) {
    super(object);
    (<typeof Model>this.constructor).all().push(this);
  }

  static where<T extends Model>(models: ObservableList<T>, key: Key, value: any): ObservableList<T> {
    return Model.pluck(models, key).filter((tuple: [T, any]): boolean => {
      var [model, _value] = tuple;
      return _value === value;
    }).map((tuple: [T, any]) => tuple[0]);
  }

  static pluck<T extends Model>(models: ObservableList<T>, key: Key): ObservableList<[T, any]> {
    return models.flatMap<[T, any]>((model: T) => {
      return model.zoom(key).map((value: any) => {
        return <[T, any]> [model, value];
      })
    })
  }


}

export default Model;
