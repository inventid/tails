import _Model            from './model';
import _Record           from './simple_record';
import _ObservableRecord from './observable_record';
import _MutableRecord    from './mutable_record';
import _SimpleRecord     from './simple_record';

module Tails {
  export var Model            = _Model;
  export var Record           = _SimpleRecord;
  export var ObservableRecord = _ObservableRecord;
  export var MutableRecord    = _MutableRecord;
  export var SimpleRecord     = _SimpleRecord;
}

export = Tails;
