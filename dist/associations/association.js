(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tails.Associations.Association = (function(_super) {
    __extends(Association, _super);

    function Association() {
      return Association.__super__.constructor.apply(this, arguments);
    }

    _.extend(Association, Tails.Mixable);

    Association.concern(Tails.Mixins.Debug);

    Association.concern(Tails.Mixins.DynamicAttributes);

    Association.concern(Tails.Mixins.Collectable);

    Association.prototype.relations = function() {
      if (this._relations == null) {
        this._relations = new Tails.Collection([], {
          model: Tails.Associations.Relation
        });
      }
      return this._relations;
    };

    Association.prototype.apply = function(owner) {
      var attrs, model, models, relation;
      attrs = {
        association: this,
        from: this.get('from'),
        to: this.get('to'),
        name: this.get('name'),
        owner: owner
      };
      switch (this.get('type')) {
        case 'belongsTo':
          model = owner.get(attrs.name);
          relation = new Tails.Associations.BelongsToRelation(_.extend(attrs, {
            foreignKey: this.get('foreignKey') || inflection.foreign_key(attrs.to.name || attrs.to.toString().match(/^function\s*([^\s(]+)/)[1])
          }));
          if (model != null) {
            relation.set("target", model);
          }
          break;
        case 'hasOne':
          model = owner.get(attrs.name);
          relation = new Tails.Associations.HasOneRelation(_.extend(attrs, {
            foreignKey: this.get('foreignKey') || inflection.foreign_key(attrs.from.name || attrs.from.toString().match(/^function\s*([^\s(]+)/)[1]),
            through: this.get('through'),
            source: this.get('source') || this.get('name')
          }));
          if (model != null) {
            relation.set("target", model);
          }
          break;
        case 'hasMany':
          models = owner.get(attrs.name);
          relation = new Tails.Associations.HasManyRelation(_.extend(attrs, {
            foreignKey: this.get('foreignKey') || inflection.foreign_key(attrs.from.name || attrs.from.toString().match(/^function\s*([^\s(]+)/)[1]),
            through: this.get('through'),
            source: this.get('source') || this.get('name')
          }));
          if (models != null) {
            relation.set("target", models);
          }
      }
      this.relations().add(relation);
      owner.relations().add(relation);
      owner.getter(attrs.name, function() {
        return relation.get('target');
      });
      return owner.setter(attrs.name, function(value) {
        return relation.set('target', value);
      });
    };

    return Association;

  })(Backbone.Model);

}).call(this);

//# sourceMappingURL=association.js.map
