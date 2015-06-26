import { Model } from './model';
import { Mixable } from './mixable';
import Collection from './collection';
export interface Collectable extends Mixable {
    all: Collection<Model>;
}
export declare function Collectable<T extends typeof Model, Mixable>(target: T): void;
export declare module Collectable {
    module ClassMethods {
        function extended(): void;
    }
}
export declare function isCollectable(obj: any): ;
export default Collectable;
