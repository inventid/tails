import _Mixable from './mixable';
import _Collectable from './collectable';
import _Associable from './associable';
import _Interceptable from './interceptable';
import _Debug from './debug';
import _Model from './model';
import _Collection from './collection';
import _Utils from './utils';
var Tails;
(function (Tails) {
    var Mixins;
    (function (Mixins) {
        Mixins.Mixable = _Mixable;
        Mixins.Collectable = _Collectable;
        Mixins.Associable = _Associable;
        Mixins.Interceptable = _Interceptable;
        Mixins.Debug = _Debug;
    })(Mixins = Tails.Mixins || (Tails.Mixins = {}));
    Tails.Model = _Model;
    // export var View             = _View;
    Tails.Collection = _Collection;
    Tails.Utils = _Utils;
})(Tails || (Tails = {}));
module.exports = Tails;
