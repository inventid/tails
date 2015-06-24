import { Model } from './model';
// import Collection from '../node_modules/sonic/dist/linked_list';
import Key from '../node_modules/sonic/dist/key';
import { Mixable, isMixable } from './mixable';
import Collection from './collection';

export interface Collectable extends Mixable {
  _collection: Collection<Model>;
  _keyFn: (model: Model) => Key;
  all: () => Collection<Model>;
}

export function Collectable<T extends typeof Model, Mixable>(target: T): void {
  if (!isMixable(target)) Mixable(target);
  (<any>target).extend(Collectable);
}

export module Collectable {
  export module ClassMethods {
    export var _collection: Collection<Model> = undefined;
    export function _keyFn(model: Model): Key {
      return model.id || null;
    };

    export function all(): Collection<Model> {
      return this._collection = this._collection ? this._collection : new Collection<Model>([], {keyFn: _keyFn});
    }
  }
}

export function isCollectable(obj: any): obj is Collectable {
  return Object.keys(Collectable.ClassMethods).reduce((memo: boolean, key: string): boolean => memo && !(obj[key] == null), true)
}

export default Collectable;
