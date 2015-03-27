(function() {
  var HasOneRelation, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Relation = require('./relation');

  HasOneRelation = (function(_super) {
    __extends(HasOneRelation, _super);

    function HasOneRelation() {
      return HasOneRelation.__super__.constructor.apply(this, arguments);
    }

    HasOneRelation.prototype.initialize = function() {
      var association, foreignKey, owner, source, through, to;
      owner = this.get('owner');
      association = this.get('association');
      to = association.get('to');
      foreignKey = this.get('foreignKey');
      through = this.get('through');
      source = this.get('source');
      if (through == null) {
        this.getter({
          target: (function(_this) {
            return function() {
              return to.all().where(foreignKey).is(owner.id).first();
            };
          })(this)
        });
        this.setter({
          target: (function(_this) {
            return function(model) {
              var _ref;
              if ((_ref = to.all().where(foreignKey).is(owner.id).first()) != null) {
                _ref.unset(foreignKey);
              }
              return model.set(foreignKey, owner.id);
            };
          })(this)
        });
      } else {
        this.getter({
          target: (function(_this) {
            return function() {
              return owner.get(through).get(source);
            };
          })(this)
        });
        this.setter({
          target: (function(_this) {
            return function(model) {
              return owner.get(through).set(source, model);
            };
          })(this)
        });
      }
      return HasOneRelation.__super__.initialize.apply(this, arguments);
    };

    return HasOneRelation;

  })(Relation);

  module.exports = HasOneRelation;

}).call(this);

//# sourceMappingURL=has_one_relation.js.map
