import { Mixable, isMixable } from './mixable';
import { Interceptable, isInterceptable } from './interceptable';
export function Debug(target) {
    if (!isMixable(target))
        Mixable(target);
    if (!isInterceptable(target))
        Interceptable(target);
    target.extend(Debug);
}
export var Debug;
(function (Debug) {
    var ClassMethods;
    (function (ClassMethods) {
        function debug(...keys) {
            keys.forEach((key) => {
                if (this[key] instanceof Function) {
                    var debugFn = (context, fn, args) => {
                        console.log("Intercept", context, key, fn, args);
                        debugger;
                    };
                    this.intercept({ [key]: debugFn });
                }
            });
        }
        ClassMethods.debug = debug;
    })(ClassMethods = Debug.ClassMethods || (Debug.ClassMethods = {}));
})(Debug || (Debug = {}));
export function isDebug(obj) {
    return Object.keys(Debug.ClassMethods).reduce((memo, key) => memo && !(obj[key] == null), true);
}
export default Debug;
