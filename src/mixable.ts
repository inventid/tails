import { Model, ModelConstructor } from './model';

export interface ObjectMixin {
  extended?: () => void;
  included?: () => void;
}

export interface ClassMixin {
  ClassMethods?: {};
  InstanceMethods?: {};
}

export function isClassMixin(obj: any): obj is ClassMixin {
  return obj.ClassMethods != null || obj.InstanceMethods != null;
}

export type Mixin = ObjectMixin | ClassMixin;

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
  export enum MixableKeywords {'included', 'extended', 'constructor', 'InstanceMethods', 'ClassMethods'};

  export module ClassMethods {
    export var _includedMixins: Mixin[] = undefined;
    export var _extendedMixins: Mixin[] = undefined;

    export function extend(...mixins: Mixin[]) {
      // This becomes a non-enumerable property in the next part so it doesn't mess up with CoffeeScript extends
      this._extendedMixins = this._extendedMixins ? this._extendedMixins : [];

      mixins.forEach((mixin) => {
        if (this._extendedMixins.indexOf(mixin) != -1) return;
        this._extendedMixins.push(mixin);

        var props: ObjectMixin = isClassMixin(mixin) ? (<ClassMixin>mixin).ClassMethods: mixin;
        Object.keys(props).forEach( (key) => {
          if (MixableKeywords[key] != null ) return;

          var _value: any = props[key];
          _value = _value != null ? _value : this[key];

          var desc = {
            get: () => _value,
            set: (value: any) => _value = value,

            // This hides non-functions from derived classes
            enumerable: _value instanceof Function
          };
          Object.defineProperty(this, key, desc)

        });
        if (props.extended instanceof Function) props.extended.apply(this);
      });

    }

    export function include(...mixins: Mixin[]) {
      this._includedMixins = this._includedMixins ? this._includedMixins : [];
      mixins.forEach((mixin) => {
        if (this._includedMixins.indexOf(mixin) != -1) return;
        this._includedMixins.push(mixin);

        var props: ObjectMixin = isClassMixin(mixin) ? (<ClassMixin>mixin).ClassMethods: mixin;
        Object.keys(props).forEach( (key) => {
          if (MixableKeywords[key] != null ) return;

          this.prototype[key] = props[key];
        });

        if (props.included instanceof Function) props.included.apply(this);
      });
    }

    export function concern(...mixins: Mixin[]) {
      extend.apply(this, mixins);
      include.apply(this, mixins);
    }
  }
}

export function isMixable(obj: any): obj is Mixable {
  return Object.keys(Mixable).reduce((memo: boolean, key: string): boolean => memo && !(obj[key] == null), true)
}

export default Mixable;
