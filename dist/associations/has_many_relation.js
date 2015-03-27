(function() {
  var Collection, HasManyRelation, Relation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Relation = require('./relation');

  Collection = require('../collection');

  HasManyRelation = (function(_super) {
    __extends(HasManyRelation, _super);

    function HasManyRelation() {
      return HasManyRelation.__super__.constructor.apply(this, arguments);
    }

    HasManyRelation.prototype.initialize = function() {
      var association, collection, foreignKey, name, owner, source, sourceAssociation, through, throughAssociation, to;
      association = this.get('association');
      to = association.get('to');
      owner = this.get('owner');
      name = this.get('name');
      foreignKey = this.get('foreignKey');
      through = this.get('through');
      source = this.get('source');
      if (through == null) {
        collection = to.all().where(foreignKey).is(owner.id);
        collection.parent = owner;
        this.getter({
          target: (function(_this) {
            return function() {
              return collection;
            };
          })(this)
        });
        return this.setter({
          target: (function(_this) {
            return function(models) {
              collection.each(function(model) {
                return model.unset(foreignKey);
              });
              return collection.add(models);
            };
          })(this)
        });
      } else {
        throughAssociation = owner.constructor.associations().findWhere({
          name: through
        });
        if (throughAssociation.get('type') !== 'hasMany') {
          return this.getter({
            target: (function(_this) {
              return function() {
                return owner.get(through).get(source || name);
              };
            })(this)
          });
        } else {
          sourceAssociation = (source && throughAssociation.get('to').associations().findWhere({
            name: source
          })) || throughAssociation.get('to').associations().findWhere({
            name: name,
            type: 'hasMany'
          }) || throughAssociation.get('to').associations().findWhere({
            name: inflection.singularize(name)
          });
          if (sourceAssociation.get('type') === 'hasMany') {
            source = sourceAssociation.get('name');
            return this.lazy({
              target: function() {
                var union;
                union = new Collection.Union();
                union.parent = owner;
                owner.get(through).each((function(_this) {
                  return function(model) {
                    return union.addCollection(model.get(source));
                  };
                })(this));
                owner.get(through).on('add', (function(_this) {
                  return function(model) {
                    return union.addCollection(model.get(source));
                  };
                })(this));
                owner.get(through).on('remove', (function(_this) {
                  return function(model) {
                    return union.removeCollection(model.get(source));
                  };
                })(this));
                return union;
              }
            });
          } else {
            source = sourceAssociation.get('name');
            return this.lazy({
              target: function() {
                return owner.get(through).pluck(source);
              }
            });
          }
        }
      }
    };

    return HasManyRelation;

  })(Relation);

  module.exports = HasManyRelation;

}).call(this);

//# sourceMappingURL=has_many_relation.js.map
