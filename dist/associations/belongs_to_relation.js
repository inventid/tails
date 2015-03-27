(function() {
  var BelongsToRelation, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Relation = require('./relation');

  BelongsToRelation = (function(_super) {
    __extends(BelongsToRelation, _super);

    function BelongsToRelation() {
      return BelongsToRelation.__super__.constructor.apply(this, arguments);
    }

    BelongsToRelation.prototype.initialize = function() {
      var association, foreignKey, owner, to;
      association = this.get('association');
      to = association.get('to');
      foreignKey = this.get('foreignKey');
      owner = this.get('owner');
      this.getter({
        target: function() {
          return to.get(owner.get(foreignKey));
        }
      });
      this.setter({
        target: function(model) {
          if (model == null) {
            this.set(foreignKey, null);
            return;
          }
          if (to.all().get(model.id) == null) {
            to.all().add(model, {
              parse: true
            });
          }
          return owner.set(foreignKey, model.id);
        }
      });
      return BelongsToRelation.__super__.initialize.apply(this, arguments);
    };

    return BelongsToRelation;

  })(Relation);

  module.exports = BelongsToRelation;

}).call(this);

//# sourceMappingURL=belongs_to_relation.js.map
