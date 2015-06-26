import { Model } from './model';
import { Interceptable } from './interceptable';
export interface Debug extends Interceptable {
}
export declare function Debug<T extends typeof Model, Mixable, Interceptable>(target: T): void;
export declare module Debug {
    module ClassMethods {
        function debug(...keys: string[]): void;
        function extended(): void;
    }
}
export declare function isDebug(obj: any): ;
export default Debug;
