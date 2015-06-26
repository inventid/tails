import { Model, ModelConstructor } from './model';
export interface ObjectMixin {
    extended?: () => void;
    included?: () => void;
}
export interface ClassMixin {
    ClassMethods?: {};
    InstanceMethods?: {};
}
export declare function isClassMixin(obj: any): ;
export declare type Mixin = ObjectMixin | ClassMixin;
export interface Mixable extends ModelConstructor {
    _includedMixins: Mixin[];
    _extendedMixins: Mixin[];
    extend: (...mixins: Mixin[]) => void;
    include: (...mixins: Mixin[]) => void;
    corcern: (...mixins: Mixin[]) => void;
}
export declare function Mixable<T extends typeof Model>(target: T): void;
export declare module Mixable {
    enum MixableKeywords {
        'included' = 0,
        'extended' = 1,
        'constructor' = 2,
        'InstanceMethods' = 3,
        'ClassMethods' = 4,
    }
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
