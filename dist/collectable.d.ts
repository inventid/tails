import { Model } from './model';
import Key from '../node_modules/sonic/dist/key';
import { Mixable } from './mixable';
import Collection from './collection';
export interface Collectable extends Mixable {
    _collection: Collection<Model>;
    _keyFn: (model: Model) => Key;
    all: () => Collection<Model>;
}
export declare function Collectable<T extends typeof Model, Mixable>(target: T): void;
export declare module Collectable {
    module ClassMethods {
        var _collection: Collection<Model>;
        function _keyFn(model: Model): Key;
        function all(): Collection<Model>;
    }
}
export declare function isCollectable(obj: any): ;
export default Collectable;
