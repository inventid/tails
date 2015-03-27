(function() {
  var Association, Collectable, Debug, DynamicAttributes, Mixable,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixable = require('../mixable');

  Collectable = require('../mixins/collectable');

  Debug = require('../mixins/debug');

  DynamicAttributes = require('../mixins/dynamic_attributes');

  Association = (function(_super) {
    __extends(Association, _super);

    function Association() {
      return Association.__super__.constructor.apply(this, arguments);
    }

    _.extend(Association, Mixable);

    Association.concern(Debug);

    Association.concern(DynamicAttributes);

    Association.concern(Collectable);

    Association.prototype.relations = function() {
      var Collection, Relation;
      Collection = require('../collection');
      Relation = require('./relation');
      if (this._relations == null) {
        this._relations = new Collection([], {
          model: Relation
        });
      }
      return this._relations;
    };

    Association.prototype.apply = function(owner) {
      var BelongsToRelation, HasManyRelation, HasOneRelation, attrs, model, models, relation;
      BelongsToRelation = require('./belongs_to_relation');
      HasOneRelation = require('./has_one_relation');
      HasManyRelation = require('./has_many_relation');
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
          relation = new BelongsToRelation(_.extend(attrs, {
            foreignKey: this.get('foreignKey') || inflection.foreign_key(attrs.to.name || attrs.to.toString().match(/^function\s*([^\s(]+)/)[1])
          }));
          if (model != null) {
            relation.set("target", model);
          }
          break;
        case 'hasOne':
          model = owner.get(attrs.name);
          relation = new HasOneRelation(_.extend(attrs, {
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
          relation = new HasManyRelation(_.extend(attrs, {
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

  module.exports = Association;

}).call(this);

//# sourceMappingURL=association.js.map
