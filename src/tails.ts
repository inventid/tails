import _Mixable          from './mixable';
import _Collectable      from './collectable';
import _Associable       from './associable';
import _Interceptable    from './interceptable';
import _Debug            from './debug';

import _Model            from './model';
// import _View             from './view';
import _Collection       from './collection';

import _Utils            from './utils';

module Tails {
  export module Mixins {
    export var Mixable        = _Mixable;
    export var Collectable    = _Collectable;
    export var Associable     = _Associable;
    export var Interceptable  = _Interceptable;
    export var Debug          = _Debug;
  }

  export var Model            = _Model;
  // export var View             = _View;
  export var Collection       = _Collection;

  export var Utils            = _Utils;
}

declare var module: any;
module.exports = Tails;
