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

export function Mixable<T extends typeof Model>(target: T): void {
  if (!isMixable(target)) Mixable.ClassMethods.extend.call(target, Mixable);
}

export module Mixable {
  export module ClassMethods {
    export var _includedMixins: Mixin[] = undefined;
    export var _extendedMixins: Mixin[] = undefined;

    export function extend(...mixins: Mixin[]) {
      mixins.forEach((mixin) => {
        // This becomes a non-enumerable property in the next part so it doesn't mess up with CoffeeScript extends
        this._extendedMixins = this._extendedMixins ? this._extendedMixins : [];

        if (mixin.ClassMethods == null || this._extendedMixins.indexOf(mixin) != -1) return;
        Object.keys(mixin.ClassMethods).forEach( (key) => {
          console.log(key);
          var _value: any = mixin.ClassMethods[key];
          _value = _value != null ? _value : this[key];

          var desc = {
            get: () => _value,
            set: (value: any) => _value = value,

            // This hides non-functions from derived classes
            enumerable: _value instanceof Function
          };
          Object.defineProperty(this, key, desc)
        })

        this._extendedMixins.push(mixin);

      })

    }

    export function include(...mixins: Mixin[]) {
      mixins.forEach((mixin) => {
        this._includedMixins = this._includedMixins ? this._includedMixins : [];

        if (mixin.InstanceMethods == null || this._includedMixins.indexOf(mixin) != -1) return;
        Object.keys(mixin.InstanceMethods).forEach( (key) => {
          this.prototype[key] = mixin.InstanceMethods[key];
        })

        this._includedMixins.push(mixin);
      })

    }

    export function concern(...mixins: Mixin[]) {
      extend(...mixins);
      concern(...mixins);
    }
  }
}

export function isMixable(obj: any): obj is Mixable {
  return Object.keys(Mixable).reduce((memo: boolean, key: string): boolean => memo && !(obj[key] == null), true)
}

export default Mixable;
