import { Mixable, isMixable } from './mixable';
export function Interceptable(target) {
    if (!isMixable(target))
        Mixable(target);
    target.extend(Interceptable);
}
export var Interceptable;
(function (Interceptable) {
    var ClassMethods;
    (function (ClassMethods) {
        function intercept(obj) {
            Object.keys(obj).forEach((key) => {
                var _fn = obj[key].bind(this), fn = this[key].bind(this);
                this[key] = (...args) => {
                    _fn(this, fn, args);
                };
            });
        }
        ClassMethods.intercept = intercept;
        function before(obj) {
            Object.keys(obj).forEach((key) => {
                var _fn = obj[key].bind(this), fn = this[key].bind(this);
                this[key] = (...args) => {
                    _fn(...args);
                    fn(...args);
                };
            });
        }
        ClassMethods.before = before;
        function after(obj) {
            Object.keys(obj).forEach((key) => {
                var _fn = obj[key].bind(this), fn = this[key].bind(this);
                this[key] = (...args) => {
                    fn(...args);
                    _fn(...args);
                };
            });
        }
        ClassMethods.after = after;
    })(ClassMethods = Interceptable.ClassMethods || (Interceptable.ClassMethods = {}));
})(Interceptable || (Interceptable = {}));
export function isInterceptable(obj) {
    return Object.keys(Interceptable.ClassMethods).reduce((memo, key) => memo && !(obj[key] == null), true);
}
export default Interceptable;
