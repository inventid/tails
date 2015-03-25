(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tails.Associations.Relation = (function(_super) {
    __extends(Relation, _super);

    function Relation() {
      return Relation.__super__.constructor.apply(this, arguments);
    }

    _.extend(Relation, Tails.Mixable);

    Relation.concern(Tails.Mixins.DynamicAttributes);

    Relation.concern(Tails.Mixins.Collectable);

    Relation.prototype.initialize = function() {};

    return Relation;

  })(Backbone.Model);

}).call(this);

//# sourceMappingURL=relation.js.map