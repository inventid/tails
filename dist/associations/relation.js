(function() {
  var Collectable, DynamicAttributes, Mixable, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixable = require('../mixable');

  DynamicAttributes = require('../mixins/dynamic_attributes');

  Collectable = require('../mixins/collectable');

  Relation = (function(_super) {
    __extends(Relation, _super);

    function Relation() {
      return Relation.__super__.constructor.apply(this, arguments);
    }

    _.extend(Relation, Mixable);

    Relation.concern(DynamicAttributes);

    Relation.concern(Collectable);

    Relation.prototype.initialize = function() {};

    return Relation;

  })(Backbone.Model);

  module.exports = Relation;

}).call(this);

//# sourceMappingURL=relation.js.map
