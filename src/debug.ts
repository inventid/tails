import { Model } from './model';
import { Mixable, isMixable } from './mixable';
import { Interceptable, isInterceptable } from './interceptable';

export interface Debug extends Interceptable {
}

export function Debug<T extends typeof Model, Mixable, Interceptable>(target: T): void {
  if (!isMixable(target)) Mixable(target);
  if (!isInterceptable(target)) Interceptable(target);

  (<any>target).concern(Debug);
}

export module Debug {
  export module ClassMethods {
    export function debug(...keys: string[]) {
      keys.forEach( (key) => {
        if (this[key] instanceof Function) {
          var debugFn = (context: any, fn: any, args: any[]) => {
            console.log("Intercept",context, key, fn, args);
            debugger
          }

          this.intercept({[key]: debugFn});
        }
      })
    }

    export function extended() {
      this.after({extend: (...args: any[]) => console.log("Extended", this ,...args)})
    }
  }
}

export function isDebug(obj: any): obj is Debug {
  return Object.keys(Debug.ClassMethods).reduce((memo: boolean, key: string): boolean => memo && !(obj[key] == null), true)
}

export default Debug;
