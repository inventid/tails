import { Model, ModelConstructor } from './model';
export interface Mixin {
    ClassMethods?: {};
    InstanceMethods?: {};
}
export interface Mixable extends ModelConstructor {
    _includedMixins: Mixin[];
    _extendedMixins: Mixin[];
    extend: (...mixins: Mixin[]) => void;
    include: (...mixins: Mixin[]) => void;
    corcern: (...mixins: Mixin[]) => void;
}
export declare function Mixable<T extends typeof Model>(target: T): void;
export declare module Mixable {
    module ClassMethods {
        var _includedMixins: Mixin[];
        var _extendedMixins: Mixin[];
        function extend(...mixins: Mixin[]): void;
        function include(...mixins: Mixin[]): void;
        function concern(...mixins: Mixin[]): void;
    }
}
export declare function isMixable(obj: any): ;
export default Mixable;
