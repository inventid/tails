import Model from './model';
import { Collectable } from './collectable';
export interface Associable extends Collectable {
}
export declare function Associable(target: typeof Model): void;
export declare module Associable {
    module ClassMethods {
        function belongsTo(target: Associable, options: any): void;
    }
}
export default Associable;
