import { Model } from './model';
// import Collection from '../node_modules/sonic/dist/linked_list';
import { Mixable, isMixable } from './mixable';

export interface Interceptable extends Mixable {
  intercept: <T>(obj: {[key: string]: any}) => void;
  before: <T>(obj: {[key: string]: any}) => void;
  after: <T>(obj: {[key: string]: any}) => void;
}

export function Interceptable<T extends typeof Model, Mixable>(target: T): void {
  if (!isMixable(target)) Mixable(target);
  (<any>target).extend(Interceptable);
}

export module Interceptable {
  export module ClassMethods {
    export function intercept<T>(obj: {[key: string]: any}) {
      Object.keys(obj).forEach( (key) => {
        var _fn = obj[key].bind(this),
          fn = this[key].bind(this);
        this[key] = (...args: any[]) => {
          _fn(this, fn, args);
        }
      });
    }

    export function before<T>(obj: {[key: string]: any}) {
      Object.keys(obj).forEach( (key) => {
        var _fn = obj[key].bind(this),
          fn = this[key].bind(this);

        this[key] = (...args: any[]) => {
          _fn(...args);
          fn(...args)
        }
      })
    }

    export function after<T>(obj: {[key: string]: any}) {
      Object.keys(obj).forEach( (key) => {
        var _fn = obj[key].bind(this),
          fn = this[key].bind(this);

        this[key] = (...args: any[]) => {
          fn(...args)
          _fn(...args);
        }
      })
    }
  }
}

export function isInterceptable(obj: any): obj is Interceptable {
  return Object.keys(Interceptable.ClassMethods).reduce((memo: boolean, key: string): boolean => memo && !(obj[key] == null), true)
}

export default Interceptable;
