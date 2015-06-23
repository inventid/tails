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

export function Mixable(target: typeof Model): void {
  // Mixable.ClassMethods.extend(<any>target, Mixable)
  if (isMixable(target)) return;

  Object.keys(Mixable).forEach( (key) => {
    if (Mixable[key] instanceof Function) {
      target[key] = (...args: any[]) => Mixable[key](target, ...args);
    }
    else target[key] = Mixable[key];
  });

  (<any>target)._extendedMixins.push(Mixable);
}

export module Mixable {
  // export module ClassMethods {
    export var _includedMixins: Mixin[] = [];
    export var _extendedMixins: Mixin[] = [];

    export var extend = (target: Mixable, ...mixins: Mixin[]) => {
      mixins.forEach((mixin) => {
        if (mixin.ClassMethods == null || _extendedMixins.indexOf(mixin) != -1) return;
        Object.keys(mixin.ClassMethods).forEach( (key) => {
          target[key] = mixin.ClassMethods[key];
        })
        target._extendedMixins.push(mixin);
      })

    }

    export var include = (target: Mixable, ...mixins: Mixin[]) => {
      mixins.forEach((mixin) => {
        if (mixin.InstanceMethods == null || _includedMixins.indexOf(mixin) != -1) return;
        Object.keys(mixin.InstanceMethods).forEach( (key) => {
          target.prototype[key] = mixin.InstanceMethods[key];
        })
        target._includedMixins.push(mixin);
      })

    }

    export var concern = (target: Mixable, ...mixins: Mixin[]) => {
      extend(target, ...mixins);
      concern(target, ...mixins);
    }
  // }
}

export function isMixable(obj: any): obj is Mixable {
  return Object.keys(Mixable).reduce((memo: boolean, key: string): boolean => memo && !(obj[key] == null), true)
}

export default Mixable;
