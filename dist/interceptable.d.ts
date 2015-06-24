import { Model } from './model';
import { Mixable } from './mixable';
export interface Interceptable extends Mixable {
    intercept: <T>(obj: {
        [key: string]: any;
    }) => void;
    before: <T>(obj: {
        [key: string]: any;
    }) => void;
    after: <T>(obj: {
        [key: string]: any;
    }) => void;
}
export declare function Interceptable<T extends typeof Model, Mixable>(target: T): void;
export declare module Interceptable {
    module ClassMethods {
        function intercept<T>(obj: {
            [key: string]: any;
        }): void;
        function before<T>(obj: {
            [key: string]: any;
        }): void;
        function after<T>(obj: {
            [key: string]: any;
        }): void;
    }
}
export declare function isInterceptable(obj: any): ;
export default Interceptable;
