(function() {
  Tails.Mixins.Associable = {
    InstanceMethods: {
      relations: function() {
        if (this._relations == null) {
          this._relations = new Tails.Collection([], {
            model: Tails.Associations.Relation
          });
        }
        return this._relations;
      }
    },
    ClassMethods: {
      belongsTo: function(options) {
        return this.associate('belongsTo', options);
      },
      hasOne: function(options) {
        return this.associate('hasOne', options);
      },
      hasMany: function(options) {
        return this.associate('hasMany', options);
      },
      associate: function(type, options) {
        var association, attrs, name, to;
        name = _(options).keys()[0];
        to = options[name];
        attrs = {
          type: type,
          from: this,
          name: name,
          foreignKey: options.foreignKey,
          through: options.through,
          source: options.source
        };
        association = new Tails.Associations.Association(attrs);
        if (to.prototype instanceof Backbone.Model) {
          return association.set({
            to: to
          });
        } else {
          return association.getter({
            to: to
          });
        }
      },
      associations: function() {
        var _ref;
        if (!((_ref = this._associations) != null ? _ref.klass = this : void 0)) {
          this._associations = Tails.Associations.Association.all().where({
            from: this
          });
          this._associations.klass = this;
        }
        return this._associations;
      },
      extended: function() {
        this.concern(Tails.Mixins.DynamicAttributes);
        this.concern(Tails.Mixins.Collectable);
        this.concern(Tails.Mixins.Interceptable);
        return this.before({
          initialize: function() {
            return this.constructor.associations().each((function(_this) {
              return function(association) {
                return association.apply(_this);
              };
            })(this));
          }
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=associable.js.map
