import { Model } from './model';
import LinkedList from '../node_modules/sonic/dist/linked_list';
import Key from '../node_modules/sonic/dist/key';
import { Mixable, isMixable } from './mixable';

export interface Collectable extends Mixable {
  _collection: LinkedList<Model>;
  _keyFn: (model: Model) => Key;
  all: () => LinkedList<Model>;
}

export function Collectable(target: typeof Model): void {
  if (!isMixable(target)) Mixable(target);
  (<any>target).extend(Collectable);
  // Object.keys(Collectable).forEach( (key) => {
  //   target[key] = (...args: any[]) => Collectable[key](target, ...args);
  // })
}

export module Collectable {
  export module ClassMethods {
    export var _collection: LinkedList<Model>;
    export function _keyFn(model: Model): Key {
      return model.id || null;
    };

    export function all(): LinkedList<Model> {
      if (_collection == null) _collection = new LinkedList<Model>([], _keyFn);
      return _collection;
    }
  }
}

export function isCollectable(obj: any): obj is Collectable {
  return Object.keys(Collectable.ClassMethods).reduce((memo: boolean, key: string): boolean => memo && !(obj[key] == null), true)
}

export default Collectable;
