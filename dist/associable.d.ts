import Model from './model';
import { Collectable } from './collectable';
import { Interceptable } from './interceptable';
export interface Associable extends Collectable, Interceptable {
}
export declare function Associable<T extends typeof Model, Collectable, Interceptable>(target: T): void;
export declare module Associable {
    module ClassMethods {
        function belongsTo<T extends typeof Model>(klass: T, options: any): void;
        function hasOne<T extends typeof Model>(klass: T, options: any): void;
        function hasMany<T extends typeof Model>(klass: T, options: any): void;
    }
}
export default Associable;
